import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {memo} from 'react';
import {Colors, Icons, Metrix} from '../Config';
import gstyles from '../styles';
import Button from './Button';
import {useTranslation} from 'react-i18next';

const ModalCard = ({
  bgColor,
  title,
  onPress,
  onClose,
  children,
  disableScroll,
  modalHeight = Metrix.VerticalSize(260),
}) => {
  const {t} = useTranslation();

  const Wrapper = disableScroll ? View : ScrollView;

  return (
    <Wrapper
      style={[
        gstyles.customModalWrapper,
        {backgroundColor: bgColor, height: modalHeight},
      ]}>
      <View style={[gstyles.customModalHeader, gstyles.marginTop40]}>
        <Text allowFontScaling={false} style={gstyles.customModalMessage}>{title}</Text>
        <TouchableOpacity onPress={onClose}>
          <Icons.AntDesign
            name={'close'}
            size={Metrix.customFontSize(20)}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>
      <View style={gstyles.marginTop10}>{children}</View>
      <View style={[gstyles.marginTop10, gstyles.marginBottom20]}>
        <Button
          onPress={onPress}
          buttonText={'CONTINUE'}
          btnStyle={gstyles.customModalBtnStyle}
          textStyle={gstyles.customModalBtnTextStyle}
        />
      </View>
    </Wrapper>
  );
};

export default memo(ModalCard);

const styles = StyleSheet.create({});
