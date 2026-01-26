import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  Button,
  Header,
  ScreenTopImage,
  SubscriptionDetailCard,
} from '../../Components';
import {IapContext} from '../../Components/Providers/IAP.Provider';
import {AppData, Colors, Images, Metrix} from '../../Config';
import {fonts} from '../../Config/Helper';
import gstyles from '../../styles';

const {subscriptionDetailData, oneSubscriptionData} = AppData;

const BuySubscription = ({route}) => {
  const plan = route?.params?.plan;
  console.log('===plan===>', JSON.stringify(plan, null, 1));
  const {t} = useTranslation();
  const {handlePurchase} = useContext(IapContext);

  const user = useSelector(state => state?.AuthReducer?.user);
  const isArtist = user?.user_role == 1 ? true : false;

  const subscriptionData = isArtist
    ? subscriptionDetailData
    : oneSubscriptionData;

  // const subscribe = () => {
  //   const cb = data => {
  //     openStripeModal(data, null, (type = 'susbscriptionBundle'), plan);
  //   };
  //   if (plan?.id == 10) {
  //     dispatch(AuthMiddleware.GetBundlePaymentLinkArtist({cb}));
  //   } else {
  //     dispatch(AuthMiddleware.GetBundlePaymentLink({id: plan?.id, cb}));
  //   }

  //   // NavigationService.navigate(isArtist ? 'SuccessfulPayment' : 'ProfileViewSubscription');
  //   // NavigationService.navigate( 'ProfileViewSubscription');
  // };

  const subscribe = async () => {
    try {
      // alert(plan.id);
      await handlePurchase(plan.id);
    } catch (error) {
      console.log('HANDLE SUBSCRIOBE ERROR', error);
    }
  };

  const renderItem = ({item}) => (
    <View key={item?.id} style={gstyles.marginVertical20}>
      <SubscriptionDetailCard item={item} />
    </View>
  );

  return (
    <View style={gstyles.container}>
      <Header back={true} title={t('BUY_SUBSCRIPTION')} isIcon={false} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: Metrix.VerticalSize(100)}}>
        <View style={[gstyles.justifyAlignCenter, gstyles.marginVertical30]}>
          <ScreenTopImage
            image={Images.buySubscription}
            size={190}
            rounded={false}
          />
        </View>
        {plan?.name == 'Gold Package' ? (
          <Text allowFontScaling={false} style={styles.text}>
            {`
Gold Package Cost Breakdown:
      * Total Price: ${plan?.price}/month
      * Inclusions:
        • 50 messages
        • 2 artist subscriptions
        • No free streams`}
          </Text>
        ) : plan?.name == 'Boost Your Profile' ? (
          <Text allowFontScaling={false} style={styles.text}>
            {`
    Detailed Breakdown of the Lite Package Pricing
    The Lite Package is priced at ${plan?.price} and offers the following perks:
       • Boost your Profile
       • Get Boost Icon
                        `}
          </Text>
        ) : plan.name.toLowerCase().includes('vip') ? (
          <Text allowFontScaling={false} style={styles.text}>
            {`
VIP Package Cost Breakdown:
      * Total Price: ${plan?.price}/month
      * Inclusions:
      • 100 messages
      • 2 artist subscriptions
      • 10 streams
      `}
          </Text>
        ) : (
          <Text allowFontScaling={false} style={styles.text}>
            {`
Message Bundle Cost Breakdown:
      * Total Price: ${plan?.price}/month
      * Inclusions:
      • 10 messages
      `}
          </Text>
        )}
        {/* Message Bundle */}
      </ScrollView>
      <Button
        buttonText={t('SUBSCRIBE_NOW')}
        onPress={subscribe}
        btnStyle={styles.subscribeButton}
      />
    </View>
  );
};

export default BuySubscription;

const styles = StyleSheet.create({
  subscribeButton: {
    position: 'absolute',
    bottom: Metrix.VerticalSize(20),
    alignSelf: 'center',
  },
  text: {
    fontSize: Metrix.customFontSize(16),
    fontFamily: fonts.MontserratRegular,
    color: Colors.white,
  },
});
