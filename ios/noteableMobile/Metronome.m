//
//  Metronome.m
//  noteableMobile
//
//  Created by Ian Mundy on 9/17/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

// Metronome.m
#import "Metronome.h"
#import <AudioToolbox/AudioToolbox.h>
#import <AVFoundation/AVFoundation.h>
#import <React/RCTUtils.h>



@implementation Metronome {
  AVAudioPlayer *player;
  NSTimer *timer;
}

-(void) playMetronomeSound:(NSTimer *) t{
  int metronomeCount = [t.userInfo[@"metronomeCount"] intValue];
  int beatsInBar = [t.userInfo[@"beatsInBar"] intValue];
  int countLimit = [t.userInfo[@"countLimit"] intValue];
  bool alwaysOn = [t.userInfo[@"alwaysOn"] boolValue];
  if (metronomeCount == countLimit) {
    RCTResponseSenderBlock callback = t.userInfo[@"callback"];
    callback(@[[NSNull null], @[]]);
    if (!alwaysOn) {
      [t invalidate];
    } else {
      player.volume = 1;
      [player play];
      metronomeCount++;
      t.userInfo[@"metronomeCount"] = [NSNumber numberWithInt:metronomeCount];
    }
  } else {
    if (metronomeCount % beatsInBar  == 0) {
      player.volume = 1;
    } else {
      player.volume = 0.5;
    }
    [player play];
    metronomeCount++;
    t.userInfo[@"metronomeCount"] = [NSNumber numberWithInt:metronomeCount];
  }
}

// To export a module named Metronome
RCT_EXPORT_MODULE();

// final Integer countLimit, final Integer bpm, final Boolean alwaysOn, final Callback callback
RCT_EXPORT_METHOD(
  start:(nonnull NSNumber *)countLimit
  withBPM:(double)bpm
  withBeats:(nonnull NSNumber *)beatsInBar
  isAlwaysOn:(BOOL) alwaysOn
  withCallback:(RCTResponseSenderBlock) callback)
{
  NSString *soundFilePath = [NSString stringWithFormat:@"%@/metronome.wav",[[NSBundle mainBundle] resourcePath]];
  NSURL *soundFileURL = [NSURL fileURLWithPath:soundFilePath];
  player = [[AVAudioPlayer alloc] initWithContentsOfURL:soundFileURL error:nil];
  //// player.numberOfLoops = -1; //Infinite
  [player prepareToPlay];

  NSMutableDictionary *timerInfo = [NSMutableDictionary new];
  [timerInfo setObject:countLimit forKey:@"countLimit"];
  [timerInfo setObject:beatsInBar forKey:@"beatsInBar"];
  [timerInfo setObject:[NSNumber numberWithInt:0] forKey:@"metronomeCount"];
  [timerInfo setObject:[NSNumber numberWithBool:alwaysOn] forKey:@"alwaysOn"];
  [timerInfo setObject:callback forKey:@"callback"];
  timer = [NSTimer timerWithTimeInterval: 60.0 / bpm
            target: self
            selector:@selector(playMetronomeSound:)
            userInfo:timerInfo
            repeats:YES];
  [[NSRunLoop mainRunLoop] addTimer:timer forMode:NSRunLoopCommonModes];
}

RCT_EXPORT_METHOD(stop)
{
  [timer invalidate];
}

@end
