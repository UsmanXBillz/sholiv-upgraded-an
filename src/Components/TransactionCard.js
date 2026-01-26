import moment from 'moment';
import React, {memo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, ConditionalData, Icons, Metrix} from '../Config';
import {fonts, formatAmount} from '../Config/Helper';
import ShowRecieptModal from './ShowRecieptModal';

const TransactionCard = ({item, isWithdraw = false, isEarning = false}) => {
  const {t} = useTranslation();
  const date = moment(item?.createdAt).format('D MMMM, YYYY');

  const [modal, setModal] = useState(false);

  const title = {
    true: t('FUNDS_WITHDRAWAL'),
    false: t(
      ConditionalData[isEarning ? 'earningType' : 'transactionType'][
        item?.payment_type || item?.type
      ],
    ),
  };

  const subTitle = {
    true: t('WITHDRAW_FUNDS_REQUEST'),
    false: t(
      ConditionalData[
        isEarning ? 'earningTypeDetails' : 'transactionTypeDetails'
      ][item?.payment_type || item?.type],
    ),
  };

  const Wrapper = isWithdraw ? TouchableOpacity : View;

  const onPress = () => {
    setModal(true);
  };

  return (
    <View style={styles.transactionCard}>
      <Wrapper style={styles.transactionDetailsContainer} onPress={onPress}>
        <View style={styles.iconContainer}>
          <Icons.OcticonsIcons
            name={'graph'}
            color={Colors.white}
            size={Metrix.customFontSize(24)}
          />
        </View>
        <View style={styles.transactionTextContainer}>
          <Text allowFontScaling={false} style={[styles.title, styles.colorWhite]}>
            {title[isWithdraw]}
          </Text>
          <Text allowFontScaling={false} style={[styles.subtitle, {color: Colors.lightBlue}]}>
            {isWithdraw
              ? `Payment ${
                  item?.status == 1
                    ? 'Pending'
                    : item?.status == '2'
                    ? 'Completed'
                    : 'Rejected'
                }`
              : subTitle[isWithdraw]}
          </Text>
        </View>
        <View style={styles.datePriceContainer}>
          <Text allowFontScaling={false} style={styles.date}>{date}</Text>
          <Text allowFontScaling={false} style={[styles.title, styles.colorWhite]}>
            ${formatAmount(item?.total_amount ?? item?.amount)}
          </Text>
        </View>
      </Wrapper>

      <ShowRecieptModal
        isOpen={modal}
        item={item}
        closeModal={() => {
          setModal(false);
        }}
      />
    </View>
  );
};

export default memo(TransactionCard);

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: Metrix.customFontSize(18),
    color: Colors.white,
  },
  transactionCard: {
    backgroundColor: Colors.blue,
    paddingVertical: Metrix.VerticalSize(30),
    paddingHorizontal: Metrix.HorizontalSize(10),
    borderRadius: 16,
    marginBottom: Metrix.VerticalSize(12),
  },
  iconContainer: {
    backgroundColor: Colors.mediumBlue,
    borderRadius: 12,
    width: Metrix.HorizontalSize(46),
    height: Metrix.VerticalSize(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionTextContainer: {
    flex: 1,
    marginLeft: Metrix.HorizontalSize(12),
  },
  datePriceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontFamily: fonts.RubikRegular,
    fontSize: Metrix.customFontSize(14),
    color: Colors.lightBlue,
    marginBottom: Metrix.VerticalSize(6),
  },
});
