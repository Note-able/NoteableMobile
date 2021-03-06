//
//  MultiTrack.m
//  noteableMobile
//
//  Created by Ian Mundy on 10/20/17.
//  Copyright © 2017 Facebook. All rights reserved.
//
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MultiTrack, NSObject)

RCT_EXTERN_METHOD(AddTrack:(NSString *)id fileName:(NSString *)fileName)
RCT_EXTERN_METHOD(RemoveTrack:(NSString *)id)
RCT_EXTERN_METHOD(Start:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(Stop)
RCT_EXTERN_METHOD(WriteMixToFile:(NSString *)fileName resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end
