import React, {memo} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {Colors, Icons, Metrix} from '../Config';
import {fonts} from '../Config/Helper';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import {Loader, ScreenTopImage} from '.';

function CustomModal({
  show,
  title,
  onCloseModal,
  desc,
  children,
  disableScroll,
}) {
  const loading = useSelector(state => state?.LoaderReducer?.loading);
  const Wrapper = disableScroll ? View : ScrollView;
  return (
    <Modal
      visible={show}
      onRequestClose={onCloseModal}
      transparent={true}
      animationType="fade">
      {loading && <Loader />}
      <Wrapper
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        bounces={false}
        automaticallyAdjustKeyboardInsets={true}
        contentContainerStyle={styles.modalContainer}
        style={disableScroll && styles.modalContainer}>
        <View>
          <View style={styles.modalStyle}>
            {title && (
              <View style={styles.modalHeader}>
                <Text allowFontScaling={false} style={styles.modalTitleText}>{title}</Text>

                <TouchableOpacity activeOpacity={0.6} onPress={onCloseModal}>
                  <Icons.AntDesign
                    color={Colors.white}
                    size={Metrix.customFontSize(24)}
                    name={'closecircleo'}
                  />
                </TouchableOpacity>
              </View>
            )}
            <KeyboardAvoidingView behavior="padding">
              <View>{children}</View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Wrapper>
      <Toast />
    </Modal>
  );
}

export default memo(CustomModal);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    // alignItems: 'center',
  },

  modalTitleText: {
    fontSize: Metrix.customFontSize(18),
    fontFamily: fonts.SemiBold,
  },
  modalStyle: {
    alignSelf: 'center',
    // backgroundColor: Colors.white,
    width: '84%',
    borderRadius: Metrix.VerticalSize(30),
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    paddingHorizontal: Metrix.HorizontalSize(20),
    marginVertical: Metrix.VerticalSize(20),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
