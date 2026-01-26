import React, {memo, useState} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, Icons, Images, Metrix} from '../Config';
import AnimatedHeart from './AnimatedHeart';
import MultiLineTextField from './MultiLineTextField';

const LiveStreamFooter = ({
  text,
  setText,
  onSend,
  onReactionPress,
  onGiftPress,
  onChangeText,
  isHost = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.keyboardContainer}>
        <MultiLineTextField
          text={text}
          setText={setText}
          style={styles.textInputContainer}
          containerStyle={styles.messageContainer}
          backgroundColor={Colors.liveColorCode}
          placeholderColor={Colors.placeholderLight}
          onChangeText={onChangeText}
        />
        <TouchableOpacity onPress={onSend} style={styles.sendContainer}>
          <Icons.Feather
            name={'send'}
            color={Colors.white}
            size={Metrix.customFontSize(18)}
            style={{
              backgroundColor: Colors.blue,
              padding: Metrix.VerticalSize(12),
              borderRadius: 10,
            }}
          />
        </TouchableOpacity>
      </View>
      {!isHost && (
        <View style={styles.reactionContainer}>
          <AnimatedHeart
            onPress={() => onReactionPress({type: 1})}
            style={{right: 40}}
          />
          <AnimatedHeart
            onPress={() => onReactionPress({type: 2})}
            style={{right: 40}}
            image={Images.heart}
          />
          <AnimatedHeart
            onPress={() => onReactionPress({type: 3})}
            style={{right: 40}}
            image={Images.wow}
          />
          <TouchableOpacity onPress={onGiftPress} style={{}}>
            <Image source={Images.gift} style={styles.giftImage} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default memo(LiveStreamFooter);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // flex:1
    height: Metrix.VerticalSize(80),
  },
  keyboardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textInputContainer: {},
  messageContainer: {
    width: '87%',
  },
  sendContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactionContainer: {
    flexDirection: 'column',
    gap: 10,
    position: 'absolute',
    right: 10,
    bottom: 100,
  },
  giftImage: {
    height: Metrix.VerticalSize(30),
    aspectRatio: 1,
  },
});
