import React, {memo} from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Colors, Icons, Metrix} from '../Config';
import MultiLineTextField from './MultiLineTextField';

const ChatFooter = ({onSendMessage, onPickImage, text, setText}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <MultiLineTextField
          text={text}
          onChangeText={setText}
          style={{width: '100%'}}
        />
      </View>

      <TouchableOpacity onPress={onPickImage} style={styles.iconButton}>
        <Icons.Feather
          name={'image'}
          color={Colors.white}
          size={Metrix.customFontSize(22)}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSendMessage}
        style={[styles.iconButton, styles.sendButton]}>
        <Icons.Feather
          name={'send'}
          color={Colors.white}
          size={Metrix.customFontSize(22)}
        />
      </TouchableOpacity>
    </View>
  );
};

export default memo(ChatFooter);

const styles = StyleSheet.create({
  messageContainer: {
    borderRadius: 100,
    backgroundColor: Colors.backgroundGrayLight,
    height: Metrix.VerticalSize(Platform.OS === 'ios' ? 46 : 52),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Metrix.HorizontalSize(8),
    paddingVertical: Metrix.VerticalSize(8),
  },
  inputWrapper: {
    flex: 1,
    marginRight: Metrix.HorizontalSize(8),
  },
  iconButton: {
    backgroundColor: Colors.blue,
    padding: Metrix.VerticalSize(10),
    borderRadius: 11,
  },
  sendButton: {
    marginLeft: Metrix.HorizontalSize(6),
  },
});
