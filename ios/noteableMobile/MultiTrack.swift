import Foundation
import AudioToolbox
import AVFoundation

@objc(MultiTrack)
class MultiTrack : NSObject {

  private var trackFileNames: [String: String]
  private var audioPlayerNodes: [String: AVAudioPlayerNode]
  private var audioPlayerFiles: [String: AVAudioFile]
  private var audioEngine: AVAudioEngine = AVAudioEngine()
  private var mixer: AVAudioMixerNode = AVAudioMixerNode()

  override init() {
    trackFileNames = [String : String]()
    audioPlayerNodes = [String : AVAudioPlayerNode]()
    audioPlayerFiles = [String : AVAudioFile]()
    
    self.audioEngine.attach(self.mixer)
    self.audioEngine.connect(self.mixer, to: self.audioEngine.outputNode, format: nil)
  }

  @objc(AddTrack:fileName:)
  func AddTrack(id: String, fileName: String) {
    self.trackFileNames[id] = fileName
    
    let fileManager = FileManager.default
    let audioPlayer = AVAudioPlayerNode()
    self.audioEngine.attach(audioPlayer)
    self.audioEngine.connect(audioPlayer, to: self.mixer, format: nil)
    let fileUrl = NSURL.init(fileURLWithPath: fileName.removingPercentEncoding!)
    var file : AVAudioFile
    do {
      if fileManager.fileExists(atPath: fileUrl.path!) {
        file = try AVAudioFile.init(forReading: fileUrl.absoluteURL!)
      } else {
        return
      }
    } catch let error {
      debugPrint(error)
      return
    }
    self.audioPlayerNodes[id] = audioPlayer
    self.audioPlayerFiles[id] = file
  }

  @objc(RemoveTrack:)
  func RemoveTrack(id: String) {
    self.trackFileNames.removeValue(forKey: id)
    self.audioEngine.detach(self.audioPlayerNodes[id]!)
    self.audioPlayerNodes.removeValue(forKey: id)
    self.audioPlayerFiles.removeValue(forKey: id)
  }
  
  @objc(Start)
  func Start() {
    if trackFileNames.count == 0 {
      return
    }
   
    DispatchQueue.global(qos: .background).async {
      if self.audioEngine.isRunning {
        self.audioEngine.stop()
      }
      try! self.audioEngine.start()
      
      var startFramePosition : AVAudioFramePosition? = nil
      var startTime : AVAudioTime? = nil
      
      for audioPlayerKVP in self.audioPlayerNodes {
        let audioPlayer : AVAudioPlayerNode = audioPlayerKVP.value
        let file : AVAudioFile = self.audioPlayerFiles[audioPlayerKVP.key]!
        if audioPlayer.isPlaying {
          audioPlayer.stop()
          audioPlayer.reset()
        }
        audioPlayer.scheduleFile(file, at: nil, completionHandler: nil)
        if startFramePosition == nil {
          audioPlayer.play(at: nil)
          startFramePosition = (audioPlayer.lastRenderTime?.sampleTime)!
          startTime = AVAudioTime.init(sampleTime: startFramePosition!, atRate: Double(self.mixer.rate))
        } else {
          audioPlayer.play(at: startTime!)
        }
      }
    }
  }
}
