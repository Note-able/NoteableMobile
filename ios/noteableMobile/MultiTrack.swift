import Foundation
import AudioToolbox
import AVFoundation

@objc(MultiTrack)
class MultiTrack : NSObject {

  private var audioBuffers: Array<UnsafeBufferPointer<Float32>>
  private var trackFileNames: [String: String]
  private var sampleRate: Double
  private var audioEngine: AVAudioEngine = AVAudioEngine()
  private var mixer: AVAudioMixerNode = AVAudioMixerNode()

  override init() {
    audioBuffers = [UnsafeBufferPointer]()
    trackFileNames = [String : String]()
    sampleRate = 0
  }

  @objc(AddTrack:fileName:)
  func AddTrack(id: String, fileName: String) {
    self.trackFileNames[id] = fileName
  }

  @objc(RemoveTrack:)
  func RemoveTrack(id: String) {
    self.trackFileNames.removeValue(forKey: id)
  }
  
  @objc(Start)
  func Start() {
    debugPrint("starting...")
    if trackFileNames.count == 0 {
      return;
    }
   
    DispatchQueue.global(qos: .background).async {
      debugPrint("Trying to start playing files")
      
      self.audioEngine.reset()
      self.audioEngine.attach(self.mixer)
      self.audioEngine.connect(self.mixer, to: self.audioEngine.outputNode, format: nil)
      debugPrint("attached mixer")
      
      var startFramePosition : AVAudioFramePosition? = nil
      var startTime : AVAudioTime? = nil
      let fileManager = FileManager.default
      for trackFile in self.trackFileNames {
        debugPrint("Trying to start playing \(trackFile.value)")
        let audioPlayer = AVAudioPlayerNode()
        let fileName = trackFile.value
        let fileUrl = NSURL.init(fileURLWithPath: fileName.removingPercentEncoding!)
        var file : AVAudioFile
        do {
          if fileManager.fileExists(atPath: fileUrl.path!) {
            file = try AVAudioFile.init(forReading: fileUrl.absoluteURL!)
          } else {
            debugPrint("Sucks to suck")
            file = AVAudioFile.init()
          }
        } catch let error {
          debugPrint(error)
          return
        }
        if self.sampleRate == 0 {
          self.sampleRate = file.fileFormat.sampleRate
        }
        // let format = AVAudioFormat(commonFormat: .pcmFormatFloat32, sampleRate: file.fileFormat.sampleRate, channels: 1, interleaved: false)
        do {
          try audioPlayer.scheduleFile(file, at: startTime, completionHandler: nil)
        } catch let error {
          debugPrint(error)
        }
        if startFramePosition == nil {
          startFramePosition = (audioPlayer.lastRenderTime?.sampleTime)!
          startTime = AVAudioTime.init(sampleTime: startFramePosition!, atRate: Double(self.mixer.rate))
        }
        self.audioEngine.attach(audioPlayer)
        self.audioEngine.connect(audioPlayer, to: self.mixer, format: nil)
        audioPlayer.play(at: startTime!)
        debugPrint("Scheduled \(trackFile.value)")
      }

      try! self.audioEngine.start()
      debugPrint("started engine?")
      /*(var buffersAvailable = true;
      var audioBufferPointers = Array<UnsafeBufferPointerIterator<Float32>>()
      var maxLength = 0
      for bufferPointer: UnsafeBufferPointer<Float32> in self.audioBuffers {
        audioBufferPointers.append(bufferPointer.makeIterator())
        maxLength = max(maxLength, bufferPointer.count)
      }
      
      let format = AVAudioFormat(commonFormat: .pcmFormatFloat32, sampleRate: self.sampleRate, channels: 1, interleaved: false)
      var pcmBuffer = Array<Float32>()
      while buffersAvailable {
        var pcmDataTotal : Float32 = 0
        for var audioBufferPointerIterator in audioBufferPointers {
          let pcmDatum = audioBufferPointerIterator.next()
          if pcmDatum != nil {
            pcmDataTotal += Float32(pcmDatum!)
          } else {
            fileCount = fileCount - 1;
            if (fileCount == 0) {
              buffersAvailable = false
            }
          }
        }
        pcmBuffer.append(pcmDataTotal)
      }
      var audioBuffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: 1024)
      pcmBuffer.*/
    }
  }

  func ReadAudioFileIntoFloatArray(fileName: String) {
    DispatchQueue.global(qos: .background).async {
      let fileUrl = NSURL.fileURL(withPath: fileName.removingPercentEncoding!)
      let file = try! AVAudioFile(forReading: fileUrl)
      if self.sampleRate == 0 {
        self.sampleRate = file.fileFormat.sampleRate
      }
      let format = AVAudioFormat(commonFormat: .pcmFormatFloat32, sampleRate: file.fileFormat.sampleRate, channels: 1, interleaved: false)
      
      let audioBuffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: 1024)
      try! file.read(into: audioBuffer)
      
      let floatBuffer = UnsafeBufferPointer(start: audioBuffer.floatChannelData?[0], count:Int(audioBuffer.frameLength))
      self.audioBuffers.append(floatBuffer)
    }
  }
}
