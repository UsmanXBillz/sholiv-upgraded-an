/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {Header, SeparatorBar, SubscriptionPlanCard} from '../../Components';
import {IapContext} from '../../Components/Providers/IAP.Provider';
import {Colors, Metrix, NavigationService} from '../../Config';
import {fonts} from '../../Config/Helper';
import gstyles from '../../styles';

const BUNDLES = {
  'com.sholiv.artist.boost.profile': {
    artist_subscribe: 2,
    createdAt: '2024-01-08T11:37:15.771Z',
    description: null,
    expiry_days: 0,
    id: 10,
    is_free: false,
    live_stream: 0,
    messages: 0,
    name: 'Boost Your Profile',
    isBoost: true,
    perks: ['Boost your Profile', 'Get Verified Check'],
    price: 2,
    type: 5,
    updatedAt: '2024-01-08T11:37:15.771Z',
  },
  'com.sholiv.message.bundle': {
    artist_subscribe: 2,
    createdAt: '2024-01-08T11:37:15.771Z',
    description: null,
    expiry_days: 0,
    id: 10,
    is_free: false,
    live_stream: 0,
    messages: 0,
    name: 'Message Bundle',
    isBoost: true,
    perks: ['Messages: 10', 'Xclusive Artist Follow: 0'],
    price: 2,
    type: 5,
    updatedAt: '2024-01-08T11:37:15.771Z',
  },
  'com.sholiv.message.single': {
    artist_subscribe: 2,
    createdAt: '2024-01-08T11:37:15.771Z',
    description: null,
    expiry_days: 0,
    id: 10,
    is_free: false,
    live_stream: 0,
    messages: 0,
    name: 'Message Bundle',
    isBoost: true,
    perks: ['Messages: 1', 'Xclusive Artist Follow: 0'],
    price: 2,
    type: 5,
    updatedAt: '2024-01-08T11:37:15.771Z',
  },
  'com.sholiv.gold.package': {
    id: 6,
    name: 'Gold Package',
    stripe_product_id: 'prod_QWmreft5UcdQFz',
    stripe_price_id: 'price_1PfjI6EtS5FNXW8uVRDhdgD1',
    type: 5,
    price: 30,
    is_free: false,
    expiry_days: 0,
    live_stream: 0,
    messages: 50,
    artist_subscribe: 2,
    description: null,
    perks: [
      'Bundle of 50 free messages to any Artist',
      'Exclusive Follow any 2 Artists for 1 month',
      'Special Gold badge displayed on the profile',
    ],
    createdAt: '2024-01-08T11:37:15.771Z',
    updatedAt: '2024-01-08T11:37:15.771Z',
  },
  'com.sholiv.vip.package': {
    id: 7,
    name: 'VIP Package',
    stripe_product_id: 'prod_QWms07HBlXWp52',
    stripe_price_id: 'price_1PfjIaEtS5FNXW8u8mk7zf42',
    type: 5,
    price: 80,
    is_free: false,
    expiry_days: 0,
    live_stream: 10,
    messages: 100,
    artist_subscribe: 2,
    description: null,
    perks: [
      'Bundle of 100 free messages to any Artist.',
      'Exclusive Follow any 2 Artists for 1 month',
      'Can watch 10 free live streams.',
      'VIP badge displayed on the profile.',
    ],
    createdAt: '2024-01-08T11:37:15.771Z',
    updatedAt: '2024-01-08T11:37:15.771Z',
  },
};

const SubscriptionPlan = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const loading = useSelector(store => store.LoaderReducer.loading);
  const {t} = useTranslation();
  const {plans: iapPlans} = useContext(IapContext);

  const handlePlanSelect = (planId, plan) => {
    setSelectedPlan(planId);
    NavigationService.navigate('BuySubscription', {plan});
  };
  return (
    <View style={gstyles.container}>
      <Header
        back={true}
        title={t('CHOOSE_YOUR_SUBSCRIPTION_PLAN')}
        isIcon={false}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={gstyles.marginVertical30}>
          <SeparatorBar />
        </View>
        <View style={gstyles.marginVertical40}>
          <Text allowFontScaling={false} style={styles.text}>{t('EXPLORE_SUBSCRIPTION_PLANS')}</Text>
        </View>
        <SubscriptionPlanCard
          id={'9999'}
          name="Price Overview"
          isOverView={true}
          benifits={[
            'Price per message : $1',
            'Price per stream : $5',
            'Xclusive Follow any artist : $10',
            'Joining a competition: $5',
          ]}
          price=""
          isBoosted={false}
          isEven={false}
        />
        {/* {plans?.map((plan, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleBundlePlanSelect(plan)}>
            <BundleCard
              plan={plan}
              selectedPlan={selectedPlan === plan?.id}
              isEven={index % 2 !== 0}
            />
          </TouchableOpacity>
        ))} */}
        {!loading &&
          iapPlans.allPlans?.map((plan, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.4}
              onPress={() =>
                handlePlanSelect(plan?.id, {
                  ...BUNDLES[plan.id],
                  ...plan,
                })
              }>
              <SubscriptionPlanCard
                name={BUNDLES[plan.id]?.name}
                benifits={BUNDLES[plan.id]?.perks}
                selectedPlan={selectedPlan === BUNDLES[plan.id]?.id}
                isOverView={BUNDLES[plan.id]?.isOverView}
                isBoosted={BUNDLES[plan.id]?.isBoost}
                isEven={index % 2 == 0}
                {...plan}
                price={plan?.displayPrice}
              />
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
};

export default SubscriptionPlan;

const styles = StyleSheet.create({
  text: {
    fontSize: Metrix.customFontSize(18),
    fontFamily: fonts.MontserratRegular,
    color: Colors.white,
  },
});
