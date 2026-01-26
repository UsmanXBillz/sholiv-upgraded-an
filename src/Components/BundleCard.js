import React, {memo} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Colors, Icons, Metrix} from '../Config';
import gstyles from '../styles';
import {fonts} from '../Config/Helper';

const BundleCard = ({plan, selectedPlan, isEven}) => {
  return (
    <View style={[styles.planContainer, isEven && styles.evenContainer]}>
      <View style={styles.planDetailContainer}>
        <Icons.Ionicons
          name={selectedPlan ? 'radio-button-on' : 'radio-button-off-sharp'}
          color={isEven ? Colors.white : Colors.blue}
          size={Metrix.customFontSize(30)}
        />
        <View style={gstyles.marginLeft20}>
          <Text allowFontScaling={false} style={styles.planTitleText}>{plan?.name}</Text>

          <View style={styles.planPriceContainer}>
            <View style={styles.priceRow}>
              <Text allowFontScaling={false} style={styles.priceTitle}>Price</Text>
              <Text allowFontScaling={false}
                style={[styles.priceAmount, isEven && {color: Colors.white}]}>
                {plan?.price}
              </Text>
            </View>
          </View>
          <View style={styles.textView}>
            <Text allowFontScaling={false} style={styles.benefitsText}>
              Messages:
              <Text allowFontScaling={false} style={styles.benefitsText}> {plan?.messages}</Text>
            </Text>
          </View>

          <View style={styles.textView}>
            <Text allowFontScaling={false} style={styles.benefitsText}>
              Artist Follow:
              <Text allowFontScaling={false} style={styles.benefitsText}> {plan?.artist_subscribe}</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(BundleCard);

const styles = StyleSheet.create({
  planContainer: {
    backgroundColor: Colors.carbonBlack,
    paddingHorizontal: Metrix.HorizontalSize(10),
    paddingVertical: Metrix.VerticalSize(30),
    marginVertical: Metrix.VerticalSize(10),
    borderRadius: 13,
  },
  evenContainer: {
    backgroundColor: Colors.blue,
  },
  planDetailContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  planTitleText: {
    fontSize: Metrix.customFontSize(18),
    fontFamily: fonts.MontserratSemiBold,
    color: Colors.white,
  },
  planPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: Metrix.VerticalSize(6),
  },
  textView: {
    marginVertical: Metrix.VerticalSize(6),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
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
    color: Colors.blue,
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
    paddingRight: Metrix.HorizontalSize(30),
  },
});
