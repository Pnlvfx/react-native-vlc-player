#import "React/RCTView.h"
#import <React/RCTEventDispatcherProtocol.h>
#import <VLCKit/VLCKit.h>

@class RCTEventDispatcher;

@interface RCTVLCPlayer : UIView <VLCMediaPlayerDelegate>

@property (nonatomic, copy) RCTBubblingEventBlock onVideoProgress;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoPaused;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoStopped;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoBuffering;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoPlaying;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoEnded;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoError;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoOpen;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoLoadStart;
@property (nonatomic, copy) RCTBubblingEventBlock onVideoLoad;
@property (nonatomic, copy) RCTBubblingEventBlock onRecordingState;
@property (nonatomic, copy) RCTBubblingEventBlock onSnapshot;

- (instancetype)initWithEventDispatcher:(id<RCTEventDispatcherProtocol>)eventDispatcher NS_DESIGNATED_INITIALIZER;

- (void)setMuted:(BOOL)value;
- (void)startRecording:(NSString*)path;
- (void)stopRecording;
- (void)snapshot:(NSString*)path;

@end
