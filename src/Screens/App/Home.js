import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import gstyle from '../../styles';
import {DashboardHeader} from '../../Components';
import {NavigationService} from '../../Config';
import {useDispatch, useSelector} from 'react-redux';
import ArtistDashboard from './ArtistDashboard';
import FanDashboard from './Fan/FanDashboard';
import {capitalize} from '../../Config/Helper';
import {AuthMiddleware} from '../../Redux/Middlewares';
import PaymentConfirmModal from '../../Components/PaymentConfirmModal';

const Home = () => {
  const user = useSelector(state => state?.AuthReducer?.user);

  const refetchListings = useSelector(
    state => state?.GeneralReducer?.refetchNotification,
  );
  const dispatch = useDispatch();

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    getNotifications();
  }, [refetchListings]);

  const getNotifications = () => {
    dispatch(
      AuthMiddleware.GetNotifications({
        cb: res => {
          if (res !== 'error') {
            const count = res?.rows?.filter(i => !i.is_read).length;
            setNotificationCount(count);
          }
        },
      }),
    );
  };

  const dashboard = {
    1: <ArtistDashboard />,
    2: <FanDashboard />,
  };

  return (
    <View style={styles.container}>
      <DashboardHeader
        title={capitalize(user?.name ?? user?.username)}
        onPress={() => NavigationService.openDrawer()}
        notificationCount={notificationCount}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={gstyle.marginVertical20}>
        {dashboard[user?.user_role]}
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    ...gstyle.container,
  },
  section: {
    ...gstyle.marginVertical10,
  },
});
