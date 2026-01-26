import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Button, Header, ListEmpty, TransactionCard} from '../../Components';
import {Colors, Images, Metrix, NavigationService} from '../../Config';
import {formatAmount} from '../../Config/Helper';
import {ArtistMiddleware, AuthMiddleware} from '../../Redux/Middlewares';
import gstyles from '../../styles';

import {useTranslation} from 'react-i18next';
import {Image} from 'react-native';
import {fonts} from 'react-native-elements/dist/config';
import MaterialDesignIcon from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import AddBankDetailModal from '../../Components/AddBankDetailModal';
import SendWithdrawRequestModal from '../../Components/SendWithdrawRequestModal';

const Withdraw = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const user = useSelector(state => state?.AuthReducer?.user);

  const [addBankModal, setAddBankModal] = useState(false);
  const [sendRequestModal, setSendRequestModal] = useState(false);
  const [triggerGetBank, setTriggerAddBank] = useState(0);
  const [banksList, setBanksList] = useState([]);
  const [selectedTab, setSelectedTab] = useState(1);
  const [data, setData] = useState([]);
  const [nextPage, setNextPage] = useState(0);
  const [balanceData, setBalanceData] = useState({
    withdraw_requested: '0',
    total_earning: '0',
    remaining_earning: '0',
  });

  const getBanksListing = () => {
    const cb = data => {
      setBanksList(data?.bank);
    };
    dispatch(ArtistMiddleware.GetBanks({cb}));
  };

  const getBanksAndWithdraws = async () => {
    await getUserWithdraws(selectedTab);
    await getBanksListing();
  };

  useEffect(() => {
    getBanksAndWithdraws();
    getUserBalance();
  }, [triggerGetBank]);

  const getUserBalance = async () => {
    const cb = data => {
      // console.log('===balance data===>', JSON.stringify(data, null, 1));
      //       {
      //  "success": true,
      //  "withdraw_requested": 2,
      //  "total_earning": "94.10000",
      //  "remaining_earning": "92.10000"
      // }
      setBalanceData({
        withdraw_requested: data?.withdraw_requested,
        total_earning: data?.total_earning,
        remaining_earning: data?.remaining_earning,
      });
    };
    dispatch(AuthMiddleware.GetUserBalance({cb}));
  };

  const getUserWithdraws = (tabStatus, isPush = false) => {
    dispatch(
      ArtistMiddleware.GetUserWithdraw({
        status: tabStatus,
        offset: 0,
        limit: 1000,
        cb: res => {
          if (res !== 'error') {
            setNextPage(nextPage + 1);
            if (res.length == 0) {
              setData([]);
            } else {
              isPush ? setData(prev => [...prev, ...res]) : setData(res);
            }
          }
        },
      }),
    );
  };

  const renderItem = ({item}) => (
    <TransactionCard item={item} isWithdraw={true} />
  );

  const onPressWithdraw = () => {
    // if (!selectedBank) {
    //   return Toast.show(ToastError(t('PLEASE_SELECT_BANK')));
    // }
    // if (Number(user?.total_earning) < 1) {
    //   return Toast.show(
    //     ToastError(t('YOU_SHOULD_HAVE_ATLEAST_1_FOR_WITHDRAW')),
    //   );
    // }
    // const cb = () => setSelectedBank(null);
    // dispatch(ArtistMiddleware.WithdrawAmountRequest(cb, t));
    setSendRequestModal(true);
  };

  const onSelectTab = tab => {
    setNextPage(0);
    getUserWithdraws(tab);
    setSelectedTab(tab);
  };

  return (
    <View style={{...gstyles.container, flex: 1}}>
      <Header
        back={true}
        title={t('WITHDRAW_FUNDS')}
        isIcon={true}
        isImage={true}
        disabled={false}
        renderRightIcon={() => (
          <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => NavigationService.navigate('RecentTransactions')}>
              <Image
                source={Images.paymentGateway}
                style={{
                  height: Metrix.VerticalSize(40),
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
            <MaterialDesignIcon
              name="bank"
              color="white"
              size={Metrix.HorizontalSize(27)}
              onPress={() => setAddBankModal(true)}
            />
          </View>
        )}
      />
      <View style={{marginVertical: 20}}>
        {!banksList.length && (
          <Text allowFontScaling={false}
            style={{
              color: 'white',
              fontSize: 16,
              textAlign: 'center',
            }}>
            You donot have added bank details.{' '}
            <Text allowFontScaling={false}
              style={{
                color: 'white',
                fontWeight: '600',
              }}
              onPress={() => setAddBankModal(true)}>
              Click to add
            </Text>
          </Text>
        )}
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <View>
          <Text allowFontScaling={false} style={{...gstyles.incomeLabel, textAlign: 'center'}}>
            {t('TOTAL_INCOME')}
          </Text>
          <Text allowFontScaling={false} style={{...gstyles.incomeAmount, textAlign: 'center'}}>
            ${formatAmount(balanceData.total_earning || 0) ?? '0.00'}
          </Text>
        </View>
        <View>
          <Text allowFontScaling={false} style={{...gstyles.incomeLabel, textAlign: 'center'}}>
            {t('Available')}
          </Text>
          <Text allowFontScaling={false} style={{...gstyles.incomeAmount, textAlign: 'center'}}>
            ${formatAmount(balanceData.remaining_earning || 0) ?? '0.00'}
          </Text>
        </View>
        <View>
          <Text allowFontScaling={false} style={{...gstyles.incomeLabel, textAlign: 'center'}}>
            {t('Requested')}
          </Text>
          <Text allowFontScaling={false} style={{...gstyles.incomeAmount, textAlign: 'center'}}>
            ${formatAmount(balanceData.withdraw_requested || 0) ?? '0.00'}
          </Text>
        </View>
        {/* <DropdownComponent
          label={t('SELECT_BANK')}
          data={banksList}
          selectedValue={selectedBank}
          onChange={item => setSelectedBank(item)}
          preIcon={Images.microphone}
        /> */}
      </View>
      <View style={[gstyles.marginTop20, gstyles.flexRowBetween]}>
        {/* <View style={{ width: '56%' }}>
                    <TextField
                        value={amount}
                        placeholder='1234'
                        label='Enter Amount'
                        keyboardType='numeric'
                        onChangeText={(text) => setAmount(text)}
                        icon={<Icons.FontAwesome5 name={'coins'} color={Colors.blue} size={Metrix.customFontSize(22)} />}
                    />
                </View> */}
        {/* <View style={{ width: '42%', marginTop: Metrix.VerticalSize(28) }}></View> */}
        <Button
          buttonText={t('SEND_REQUEST')}
          onPress={onPressWithdraw}
          btnStyle={styles.requestBtnStyle}
        />
      </View>
      <View style={gstyles.marginTop30}>
        <Text allowFontScaling={false} style={gstyles.withdraw}>{t('WITHDRAW')}</Text>
        <SelectTrxType
          selectedTab={selectedTab}
          onSelectTab={o => onSelectTab(o)}
        />
        <View style={{height: Metrix.VerticalSize(380)}}>
          <FlatList
            data={data}
            key={
              selectedTab == 1
                ? 'requested'
                : selectedTab == 2
                ? 'completed'
                : 'requested'
            }
            keyExtractor={item => item?.id?.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: Metrix.VerticalSize(80)}}
            // onEndReachedThreshold={0.3}
            // onEndReached={() => getUserWithdraws(selectedTab, true)}
            renderItem={renderItem}
            ListEmptyComponent={<ListEmpty message={t('EMPTY_LISTING')} />}
          />
        </View>
      </View>

      <AddBankDetailModal
        isOpen={addBankModal}
        bankDetail={banksList?.length ? banksList[0] : null}
        closeModal={() => {
          setAddBankModal(false);
        }}
        setTrigger={setTriggerAddBank}
      />
      <SendWithdrawRequestModal
        isOpen={sendRequestModal}
        available={formatAmount(user?.total_earning)}
        closeModal={() => {
          setSendRequestModal(false);
        }}
        setTrigger={setTriggerAddBank}
      />
    </View>
  );
};

