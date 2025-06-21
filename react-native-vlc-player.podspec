require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "react-native-vlc-player"
  s.version      = package['version']
  s.summary      = package['description']
  s.requires_arc = true
  s.homepage     = package['homepage']
  s.license      = package['license']
  s.authors      = package["author"]
  s.source       = { :git => "https://github.com/Pnlvfx/react-native-vlc-player.git" }
  s.source_files = "ios/**/*.{h,m,mm,cpp}"
  s.ios.deployment_target = "13.0"
  s.tvos.deployment_target = "13.0"
  s.dependency 'React-Core'
  s.dependency 'VLCKit', '4.0.0a13'
end
