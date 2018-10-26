// RCTMapManager.m
#import <MapKit/MapKit.h>

#import <React/RCTViewManager.h>

@interface RCTMapManager : RCTViewManager
@end

@implementation RCTMapManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[MKMapView alloc] init];
}

@end