export default Withdraw;

export const SelectTrxType = ({selectedTab, onSelectTab}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.selectionContainer}>
      <TouchableOpacity
        onPress={() => onSelectTab(1)}
        key={'2'}
        style={[styles.tab, selectedTab === 1 && styles.selectedTab]}>
        <Text allowFontScaling={false} style={[styles.tabText]}>{t('Requested')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onSelectTab(2)}
        key={'1'}
        style={[styles.tab, selectedTab === 2 && styles.selectedTab]}>
        <Text allowFontScaling={false} style={[styles.tabText]}>{t('Completed')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onSelectTab(3)}
        key={'1'}
        style={[styles.tab, selectedTab === 3 && styles.selectedTab]}>
        <Text allowFontScaling={false} style={[styles.tabText]}>{t('Rejected')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  requestBtnStyle: {
    // paddingVertical: Metrix.VerticalSize(12),
    // marginVertical: Metrix.VerticalSize(4),
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
    height: Metrix.VerticalSize(40),
    marginBottom: 10,
    backgroundColor: Colors.toggleOff,
  },
  title: {
    marginRight: Metrix.HorizontalSize(16),
    fontFamily: fonts.MontserratSemiBold,
    fontSize: Metrix.customFontSize(18),
    color: Colors.white,
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
});
