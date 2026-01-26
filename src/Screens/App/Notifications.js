import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Header, ListEmpty, NotificationCard} from '../../Components';
import {Metrix} from '../../Config';
import {AuthMiddleware} from '../../Redux/Middlewares';
import gstyles from '../../styles';

const Notifications = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const [data, setData] = useState(null);
  const [nextPage, setNextPage] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    getNotifications();
    dispatch(AuthMiddleware.MarkAllNotificationRead());
  }, []);

  const getNotifications = fresh => {
    dispatch(
      AuthMiddleware.GetNotifications({
        offset: fresh ? 0 : nextPage,
        cb: res => {
          if (res !== 'error') {
            setNextPage(fresh ? 1 : nextPage + 1);
            setData(fresh || !data ? res?.rows : [...data, ...res?.rows]);
            setIsRefreshing(false);
          }
        },
      }),
    );
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    getNotifications(true);
  };

  const renderItem = ({item}) => <NotificationCard item={item} />;

  return (
    <View style={gstyles.container}>
      <Header back={true} title={t('NOTIFICATION')} />
      <FlatList
        contentContainerStyle={styles.flatListContentContainer}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReachedThreshold={0.2}
        onEndReached={() => (data?.length ? getNotifications() : null)}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        ListEmptyComponent={<ListEmpty message={t('EMPTY_LISTING')} />}
      />
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  flatListContentContainer: {
    paddingBottom: Metrix.VerticalSize(80),
    marginTop: Metrix.VerticalSize(20),
  },
});
