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
  }

  @objc(AddTrack:fileName:)
  func AddTrack(id: String, fileName: String) {
    self.trackFileNames[id] = fileName
    
    let fileManager = FileManager.default
    let audioPlayer = AVAudioPlayerNode()
    self.audioEngine.attach(audioPlayer)
    self.audioEngine.connect(audioPlayer, to: self.audioEngine.mainMixerNode, format: nil)
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
  
  @objc(Stop)
  func Stop() {
    if self.audioEngine.isRunning {
      self.audioEngine.stop()
    }
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
  
  @available(iOS 11.0, *)
  @objc(WriteMixToFile:)
  func WriteMixToFile(fileName: String) {
    DispatchQueue.global(qos: .background).async {
      if self.audioEngine.isRunning {
        self.audioEngine.stop()
      }
      
      for audioPlayerKVP in self.audioPlayerNodes {
        let audioPlayer : AVAudioPlayerNode = audioPlayerKVP.value
        let file : AVAudioFile = self.audioPlayerFiles[audioPlayerKVP.key]!
        if audioPlayer.isPlaying {
          audioPlayer.stop()
          audioPlayer.reset()
        }
        audioPlayer.scheduleFile(file, at: nil, completionHandler: nil)
      }
      
      /*self.mixer.installTap(onBus: 0, bufferSize: 2048, format: self.mixer.outputFormat(forBus: 0), block: { (buffer, _) in
        try! file.write(from: buffer)
        file.framePosition = file.length
      })*/
      let format = self.audioPlayerFiles.values.first?.processingFormat
      do {
        let maxNumberOfFrames: AVAudioFrameCount = 4096
        try self.audioEngine.enableManualRenderingMode(.offline, format: format!, maximumFrameCount: maxNumberOfFrames)
      } catch {
        fatalError("could not enable manual rendering mode, \(error)")
      }
      
      try! self.audioEngine.start()
      
      var startFramePosition : AVAudioFramePosition? = nil
      var startTime : AVAudioTime? = nil
      var longestFileLength = AVAudioFramePosition.init(0)
      
      for audioPlayerKVP in self.audioPlayerNodes {
        let audioPlayer : AVAudioPlayerNode = audioPlayerKVP.value
        let file : AVAudioFile = self.audioPlayerFiles[audioPlayerKVP.key]!
        if file.length > longestFileLength {
          longestFileLength = file.length
        }
        if startFramePosition == nil {
          audioPlayer.play(at: nil)
          startFramePosition = (audioPlayer.lastRenderTime?.sampleTime)!
          startTime = AVAudioTime.init(sampleTime: startFramePosition!, atRate: Double(self.mixer.rate))
        } else {
          audioPlayer.play(at: startTime!)
        }
      }
      
      let buffer: AVAudioPCMBuffer = AVAudioPCMBuffer(pcmFormat: self.audioEngine.manualRenderingFormat, frameCapacity: self.audioEngine.manualRenderingMaximumFrameCount)
      let fileUrl = URL(string: "\(fileName).aac")
      let settings: [String: Any] = [
        AVFormatIDKey: kAudioFormatMPEG4AAC,
        AVSampleRateKey: 22050.0,
        AVNumberOfChannelsKey: 1,
        AVEncoderAudioQualityKey: AVAudioQuality.medium.rawValue,
        AVEncoderBitRatePerChannelKey: 16
      ]
      let file = try! AVAudioFile(forWriting: fileUrl!, settings: settings)
      
      while self.audioEngine.manualRenderingSampleTime < longestFileLength {
        do {
          let framesToRender = min(buffer.frameCapacity, AVAudioFrameCount(longestFileLength - self.audioEngine.manualRenderingSampleTime))
          let status = try self.audioEngine.renderOffline(framesToRender, to: buffer)
          switch status {
          case .success:
            try file.write(from: buffer)
            
          case .insufficientDataFromInputNode:
            break
            
          case .cannotDoInCurrentContext:
            break
            
          case .error:
            fatalError("render failed")
          }
        } catch {
          fatalError("render failed, \(error)")
        }
      }
      for audioPlayerKVP in self.audioPlayerNodes {
        let audioPlayer : AVAudioPlayerNode = audioPlayerKVP.value
        audioPlayer.stop()
      }
      self.audioEngine.stop()
    }
  }
}
