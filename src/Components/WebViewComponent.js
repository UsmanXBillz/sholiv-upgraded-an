/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import {Colors} from '../Config';

function WebViewComponent({
  url,
  isMuted = false,
  isAutoplay = false,
  showControls = true,
  webStyles = {},
  allowsFullscreenVideo = true,
  thumbnail = '', // Add thumbnail prop
}) {
  return (
    <View style={styles.backgroundVideo}>
      <WebView
        style={{flex: 1, opacity: 0.99, ...webStyles}}
        renderLoading={() => (
          <ActivityIndicator
            color={Colors.primary}
            size="large"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
        )}
        startInLoadingState={true}
        allowsFullscreenVideo={allowsFullscreenVideo} // Disable fullscreen mode
        scrollEnabled={false}
        javaScriptEnabled={true}
        allowsInlineMediaPlayback
        automaticallyAdjustContentInsets
        source={{
          html: `
          <html>
          <style>
            video::-webkit-media-controls {
              display: flex;
              justify-content: center;
              align-items: center;
            }
            video {
              background-color: black;
            }
          </style>
          <body>
            <video id="video" width="100%" height="100%" ${
              isMuted ? 'muted' : ''
            }
            ${isAutoplay ? 'autoplay' : ''} ${showControls ? 'controls' : ''}
            ${thumbnail ? `poster="${thumbnail}"` : ''}
            playsinline
            >
              <source src="${url}" type="video/mp4">
            </video>
            <script>
              const video = document.getElementById('video');
              if (!${showControls}) {
                video.removeAttribute('controls');
                video.play();
              }
            </script>
          </body>
        </html>
  `,
        }}
      />
    </View>
  );
}

export default WebViewComponent;

const styles = StyleSheet.create({
  backgroundVideo: {
    backgroundColor: Colors.black,
    width: '100%',
    height: '100%',
  },
});
