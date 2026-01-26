// TextField.js

import React, {memo} from 'react';
import {TextInput, View, StyleSheet, Text} from 'react-native';
import {Colors, Metrix} from '../Config';
import {fonts} from '../Config/Helper';
import gstyles from '../styles';

function TextField({
  secureTextEntry = false,
  onChangeText = () => {},
  value = '',
  placeholderTextColor = Colors.placeholder,
  style = {},
  multiline = false,
  keyboardType = 'default',
  noOfLines = 1,
  placeholder = '',
  disable = true,
  autofocus = false,
  focused = false, // New prop for handling focus state
  onFocus = () => {},
  icon = null,
  postIcon = null,
  label = '',
  containerStyle,
}) {
  return (
    <View>
      {label && (
        <View style={{}}>
          <Text allowFontScaling={false} style={{...gstyles.labelStyle}}>{label}</Text>
        </View>
      )}
      <View style={[styles.container, containerStyle]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          autoFocus={autofocus}
          style={[
            styles.input,
            style,
            {paddingLeft: Metrix.HorizontalSize(icon ? 45 : 40)},
            focused && styles.focusedInput, // Apply focused styles if focused is true
          ]}
          allowFontScaling={false}
          placeholder={placeholder}
          keyboardType={keyboardType}
          value={value}
          numberOfLines={noOfLines}
          multiline={multiline}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
          placeholderTextColor={placeholderTextColor}
          editable={disable}
          onFocus={onFocus}
        />
        {postIcon && <View style={styles.postIconContainer}>{postIcon}</View>}
      </View>
    </View>
  );
}

export default memo(TextField);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    zIndex: 10,
    top: Metrix.VerticalSize(22),
    left: Metrix.HorizontalSize(15),
  },
  postIconContainer: {
    position: 'absolute',
    zIndex: 10,
    top: Metrix.VerticalSize(22),
    right: Metrix.HorizontalSize(18),
  },
  input: {
    backgroundColor: Colors.inputBg,
    marginTop: Metrix.VerticalSize(10),
    width: '100%',
    height: Metrix.VerticalSize(50),
    fontSize: Metrix.customFontSize(13),
    padding: 5,
    color: Colors.white,
    borderRadius: 15,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  focusedInput: {
    borderColor: Colors.blue, // Change border color when focused
  },
});
