import React from 'react';
import {StyleSheet, View} from 'react-native';
import {WebViewComponent} from '.';
import {Colors, Metrix} from '../Config';

const VideoContainer = ({
  video,
  style = {},
  showControls,
  initialMuted,
  allowsFullscreenVideo,
  autoPlay,
}) => {
  return (
    <View style={[styles.videoContainerWrapper, style]}>
      <WebViewComponent
        url={video}
        isMuted={initialMuted}
        isAutoplay={autoPlay}
        showControls={showControls}
        webStyles={style}
        allowsFullscreenVideo={allowsFullscreenVideo}
      />
    </View>
  );
};

export default VideoContainer;

const styles = StyleSheet.create({
  videoContainerWrapper: {
    width: '100%',
    height: '100%',
  },
});
