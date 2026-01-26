import React, {memo} from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Colors, Icons, Metrix} from '../Config';
import MultiLineTextField from './MultiLineTextField';

const ChatFooter = ({onSendMessage, onPickImage, text, setText}) => {
  return (
    <View style={styles.container}>
      <View style={{flex: 1, width: '80%'}}>
        <MultiLineTextField
          text={text}
          onChangeText={setText}
          style={{width: '98%'}}
        />
      </View>

      <TouchableOpacity
        onPress={onPickImage}
        style={styles.galleryIconContainer}>
        <Icons.Feather
          name={'image'}
          color={Colors.white}
          size={Metrix.customFontSize(22)}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onSendMessage} style={styles.senIconContainer}>
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
    marginBottom: Metrix.VerticalSize(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  senIconContainer: {
    backgroundColor: Colors.blue,
    padding: Metrix.VerticalSize(10),
    borderRadius: 11,
    position: 'absolute',
    right: Platform.OS === 'ios' ? 50 : 40,
  },
  galleryIconContainer: {
    backgroundColor: Colors.blue,
    padding: Metrix.VerticalSize(10),
    borderRadius: 11,
  },
});
