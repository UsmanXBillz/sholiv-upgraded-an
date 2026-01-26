import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {memo, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {CustomModal, ModalCard, MultiChoiceDropdown} from '.';
import {
  AppData,
  Colors,
  Icons,
  Images,
  Metrix,
  NavigationService,
} from '../Config';
import {ToastError, fonts} from '../Config/Helper';
import {ArtistMiddleware} from '../Redux/Middlewares';
import BottomTabs from './BottomTab';

const {drawerData, fanDrawerData, adminDrawerData} = AppData;

const Drawer = createDrawerNavigator();

const DrawerComponent = props => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        overlayColor: Colors.drawerOverlayColor,
        drawerStyle: {width: '70%'},
        swipeEnabled: true,
      }}
      initialRouteName="BottomTabs">
      <Drawer.Screen
        options={{
          headerShown: false,
        }}
        name="BottomTabs"
        component={BottomTabs}
      />
    </Drawer.Navigator>
  );
};

const DrawerRow = ({data, show, isArtist}) => {
  const {t} = useTranslation();

  return (
    <TouchableOpacity
      onPress={!isArtist && data?.id === '8' ? show : data?.onPress}
      activeOpacity={0.7}
      style={styles.rowContainer}>
      {data?.icon}
      <Text allowFontScaling={false} style={styles.rowTitle}>{t(data?.name)}</Text>
    </TouchableOpacity>
  );
};

const CustomDrawer = props => {
  const user = useSelector(state => state?.AuthReducer?.user);
  const isArtist = user?.user_role == 1 ? true : false;

  const {t} = useTranslation();
  const drawer_data = isArtist ? drawerData : fanDrawerData;
  const isAdmin = user?.email_address === 'admin@showliv.com';

  const [modalVisible, setModalVisible] = useState(false);
  const [artistType, setArtistType] = useState([]);
  const [selected, setSelected] = useState([]);

  const dispatch = useDispatch();

  const openCatModal = () => {
    setModalVisible(true);
  };

  const closeCatModal = () => {
    setModalVisible(false);
    setSelected([]);
  };

  useEffect(() => {
    getArtistType();
  }, []);

  const getArtistType = () => {
    const cb = data => {
      const transformedObject = data?.map(item => ({
        id: item.id,
        label: item.name,
        value: item.id,
      }));
      setArtistType(transformedObject);
    };

    dispatch(ArtistMiddleware.GetArtistType(cb));
  };

  const addUpdateCategory = () => {
    if (!selected?.length) {
      return Toast.show(ToastError('Select Artist Category'));
    }
    if (selected?.length) {
      const payload = {artist_id: selected};
      const cb = () => {
        setTimeout(() => {
          setSelected([]);
          setModalVisible(false);
        }, 500);
        NavigationService.resetStack('UserStack');
      };
      dispatch(ArtistMiddleware.PostRecommendationCategory({payload, cb, t}));
    }
  };

  return (
    <SafeAreaView style={styles.drawerContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{paddingHorizontal: Metrix.HorizontalSize(20)}}>
          <View style={styles.drawerHeader}>
            <View style={styles.userProfileImageContainer}>
              <Image
                source={Images.logo}
                resizeMode={'contain'}
                style={styles.profileImage}
              />
            </View>

            <View style={styles.drawerCloseBtnContainer}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => NavigationService.closeDrawer()}
                activeOpacity={0.7}>
                <Icons.AntDesign
                  name={'close'}
                  size={Metrix.customFontSize(22)}
                  color={Colors.white}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* <View style={{ marginVertical: Metrix.VerticalSize(10) }}>
            <Text allowFontScaling={false} style={globalStyles.usernameText}>{user?.username && capitalize(user?.username)}</Text>
          </View> */}

          <View style={{marginVertical: Metrix.VerticalSize(25)}}>
            {drawer_data?.map(item => (
              <DrawerRow
                key={item.id}
                data={item}
                show={openCatModal}
                isArtist={isArtist}
              />
            ))}
            {isAdmin &&
              adminDrawerData?.map(item => (
                <DrawerRow key={item.id} data={item} show={openCatModal} />
              ))}
          </View>
        </View>
      </ScrollView>
      <CustomModal
        show={modalVisible}
        children={
          <ModalCard
            title={t('SELECT_CATEGORY')}
            bgColor={Colors.black}
            onPress={addUpdateCategory}
            onClose={closeCatModal}
            modalHeight={260}
            children={
              <MultiChoiceDropdown
                selected={selected}
                artistType={artistType}
                setSelected={setSelected}
              />
            }
          />
        }
      />
    </SafeAreaView>
  );
};

export default memo(DrawerComponent);

const styles = StyleSheet.create({
  drawerContainer: {flex: 1, backgroundColor: Colors.primary},
  drawerHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  drawerCloseBtnContainer: {
    marginTop: Metrix.VerticalSize(40),
  },
  closeBtn: {
    width: Metrix.VerticalSize(30),
    height: Metrix.VerticalSize(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  userProfileImageContainer: {
    width: Metrix.VerticalSize(120),
    height: Metrix.VerticalSize(120),
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  iconImage: {
    width: Metrix.VerticalSize(20),
    height: Metrix.VerticalSize(20),
  },
  rowContainer: {
    flexDirection: 'row',
    marginVertical: Metrix.VerticalSize(14),
  },
  rowTitle: {
    marginLeft: Metrix.HorizontalSize(20),
    color: Colors.white,
    fontFamily: fonts.MontserratMedium,
    fontSize: Metrix.customFontSize(15),
  },
});
