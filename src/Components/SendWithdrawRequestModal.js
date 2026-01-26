import {Modal, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Icons, Metrix} from '../Config';
import gstyles from '../styles';
import Button from './Button';
import {useTranslation} from 'react-i18next';
import {fonts} from '../Config/Helper';
import TextField from './TextField';
import Toast from 'react-native-toast-message';
import {ArtistMiddleware} from '../Redux/Middlewares';
import {useDispatch} from 'react-redux';

const SendWithdrawRequestModal = ({
  closeModal,
  available,
  isOpen,
  setTrigger,
}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');

  const onSave = async () => {
    if (!amount || !comment) {
      return Toast.show({
        text1: 'Error',
        text2: 'Please fill all fields',
        type: 'error',
      });
    }
    if (Number(amount) > Number(available)) {
      Toast.show({
        text2: 'Amount cannot be bigger than available balance',
        text1: 'Insufficient Balance',
        type: 'error',
      });
      return;
    }
    const payload = {
      amount,
      comment,
    };
    setLoading(true);
    const cb = data => {
      setLoading(false);
      Toast.show({text1: 'Success', text2: 'Withdraw request sent'});
      setAmount(0);
      setComment('');
      setTrigger(p => p + 1);
      closeModal();
    };

    dispatch(ArtistMiddleware.SendWithdrawRequest({payload, cb}));
    setTimeout(() => {
      setLoading(false);
    }, 10000);
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: 10}}>
        <View style={styles.modalContentContainer}>
          <Text allowFontScaling={false} style={styles.modalMessage}>{t('Withdraw Request')}</Text>
          <View>
            <View style={gstyles.marginBottom20}>
              <TextField
                value={amount}
                placeholder="Enter amount you want to withdraw"
                label={t('Amount')}
                onChangeText={text => setAmount(text)}
              />
            </View>
            <View style={gstyles.marginBottom20}>
              <TextField
                value={comment}
                placeholder="Enter comment"
                label={t('Comment')}
                onChangeText={text => setComment(text)}
              />
            </View>
          </View>
          <View style={gstyles.spacedBetweenRow}>
            <View style={gstyles.width48}>
              <Button
                buttonText={t('Cancel')}
                onPress={closeModal}
                btnStyle={gstyles.paddingVertical12}
                disabled={loading}
              />
            </View>
            <View style={gstyles.width48}>
              <Button
                buttonText={t('Request')}
                onPress={onSave}
                loading={loading}
                disabled={loading}
                btnStyle={gstyles.paddingVertical12}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SendWithdrawRequestModal;

const styles = StyleSheet.create({
  modalContentContainer: {
    borderWidth: 0.6,
    borderColor: Colors.backgroundGrayDark,
    backgroundColor: Colors.carbonBlack,
    justifyContent: 'center',
    paddingHorizontal: Metrix.HorizontalSize(10),
    paddingVertical: Metrix.VerticalSize(20),
    borderRadius: 10,
  },
  modalMessage: {
    fontSize: Metrix.customFontSize(16),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.white,
    textAlign: 'center',
    marginTop: Metrix.VerticalSize(0),
    marginBottom: Metrix.VerticalSize(35),
  },
});
