Pod::Spec.new do |s|
  s.name         = "react-native-vlc-player"
  s.version      = "1.0.80"
  s.summary      = "VLC player"
  s.requires_arc = true
  s.author       = { 'simone.gauli' => 'simonegauli@gmail.com' }
  s.license      = 'MIT'
  s.homepage     = 'https://github.com/Pnlvfx/react-native-vlc-player.git'
  s.source       = { :git => "https://github.com/Pnlvfx/react-native-vlc-player.git" }
  s.source_files = 'ios/RCTVLCPlayer/*'
  s.ios.deployment_target = "13.0"
  s.tvos.deployment_target = "13.0"
  s.static_framework = true
  s.dependency 'React-Core'
  s.ios.dependency 'MobileVLCKit', '3.6.0'
  s.tvos.dependency 'TVVLCKit', '3.6.0'
end
