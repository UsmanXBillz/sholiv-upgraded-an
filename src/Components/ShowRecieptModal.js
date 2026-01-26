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
import {Image} from 'react-native';

const ShowRecieptModal = ({closeModal, item, isOpen}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();


  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');

  const paymentStatus = {1: 'Pending', 2: 'Completed', 3: 'Rejected'};

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: 10}}>
        <View style={styles.modalContentContainer}>
          <Text allowFontScaling={false} style={styles.modalMessage}>{t('Reciept Detail')}</Text>
          <View>
            <View style={gstyles.marginBottom20}>
              {item?.status === 1 && (
                <Text allowFontScaling={false}
                  style={[
                    styles.uinfoText,
                    {
                      textAlign: 'center',
                      marginBottom: Metrix.VerticalSize(20),
                    },
                  ]}>
                  This will take upto 1-2 months to receive the money since its
                  our standard processing time{' '}
                </Text>
              )}
              <Text allowFontScaling={false} style={styles.uinfoText}>
                Status: {paymentStatus[item?.status]}
              </Text>
              <Text allowFontScaling={false} style={styles.uinfoText}>
                Amount: {Number(item?.amount).toFixed(2)}
              </Text>
              <Text allowFontScaling={false} style={styles.uinfoText}>
                Your Comment: {item?.comment}
              </Text>
              {item?.admin_comment && (
                <Text allowFontScaling={false} style={styles.uinfoText}>
                  Admin Comment: {item?.admin_comment}
                </Text>
              )}
              {item?.payout_id && (
                <Text allowFontScaling={false} style={styles.uinfoText}>
                  Payout ID: {item?.payout_id}
                </Text>
              )}
              {item?.transfer_id && (
                <Text allowFontScaling={false} style={styles.uinfoText}>
                  Transfer ID: {item?.transfer_id}
                </Text>
              )}
              {item?.attachment && (
                <Image
                  source={{
                    uri:
                      item?.attachment?.url ||
                      item?.attachment?.uri ||
                      item?.attachment,
                  }}
                  height={200}
                  width={'80%'}
                  resizeMode="contain"
                />
              )}
            </View>
          </View>
          <View style={gstyles.centeredAlignedRow}>
            <View style={gstyles.width48}>
              <Button
                buttonText={t('Close')}
                onPress={closeModal}
                btnStyle={gstyles.paddingVertical12}
                disabled={loading}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ShowRecieptModal;

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
    marginBottom: Metrix.VerticalSize(20),
  },
  uinfoText: {color: 'white', fontSize: 15},
});
