import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Header, ListEmpty, TransactionCard} from '../../Components';
import TransactionFilter from '../../Components/TransactionFilter';
import {Colors, Icons, Metrix} from '../../Config';
import {fonts, removeDuplicatesById} from '../../Config/Helper';
import {ArtistMiddleware} from '../../Redux/Middlewares';
import gstyles from '../../styles';

const RecentTransactions = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const user = useSelector(state => state?.AuthReducer?.user);

  const isArtist = user?.user_role === 1;

  const [data, setData] = useState([]);
  const [myearnings, setMyEarnings] = useState([]);
  const [selectedTab, setSelectedTab] = useState(1);
  const [filterModal, setFilterModal] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [trxfilter, setTrxFilter] = useState({
    payment_type: null,
    start_date: null,
    end_date: null,
  });
  const [earnfilter, setEarnFilter] = useState({
    earning_type: null,
    start_date: null,
    end_date: null,
  });
  const [nextPage, setNextPage] = useState(0);
  const [earningPage, setEarningPage] = useState(0);

  const closeModal = () => setFilterModal(false);

  const onSave = values => {
    setIsFilter(true);
    if (selectedTab === 1) {
      setNextPage(0);
      setTrxFilter(p => ({...p, ...values}));
    } else {
      setEarningPage(0);
      setEarnFilter(p => ({...p, ...values}));
    }
  };

  const clearFilter = () => {
    setIsFilter(false);
    if (selectedTab === 1) {
      setNextPage(0);
      setTrxFilter({payment_type: null, start_date: null, end_date: null});
    } else {
      setEarningPage(0);
      setEarnFilter({type: null, start_date: null, end_date: null});
    }
  };

  const onSelectTab = tab => {
    setSelectedTab(tab);
  };

  useEffect(() => {
    getRecentTransactions(true);
    if (isArtist) {
      getMyEarnings(true);
    }
  }, [trxfilter, earnfilter]);

  const getRecentTransactions = (fresh = true) => {
    dispatch(
      ArtistMiddleware.GetTransactions({
        ...trxfilter,
        offset: isFilter ? 0 : nextPage,
        limit: isFilter ? 100 : undefined,
        cb: res => {
          console.log('===res===>', JSON.stringify(res, null, 1));
          if (res !== 'error') {
            if (fresh) {
              setData(res);
              setNextPage(1);
            } else {
              setData(p => {
                const temp = [...p, ...res];
                return removeDuplicatesById(temp);
              });
              setNextPage(p => p + 1);
            }
          }
        },
      }),
    );
  };

  const getMyEarnings = (fresh = true) => {
    console.log('===earningFilters===>', JSON.stringify(earnfilter, null, 1));
    dispatch(
      ArtistMiddleware.GetMyEarnings({
        ...earnfilter,
        offset: isFilter ? 0 : earningPage,
        limit: isFilter ? 100 : undefined,
        cb: res => {
          if (res !== 'error') {
            // setEarningPage(nextPage + 1);
            // setMyEarnings(p => [...p, ...res]);
            if (fresh) {
              setMyEarnings(res);
              setEarningPage(1);
            } else {
              setMyEarnings(p => {
                const temp = [...p, ...res];
                return removeDuplicatesById(temp);
              });
              setEarningPage(p => p + 1);
            }
          }
        },
      }),
    );
  };

  const renderItem = ({item, isEarning}) => (
    <TransactionCard item={item} isEarning={isEarning} />
  );

  return (
    <View style={gstyles.container}>
      <Header
        back={true}
        title={t('RECENT_TRANSACTION')}
        isIcon={false}
        disabled={true}
        renderRightIcon={() => (
          <Icons.Ionicons
            name={'filter'}
            color={Colors.blue}
            size={Metrix.customFontSize(27)}
            onPress={() => setFilterModal(true)}
          />
        )}
      />
      {/* {user?.user_role === 1 && (
        <View style={gstyles.marginVertical30}>
          <BalanceCard balance={user?.remaining_earning} />
        </View>
      )} */}
      <View style={styles.transactionListHeader}>
        {isArtist && (
          <SelectTrxType onSelectTab={onSelectTab} selectedTab={selectedTab} />
        )}
      </View>
      {selectedTab === 1 ? (
        <FlatList
          key="transactions"
          data={data}
          style={gstyles.marginVertical5}
          keyExtractor={item => item?.id?.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: Metrix.VerticalSize(80)}}
          onEndReachedThreshold={0.3}
          onEndReached={() => getRecentTransactions(false)}
          renderItem={renderItem}
          ListEmptyComponent={<ListEmpty message={t('EMPTY_LISTING')} />}
        />
      ) : (
        <FlatList
          key="earnings"
          data={myearnings}
          style={gstyles.marginVertical5}
          keyExtractor={item => item?.id?.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: Metrix.VerticalSize(80)}}
          onEndReachedThreshold={0.3}
          onEndReached={() => getMyEarnings(false)}
          renderItem={({item, index}) => renderItem({item, isEarning: true})}
          ListEmptyComponent={<ListEmpty message={t('EMPTY_LISTING')} />}
        />
      )}
      <TransactionFilter
        isVisible={filterModal}
        closeModal={closeModal}
        filters={selectedTab === 1 ? trxfilter : earnfilter}
        onSave={onSave}
        clearFilter={clearFilter}
        isEarning={selectedTab === 2}
        isFan={false}
      />
    </View>
  );
};

export default RecentTransactions;

export const SelectTrxType = ({selectedTab, onSelectTab}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.selectionContainer}>
      <TouchableOpacity
        onPress={() => onSelectTab(1)}
        key={'transactions'}
        style={[styles.tab, selectedTab === 1 && styles.selectedTab]}>
        <Text allowFontScaling={false} style={[styles.tabText]}>{t('TRANSACTION')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onSelectTab(2)}
        key={'earning'}
        style={[styles.tab, selectedTab === 2 && styles.selectedTab]}>
        <Text allowFontScaling={false} style={[styles.tabText]}>{t('EARNING')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
    height: Metrix.VerticalSize(40),
    backgroundColor: Colors.toggleOff,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  selectedTab: {
    backgroundColor: Colors.blue,
  },
  tabText: {
    color: 'white',
  },
  selectedTabText: {},
  title: {
    marginRight: Metrix.HorizontalSize(16),
    fontFamily: fonts.MontserratSemiBold,
    fontSize: Metrix.customFontSize(18),
    color: Colors.white,
  },
  month: {
    color: Colors.white,
    fontFamily: fonts.MontserratRegular,
    fontSize: Metrix.customFontSize(16),
    marginRight: Metrix.HorizontalSize(16),
  },
  transactionListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Metrix.VerticalSize(20),
  },
});
