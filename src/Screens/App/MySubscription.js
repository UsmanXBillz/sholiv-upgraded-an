import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Header, SubscriptionPlanCard} from '../../Components';
import {Colors, Metrix, NavigationService} from '../../Config';
import {fonts} from '../../Config/Helper';
import {AuthMiddleware} from '../../Redux/Middlewares';
import gstyles from '../../styles';

const MySubscription = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [bundles, setBundles] = useState([]);
  const loading = useSelector(store => store.LoaderReducer.loading);

  const handleGetMySubscription = response => {
    console.log('===response===>', JSON.stringify(response, null, 1));
    setBundles(response?.plan?.rows);
  };

  const getMySubscription = () => {
    dispatch(
      AuthMiddleware.GetMySubscriptionPlans({cb: handleGetMySubscription}),
    );
  };

  useEffect(() => {
    getMySubscription();
  }, []);

  const handleRedirectPurchase = () => {
    NavigationService.navigate('SubscriptionPlan');
  };

  return (
    <View style={gstyles.container}>
      <Header back={true} title={t('YOUR_SUBSCRIPTION')} isIcon={false} />
      {!loading &&
        (bundles.length ? (
          <ScrollView
            contentContainerStyle={styles.bundleContainer}
            showsVerticalScrollIndicator={false}>
            {bundles.map(bundle => (
              <SubscriptionPlanCard
                name={bundle?.plan?.name}
                price={`$${bundle?.plan?.price}`}
                benifits={bundle?.plan?.perks}
                selectedPlan={true}
              />
            ))}
            <View style={styles.remainingCounter}>
              <Text allowFontScaling={false} style={styles.text}>Remaining Items</Text>
              <View style={styles.rowWrap}>
                <Text allowFontScaling={false} style={styles.remainingText}>
                  Live Stream: {bundles[0].live_stream_remaining}
                </Text>
                <Text allowFontScaling={false} style={styles.remainingText}>
                  Artist to Follow: {bundles[0].artist_follow_remaining}
                </Text>
                <Text allowFontScaling={false} style={styles.remainingText}>
                  Messages: {bundles[0].message_remaining}
                </Text>
              </View>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.errorCOntainer}>
            <Text allowFontScaling={false} style={styles.text}>{t('NO_SUBSCRIPTION_FOUND')}</Text>
            <Button
              buttonText="GET_SUBSCRIPTION"
              onPress={handleRedirectPurchase}
            />
          </View>
        ))}
    </View>
  );
};

export default MySubscription;

const styles = StyleSheet.create({
  text: {
    fontSize: Metrix.customFontSize(18),
    fontFamily: fonts.MontserratRegular,
    color: Colors.white,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  errorCOntainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  remainingCounter: {gap: 10},
  rowWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  remainingText: {
    fontSize: Metrix.customFontSize(12),
    color: 'white',
  },
});
