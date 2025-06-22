#import "React/RCTConvert.h"
#import "RCTVLCPlayer.h"
#import "React/RCTBridgeModule.h"
#import "React/RCTEventDispatcher.h"
#import "React/UIView+React.h"
#import <VLCKit/VLCKit.h>

static NSString *const statusKeyPath = @"status";
static NSString *const playbackLikelyToKeepUpKeyPath = @"playbackLikelyToKeepUp";
static NSString *const playbackBufferEmptyKeyPath = @"playbackBufferEmpty";
static NSString *const readyForDisplayKeyPath = @"readyForDisplay";
static NSString *const playbackRate = @"rate";


#if !defined(DEBUG) && !(TARGET_IPHONE_SIMULATOR)
#define NSLog(...)
#endif


@implementation RCTVLCPlayer
{
    
    /* Required to publish events */
    id<RCTEventDispatcherProtocol> _eventDispatcher;
    VLCMediaPlayer *_player;
    
    NSDictionary * _videoInfo;
    NSURL * _subtitleUri;
    
    BOOL _paused;
    BOOL _autoplay;
}

- (instancetype)initWithEventDispatcher:(id<RCTEventDispatcherProtocol>)eventDispatcher
{
    if ((self = [super initWithFrame:CGRectZero])) {
        _eventDispatcher = eventDispatcher;
        
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(applicationWillResignActive:)
                                                     name:UIApplicationWillResignActiveNotification
                                                   object:nil];
        
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(applicationWillEnterForeground:)
                                                     name:UIApplicationWillEnterForegroundNotification
                                                   object:nil];
        
    }
    
    return self;
}

- (instancetype)initWithFrame:(CGRect)frame {
    NSLog(@"🔧 [VLCPlayer] InitWithFrame called");
    return [self initWithEventDispatcher:nil];
}

- (instancetype)initWithCoder:(NSCoder *)coder {
    NSLog(@"🔧 [VLCPlayer] InitWithCoder called");
    return [self initWithEventDispatcher:nil];
}

- (void)applicationWillEnterForeground:(NSNotification *)notification
{
    NSLog(@"📱 [VLCPlayer] App entering foreground, paused: %@", _paused ? @"YES" : @"NO");
        if (!_paused) {
            NSLog(@"▶️ [VLCPlayer] Resuming playback from foreground");
            [self play];
        }
}

- (void)applicationWillResignActive:(NSNotification *)notification
{
    NSLog(@"📱 [VLCPlayer] App resigning active, paused: %@", _paused ? @"YES" : @"NO");
    if (!_paused) {
        NSLog(@"⏸️ [VLCPlayer] Pausing playback for background");
        [self pause];
    }
}

- (void)play
{
    if (_player) {
        [_player play];
        _paused = NO;
    }
}

- (void)pause
{
    if (_player) {
        [_player pause];
        _paused = YES;
    }
}

- (void)setSource:(NSDictionary *)source
{
    NSLog(@"🎬 [VLCPlayer] Setting source: %@", source);
    if (_player) {
        NSLog(@"🗑️ [VLCPlayer] Releasing existing player");
        [self _release];
    }
    
    _videoInfo = nil;
    
    NSString* uriString = [source objectForKey:@"uri"];
    NSURL* uri = [NSURL URLWithString:uriString];
    int initType = [[source objectForKey:@"initType"] intValue];
    NSArray* initOptions = [source objectForKey:@"initOptions"];
    
    NSLog(@"🎬 [VLCPlayer] URI: %@", uriString);
       NSLog(@"🎬 [VLCPlayer] Init type: %d", initType);
       NSLog(@"🎬 [VLCPlayer] Init options: %@", initOptions);
    
    if (initType == 1) {
        _player = [[VLCMediaPlayer alloc] init];
    } else {
        _player = [[VLCMediaPlayer alloc] initWithOptions:initOptions];
    }
    _player.delegate = self;
    _player.drawable = self;
    
    _player.media = [VLCMedia mediaWithURL:uri];
    
    if (_autoplay)
        [_player play];
}

- (void)setAutoplay:(BOOL)autoplay
{
    _autoplay = autoplay;
    
    if (autoplay)
        [self play];
}

- (void)setPaused:(BOOL)paused
{
    _paused = paused;
    
    if (!paused) {
        [self play];
    } else {
        [self pause];
    }
}

