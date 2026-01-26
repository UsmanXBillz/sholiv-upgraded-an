import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import gstyles from '../../styles';
import {Header} from '../../Components';
import {Colors, Metrix} from '../../Config';
import {useDispatch} from 'react-redux';
import {AuthMiddleware} from '../../Redux/Middlewares';
import {fonts} from '../../Config/Helper';

const AdminKPIs = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [record, setRecord] = useState(null);

  const calculateTotalPayment = data => {
    const monthlyPayments = data.payment.reduce(
      (total, payment) => total + parseFloat(payment.amount),
      0,
    );
    const yearlyPayments = data.paymentYearly.reduce(
      (total, payment) => total + parseFloat(payment.amount),
      0,
    );
    return {monthlyPayments, yearlyPayments};
  };

  const handleGetAdminKPIs = response => {
    if (response) {
      const {monthlyPayments, yearlyPayments} = calculateTotalPayment(response);
      setRecord({monthlyPayments, yearlyPayments, ...response});
    }
  };

  const getAdminKPIs = () => {
    dispatch(AuthMiddleware.GetAdminKPIs({cb: handleGetAdminKPIs}));
  };

  useEffect(() => {
    getAdminKPIs();
  }, []);

  return (
    <View style={gstyles.container}>
      <Header back={true} title={t('ADMIN_KPIS')} isIcon={false} />
      <View style={styles.container}>
        <View style={styles.box}>
          <Text allowFontScaling={false} style={styles.infoText}>Total Fans</Text>
          <Text allowFontScaling={false} style={styles.valueText}>{record?.totalFans}</Text>
        </View>
        <View style={styles.box}>
          <Text allowFontScaling={false} style={styles.infoText}>Total Artists</Text>
          <Text allowFontScaling={false} style={styles.valueText}>{record?.totalArtist}</Text>
        </View>
        <View style={styles.box}>
          <Text allowFontScaling={false} style={styles.infoText}>Total Stream</Text>
          <Text allowFontScaling={false} style={styles.valueText}>{record?.totalStream}</Text>
        </View>
        <View style={styles.box}>
          <Text allowFontScaling={false} style={styles.infoText}>Last Month Payments</Text>
          <Text allowFontScaling={false} style={styles.valueText}>{record?.payment[1].amount}</Text>
        </View>
        <View style={styles.box}>
          <Text allowFontScaling={false} style={styles.infoText}>Last Years Payment</Text>
          <Text allowFontScaling={false} style={styles.valueText}>
            {record?.paymentYearly[1].amount}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AdminKPIs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    padding: 10,
    paddingTop: 20,
  },
  box: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.blue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'white',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
    height: 60,
  },
  infoText: {
    fontSize: Metrix.customFontSize(15),
    fontFamily: fonts.MontserratRegular,
    color: Colors.white,
    // fontWeight: 'bold',
  },
  valueText: {
    fontSize: Metrix.customFontSize(18),
    fontFamily: fonts.MontserratRegular,
    color: Colors.white,
    fontWeight: 'bold',
  },
});
