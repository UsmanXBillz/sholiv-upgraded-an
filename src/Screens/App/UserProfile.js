import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

import ArtistProfile from './ArtistProfile';
import EditProfile from './EditProfile';
import {Colors} from '../../Config';

const UserProfile = ({route}) => {
  const user = useSelector(state => state?.AuthReducer?.user);

  const profile = {
    1: <ArtistProfile />,
    2: <EditProfile />,
  };

  return <View style={styles.container}>{profile[user?.user_role]}</View>;
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
});