- (void)setResume:(BOOL)resume
{
    if (resume) {
        [self play];
    } else {
        [self pause];
    }
}

- (void)setSubtitleUri:(NSString *)subtitleUri
{
    NSURL *url = [NSURL URLWithString:subtitleUri];
    
    if (url.absoluteString.length != 0 && _player) {
        _subtitleUri = url;
        [_player addPlaybackSlave:_subtitleUri type:VLCMediaPlaybackSlaveTypeSubtitle enforce:YES];
    } else {
        NSLog(@"Invalid subtitle URI: %@", subtitleUri);
    }
}

// ==== player delegate methods ====

- (void)mediaPlayerTimeChanged:(NSNotification *)aNotification
{
    [self updateVideoProgress];
}

- (void)mediaPlayerStateChanged:(VLCMediaPlayerState)aState
{
    if (_player) {
        switch (aState) {
            case VLCMediaPlayerStateOpening: {
                NSLog(@"🔄 [VLCPlayer] Opening media...");
                self.onVideoOpen(@{
                    @"target": self.reactTag
                });
                self.onVideoLoadStart(@{
                    @"target": self.reactTag
                });
                break;
            }
            case VLCMediaPlayerStatePaused: {
                NSLog(@"⏸️ [VLCPlayer] Playback paused");
                _paused = YES;
                self.onVideoPaused(@{
                    @"target": self.reactTag
                });
                break;
            }
            case VLCMediaPlayerStateStopped: {
                int currentTime   = [[_player time] intValue];
                int remainingTime = [[_player remainingTime] intValue];
                int duration      = [_player.media.length intValue];
                NSLog(@"⏹️ [VLCPlayer] Playback stopped - Current: %dms, Remaining: %dms, Duration: %dms, Position: %.3f",
                                      currentTime, remainingTime, duration, _player.position);
                if (duration > 0 && currentTime > 0 && (remainingTime == 0 || _player.position >= 0.95)) {
                    self.onVideoEnded(@{
                        @"target": self.reactTag,
                        @"currentTime": [NSNumber numberWithInt:currentTime],
                        @"remainingTime": [NSNumber numberWithInt:remainingTime],
                        @"duration":[NSNumber numberWithInt:duration],
                        @"position":[NSNumber numberWithFloat:_player.position]
                    });
                } else {
                    self.onVideoStopped(@{
                        @"target": self.reactTag
                    });
                }
                break;
            }
            case VLCMediaPlayerStateBuffering: {
                NSLog(@"🔄 [VLCPlayer] Buffering...");
                self.onVideoBuffering(@{
                    @"target": self.reactTag
                });
                break;
            }
            case VLCMediaPlayerStatePlaying: {
                NSLog(@"🔄 [VLCPlayer] Buffering...");
                _paused = NO;
                self.onVideoPlaying(@{
                    @"target": self.reactTag,
                    @"seekable": [NSNumber numberWithBool:[_player isSeekable]],
                    @"duration":[NSNumber numberWithInt:[_player.media.length intValue]]
                });
                break;
            }
            case VLCMediaPlayerStateError:  {
                NSLog(@"❌ [VLCPlayer] Player error occurred");
                self.onVideoError(@{
                    @"target": self.reactTag
                });
                [self _release];
                break;
            }
            default: {
                NSLog(@"🔄 [VLCPlayer] Unknown state: %ld", (long)aState);
                break;
            }
        }
    }
}


//   ===== media delegate methods =====

- (void)mediaPlayer:(VLCMediaPlayer *)player recordingStoppedAtPath:(NSString *)path {
    if (self.onRecordingState) {
        self.onRecordingState(@{
            @"target": self.reactTag,
            @"isRecording": @NO,
            @"recordPath": path ?: [NSNull null]
        });
    }
}

//   ===================================

- (void)updateVideoProgress
{
    if (_player && !_paused) {
        int currentTime   = [[_player time] intValue];
        int remainingTime = [[_player remainingTime] intValue];
        int duration      = [_player.media.length intValue];
        
        [self updateVideoInfo];
        self.onVideoProgress(@{
            @"target": self.reactTag,
            @"currentTime": [NSNumber numberWithInt:currentTime],
            @"remainingTime": [NSNumber numberWithInt:remainingTime],
            @"duration":[NSNumber numberWithInt:duration],
            @"position":[NSNumber numberWithFloat:_player.position],
        });
        
    }
}

