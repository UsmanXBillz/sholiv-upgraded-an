import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Modal} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Metrix} from '../Config';
import Button from './Button';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

const PaymentConfirmModal = props => {
  const {isVisible, onCancel, onPurchase} = props;
  const {top, bottom} = useSafeAreaInsets();
  const {t} = useTranslation();
  const iapLoader = useSelector(store => store.LoaderReducer.iapLoader);

  return (
    <Modal visible={isVisible} style={styles.modal} transparent>
      <View
        style={[styles.container, {paddingTop: top, paddingBottom: bottom}]}>
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text allowFontScaling={false} style={styles.headingText}>{t('CONFIRM_PAYMENT')}</Text>
            <Text allowFontScaling={false} style={styles.descText}>
              {t('ONE_STEP_AWAY_FROM_PAYMENT')}
            </Text>
          </View>
          <View style={styles.btnContainer}>
            <Button
              btnStyle={{
                width: '45%',
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: Colors.blue,
              }}
              buttonText="Cancel"
              onPress={onCancel}
            />
            <Button
              btnStyle={{width: '45%'}}
              buttonText="Purchase"
              onPress={onPurchase}
              loading={iapLoader}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentConfirmModal;

const styles = StyleSheet.create({
  modal: {height: '100%', width: '100%'},
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    padding: Metrix.HorizontalSize(12),
    width: '90%',
    backgroundColor: Colors.carbonBlack,
    minHeight: Metrix.VerticalSize(250),
    borderRadius: 12,
    justifyContent: 'center',
  },
  textContainer: {
    gap: 10,
  },
  headingText: {
    color: 'white',
    fontSize: Metrix.FontLarge,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descText: {
    color: 'white',
    fontSize: Metrix.FontMedium,
    textAlign: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-evenly',
    marginVertical: 14,
  },
});
