import React from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Colors, Metrix} from '../Config';

const MultiLineTextField = ({
  text,
  setText,
  onFocus,
  style = {},
  containerStyle = {},
  placeholder,
  placeholderColor,
  backgroundColor = Colors.carbonBlack,
  onChangeText,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
      style={[{...containerStyle}]}>
      <TextInput
        style={[styles.textInput, {...style}, {backgroundColor}]}
        multiline={true}
        numberOfLines={4}
        placeholder={placeholder ?? 'Write Message'}
        keyboardType="default"
        value={text}
        onChangeText={onChangeText}
        placeholderTextColor={placeholderColor ?? Colors.placeholder}
        textAlignVertical="top"
        onFocus={onFocus}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: '100%',
    height: Metrix.VerticalSize(50),
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 11,
    color: Colors.white,
  },
});

export default MultiLineTextField;