- (void)updateVideoInfo
{
    NSMutableDictionary *info = [NSMutableDictionary new];
    info[@"duration"] = _player.media.length.value;
    if (_player.videoSize.width > 0) {
        info[@"videoSize"] =  @{
            @"width":  @(_player.videoSize.width),
            @"height": @(_player.videoSize.height)
        };
    }
    
    NSArray *audioTracks = [_player audioTracks];
    
    if ([audioTracks count] > 0) {
        NSMutableArray *tracks = [NSMutableArray new];
        for (NSNumber *trackId in audioTracks) {
            if (trackId) {
                [tracks addObject: @{
                    @"id": trackId,
                }];
            }
        }
        info[@"audioTracks"] = tracks;
    }
    
    NSArray *textTracks = [_player textTracks];
    
    if ([textTracks count] > 0) {
        NSMutableArray *tracks = [NSMutableArray new];
        for (NSNumber *trackId in textTracks) {
            if (trackId) {
                [tracks addObject: @{
                    @"id": trackId,
                }];
            }
        }
        info[@"textTracks"] = tracks;
    }
    
    if (![_videoInfo isEqualToDictionary:info]) {
        self.onVideoLoad(info);
        _videoInfo = info;
    }
}

- (void)jumpBackward:(int)interval
{
    NSLog(@"⏪ [VLCPlayer] Jump backward: %d seconds", interval);
    if (interval>=0 && interval <= [_player.media.length intValue])
        [_player jumpBackward:interval];
}

- (void)jumpForward:(int)interval
{
    NSLog(@"⏩ [VLCPlayer] Jump forward executed");
    if (interval>=0 && interval <= [_player.media.length intValue])
        [_player jumpForward:interval];
}

- (void)setSeek:(float)pos
{
    NSLog(@"🎯 [VLCPlayer] Seeking to position: %.3f", pos);
    if ([_player isSeekable]) {
        if (pos>=0 && pos <= 1) {
            [_player setPosition:pos];
        }
    }
}

- (void)setSnapshotPath:(NSString*)path
{
    if (_player)
        [_player saveVideoSnapshotAt:path withWidth:0 andHeight:0];
}

- (void)setRate:(float)rate
{
    [_player setRate:rate];
}

- (void)setAudioTrack:(int)track
{
    NSLog(@"🎵 [VLCPlayer] Selecting audio track: %d", track);
    [_player selectTrackAtIndex:track type:VLCMediaTrackTypeAudio];
}

- (void)setTextTrack:(int)track
{
    NSLog(@"📝 [VLCPlayer] Selecting text track: %d", track);
    [_player selectTrackAtIndex:track type:VLCMediaTrackTypeText];
}

- (void)startRecording:(NSString*)path
{
    [_player startRecordingAtPath:path];
    if (self.onRecordingState) {
        self.onRecordingState(@{
            @"target": self.reactTag,
            @"isRecording": @YES,
            @"recordPath": path ?: [NSNull null]
        });
    }
}

- (void)stopRecording
{
    [_player stopRecording];
}

- (void)snapshot:(NSString*)path
{
    @try {
        if (_player) {
            [_player saveVideoSnapshotAt:path withWidth:_player.videoSize.width andHeight:_player.videoSize.height];
            self.onSnapshot(@{
                @"success": @YES,
                @"path": path,
                @"error": [NSNull null],
                @"target": self.reactTag
            });
        } else {
            @throw [NSException exceptionWithName:@"PlayerNotInitialized" reason:@"Player is not initialized" userInfo:nil];
        }
    } @catch (NSException *e) {
        NSLog(@"Error in snapshot: %@", e);
        self.onSnapshot(@{
            @"success": @NO,
            @"error": [e description],
            @"target": self.reactTag
        });
    }
}


- (void)setVideoAspectRatio:(NSString *)ratio{
    [_player setVideoAspectRatio:ratio];
}

- (void)setMuted:(BOOL)value
{
    if (_player) {
        [[_player audio] setMuted:value];
    }
}

- (void)_release
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    if (_player) {
        if (_player.media) {
            [_player stop];
        }
        _player.delegate = nil;
        _player = nil;
    }
    
    _eventDispatcher = nil;
    _videoInfo = nil;
}


#pragma mark - Lifecycle
- (void)removeFromSuperview
{
    NSLog(@"🗑️ [VLCPlayer] Removing from superview");
    [self _release];
    [super removeFromSuperview];
}

@end
