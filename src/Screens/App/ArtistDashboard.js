import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  ArtistListing,
  IncomeGenerate,
  TopStreamsListing,
} from '../../Components';
import gstyles from '../../styles';
import {Metrix} from '../../Config';
import MyCompetetions from './MyCompetetions';
import MyCompetitionsBlock from '../../Components/Listing/MyCompetitionsBlock';

const ArtistDashboard = () => {
  return (
    <View>
      <View style={styles.section}>
        <IncomeGenerate />
      </View>

      <View style={styles.section}>
        <MyCompetitionsBlock />
      </View>

      <View style={styles.section}>
        <TopStreamsListing />
      </View>

      <View style={[styles.section, {marginBottom: Metrix.VerticalSize(80)}]}>
        <ArtistListing />
      </View>
    </View>
  );
};

export default ArtistDashboard;

const styles = StyleSheet.create({
  container: {
    ...gstyles.container,
  },
  section: {
    ...gstyles.marginVertical10,
  },
});
