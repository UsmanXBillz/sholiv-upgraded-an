import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Header, ScreenTopImage } from '../../Components';
import gstyles from '../../styles';
import { capitalize } from 'lodash';


const UserData = ({ route }) => {

  const user = route?.params?.user || {};
  const name = capitalize(user?.name ?? user?.username);

  return (
    <View style={gstyles.container}>
      <Header back={true} title={name} isIcon={false} />

      <View style={styles.centeredContainer}>
        <ScreenTopImage image={user?.profile_pic_URL} size={120} rounded={true} />
        <Text allowFontScaling={false} style={[gstyles.artistName, gstyles.marginTop30]}>{name}</Text>
        <View style={gstyles.marginVertical15}>
          <Text allowFontScaling={false} style={gstyles.artistDescription}>{user?.location ?? "N/A"}</Text>
        </View>
        <View style={gstyles.artistDescriptionContainer}>
          <Text allowFontScaling={false} style={gstyles.artistDescription}>{user?.email_address}</Text>
        </View>
      </View>

    </View>
  )
}

export default UserData

const styles = StyleSheet.create({

  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  }
});
