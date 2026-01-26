import React, {memo} from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {Colors, Icons, Images, Metrix} from '../Config';
import gstyles from '../styles';
import {fonts} from '../Config/Helper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SubscriptionPlanCard = ({
  name,
  price,
  benifits,
  selectedPlan,
  isOverView,
  isBoosted,
  isEven,
  ...iapDetail
}) => {
  const icon =
    name === 'Gold Package'
      ? 'star'
      : name === 'VIP Package'
      ? 'crown'
      : 'lightning-bolt-outline';

  const showBest =
    name === 'Gold Package' ? '*Better' : name === 'VIP Package' ? '*Best' : '';

  return (
    <View style={[styles.planContainer, isEven && styles.secondatyContainer]}>
      <View style={styles.planDetailContainer}>
        {!isOverView && (
          <Icons.Ionicons
            name={selectedPlan ? 'radio-button-on' : 'radio-button-off-sharp'}
            color={Colors.white}
            size={Metrix.customFontSize(30)}
          />
        )}
        <View style={gstyles.marginLeft20}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingRight: Metrix.HorizontalSize(40),
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <Text
                allowFontScaling={false}
                style={[styles.planTitleText, isEven && styles.secondaryTexts]}>
                {name}
              </Text>
              {!isOverView && !isBoosted && icon && (
                <MaterialCommunityIcons
                  name={icon}
                  color={'yellow'}
                  size={24}
                />
              )}
              {isBoosted && (
                <View style={{height: 25, width: 25}}>
                  <Image
                    source={Images.varificationBadge}
                    style={styles.floatVerification}
                  />
                </View>
              )}
            </View>
            <Text
              allowFontScaling={false}
              style={[styles.bestText, isEven && {color: 'white'}]}>
              {showBest}
            </Text>
          </View>

          {!isOverView && (
            <View style={styles.planPriceContainer}>
              <View style={styles.priceRow}>
                <Text
                  allowFontScaling={false}
                  style={[styles.priceTitle, isEven && styles.secondaryTexts]}>
                  Price
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[styles.priceAmount, isEven && {color: Colors.blue}]}>
                  {price}
                </Text>
              </View>
            </View>
          )}

          <View style={{gap: 5}}>
            {!isOverView && (
              <Text allowFontScaling={false} style={styles.benefitsText}>
                Benefits
              </Text>
            )}
            <View>
              {benifits?.map(item => {
                return (
                  <View key={item.id} style={styles.benefitItem}>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.benefitsText,
                        isEven && styles.secondaryTexts,
                        item == 'Xclusive Follow any artist : $10' && {
                          color: 'red',
                        },
                      ]}>
                      {'\u2022'} {item}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(SubscriptionPlanCard);

const styles = StyleSheet.create({
  planContainer: {
    backgroundColor: Colors.blue,
    paddingHorizontal: Metrix.HorizontalSize(10),
    paddingVertical: Metrix.VerticalSize(30),
    marginVertical: Metrix.VerticalSize(10),
    borderRadius: 13,
  },
  secondatyContainer: {
    backgroundColor: Colors.carbonBlack,
  },
  secondaryTexts: {
    color: Colors.blue,
  },
  planDetailContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  planTitleText: {
    fontSize: Metrix.customFontSize(18),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.white,
  },
  planPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: Metrix.VerticalSize(16),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceTitle: {
    fontSize: Metrix.customFontSize(17),
    fontFamily: fonts.MontserratRegular,
    color: Colors.white,
  },
  priceAmount: {
    fontSize: Metrix.customFontSize(18),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.white,
    marginLeft: Metrix.HorizontalSize(10),
  },
  benefitsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  benefitsText: {
    fontSize: Metrix.customFontSize(16),
    fontFamily: fonts.MontserratRegular,
    color: Colors.white,
    paddingRight: Metrix.HorizontalSize(16),
  },
  benefitItem: {
    marginVertical: Metrix.VerticalSize(4), // Adjust as needed
  },
  floatVerification: {
    height: '100%',
    width: '100%',
  },
  bestText: {
    color: Colors.carbonBlack,
    fontWeight: 'bold',
    fontSize: Metrix.customFontSize(14),
  },
});
