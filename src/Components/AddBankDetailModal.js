import {Modal, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Colors, Icons, Metrix} from '../Config';
import gstyles from '../styles';
import Button from './Button';
import {useTranslation} from 'react-i18next';
import {fonts} from '../Config/Helper';
import TextField from './TextField';
import Toast from 'react-native-toast-message';
import {ArtistMiddleware} from '../Redux/Middlewares';
import {useDispatch} from 'react-redux';

const AddBankDetailModal = ({closeModal, bankDetail, isOpen, setTrigger}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const [bank_name, setBankName] = useState(bankDetail?.bank_name || '');
  const [routing_number, setRoutingNumber] = useState(
    bankDetail?.routing_number || '',
  );
  const [account_number, setAccountNumber] = useState(
    bankDetail?.account_number || '',
  );
  const [swift_code, setSwiftCode] = useState(bankDetail?.swift_code || '');

  const onSave = async () => {
    if (!bank_name || !routing_number || !account_number || !swift_code) {
      return Toast.show({
        text1: 'Error',
        text2: 'Please fill all fields',
        type: 'error',
      });
    }
    const payload = {
      bank_name,
      routing_number,
      account_number,
      swift_code,
    };

    const cb = () => {
      setTrigger(p => p + 1);
      closeModal();
    };

    dispatch(ArtistMiddleware.AddBankDetails({payload, cb}));
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: 10}}>
        <View style={styles.modalContentContainer}>
          <Text allowFontScaling={false} style={styles.modalMessage}>{t('Add Bank Detail')}</Text>
          <View>
            <View style={gstyles.marginBottom20}>
              <TextField
                value={bank_name}
                placeholder="e.g AMEX"
                label={t('Bank Name')}
                onChangeText={text => setBankName(text)}
              />
            </View>
            <View style={gstyles.marginBottom20}>
              <TextField
                value={routing_number}
                placeholder="Enter routing number"
                label={t('Routing Number')}
                onChangeText={text => setRoutingNumber(text)}
              />
            </View>
            <View style={gstyles.marginBottom20}>
              <TextField
                value={account_number}
                placeholder="Enter Account Number"
                label={t('Account Number')}
                onChangeText={text => setAccountNumber(text)}
              />
            </View>
            <View style={gstyles.marginBottom20}>
              <TextField
                value={swift_code}
                placeholder="Enter Swift Code"
                label={t('Swift Code')}
                onChangeText={text => setSwiftCode(text)}
              />
            </View>
          </View>
          <View style={gstyles.spacedBetweenRow}>
            <View style={gstyles.width48}>
              <Button
                buttonText={t('Cancel')}
                onPress={closeModal}
                btnStyle={gstyles.paddingVertical12}
              />
            </View>
            <View style={gstyles.width48}>
              <Button
                buttonText={t('Save')}
                onPress={onSave}
                btnStyle={gstyles.paddingVertical12}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddBankDetailModal;

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
