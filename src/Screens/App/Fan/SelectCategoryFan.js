import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {
  AuthHeader,
  Button,
  DropdownComponent,
  ScreenTopImage,
} from '../../../Components';
import {Colors, Images, Metrix, NavigationService} from '../../../Config';
import {ToastError, fonts} from '../../../Config/Helper';
import {AuthAction} from '../../../Redux/Actions';
import {ArtistMiddleware, AuthMiddleware} from '../../../Redux/Middlewares';
import gstyles from '../../../styles';

const SelectCategoryFan = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const [index, setIndex] = useState(0);
  const [bandId, setBandId] = useState(null);
  const [artistId, setArtistId] = useState(null);
  const [artistType, setArtistType] = useState([]);
  const [bandType, setBandType] = useState([]);

  const tempuser = useSelector(state => state?.AuthReducer?.tempUser);

  useEffect(() => {
    getArtistType();
    getBandType();
  }, []);

  const getArtistType = () => {
    const cb = data => {
      const transformedObject = data?.map(item => ({
        id: item.id,
        label: item.name,
        value: item.name,
      }));
      setArtistType(transformedObject);
    };

    dispatch(ArtistMiddleware.GetArtistType(cb));
  };
  const getBandType = () => {
    const cb = data => {
      const transformedBandObject = data?.map(item => ({
        id: item.id,
        label: item.name,
        value: item.name,
      }));
      setBandType(transformedBandObject);
    };

    dispatch(ArtistMiddleware.GetBandType(cb));
  };

  const category = {
    0: (
      <DropdownComponent
        label={t('WHAT_TYPE_OF_ARTIST_YOU_ARE')}
        data={artistType}
        onChange={item => selectCategory(item)}
        preIcon={Images.microphone}
      />
    ),
    1: (
      <DropdownComponent
        label={t('ARE_YOU_A_SOLO_ARTIST_OR_PART_OF_A_GROUP')}
        data={bandType}
        // placeholder='Drums'
        onChange={item => selectCategory(item)}
        preIcon={Images.microphone}
      />
    ),
    // '2':
    //     <View style={gstyles.marginVertical40}>
    //         <View style={styles.centeredContainer}>
    //             <ScreenTopImage image={Images.userPlaceholder} size={150} rounded={false} />
    //         </View>
    //         <View style={styles.categoryRow}>
    //             <DropdownComponent
    //                 label="Band Name"
    //                 placeholder='Drums'
    //                 data={bands}
    //                 onChange={selectCategory}
    //                 preIcon={Images.band}
    //                 style={{ width: Metrix.HorizontalSize(150) }}
    //             />
    //             <DropdownComponent
    //                 label="Artist"
    //                 data={categories}
    //                 onChange={selectCategory}
    //                 preIcon={Images.microphone}
    //                 style={{ width: Metrix.HorizontalSize(150) }}

    //             />
    //         </View>
    //         <View style={styles.categoryRow}>
    //             <DropdownComponent
    //                 label="Lorem"
    //                 placeholder='Drums'
    //                 data={bands}
    //                 onChange={selectCategory}
    //                 preIcon={Images.band}
    //                 style={{ width: Metrix.HorizontalSize(150) }}
    //             />
    //             <DropdownComponent
    //                 label="Lorem"
    //                 data={categories}
    //                 onChange={selectCategory}
    //                 preIcon={Images.microphone}
    //                 style={{ width: Metrix.HorizontalSize(150) }}

    //             />
    //         </View>
    //     </View>
  };

  const buttonText = {
    0: t('NEXT'),
    1: t('CONTINUE'),
  };

  const selectCategory = item => {
    index == 0
      ? setArtistId(item?.id)
      : index == 1
      ? setBandId(item?.id)
      : console.log(index);
  };

  const onPressSignup = () => {
    const data = tempuser?.artist;
    dispatch(AuthMiddleware.Signup(data, t));
  };

  const onPressNext = () => {
    if (index == 0) {
      if (!artistId) {
        return Toast.show(ToastError(t('PLEASE_SELECT_ARTIST_TYPE')));
      }
      if (artistId) {
        const updatedData = {...tempuser?.artist, artist_id: artistId};
        dispatch(AuthAction.UpdateTempUser({artist: {...updatedData}}));
        setIndex(index + 1);
      }
    }

    if (index == 1) {
      if (!bandId) {
        return Toast.show(ToastError(t('PLEASE_SELECT_BAND_TYPE')));
      }
      if (bandId) {
        const updatedData = {...tempuser?.artist, band_id: bandId};
        dispatch(AuthAction.UpdateTempUser({artist: {...updatedData}}));
        onPressSignup();
        // setIndex(index + 1);
      }
    }
  };

  const onBackPress = () => {
    if (index > 0) {
      setIndex(index - 1);
    } else {
      NavigationService.goBack();
    }
  };

  const next = () => {};
  const title = {
    0: t('SELECT_CATEGORY'),
    1: t('SELECT_CATEGORY'),
    1: t('SELECT_CATEGORY'),
    2: t('CREATED_PROFILE'),
  };

  return (
    <View style={gstyles.container}>
      <AuthHeader
        onPress={onBackPress}
        greeting={title[index]}
        title={
          index !== 2
            ? t('UNLOCK_ENDLESS_ENTERTAINMENT')
            : 'Lorem Ipsum dolar Simit'
        }
      />
      <View>
        {index !== 2 && (
          <View style={[gstyles.marginVertical50, gstyles.justifyAlignCenter]}>
            <ScreenTopImage
              image={Images.categorySelection}
              size={230}
              rounded={false}
              resizeMode="contain"
            />
          </View>
        )}
        {category[index]}

        <View style={[gstyles.marginTop50, gstyles.marginBottom50]}>
          <Button
            buttonText={buttonText[index]}
            onPress={index == 2 ? onPressSignup : onPressNext}
          />
          {/* <Button buttonText={buttonText[index]} onPress={()=> console.warn(index)} /> */}

          {index !== 2 && (
            <View
              style={[gstyles.centeredAlignedRow, gstyles.marginVertical10]}>
              <Text allowFontScaling={false} style={gstyles.labelStyle}>
                {t('DONT_HAVE_AN_ACCOUNT')}
                <TouchableOpacity
                  onPress={() => NavigationService.navigate('Login')}>
                  <Text allowFontScaling={false} style={styles.signin}>{t('SIGN_IN')}</Text>
                </TouchableOpacity>
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default SelectCategoryFan;

const styles = StyleSheet.create({
  signin: {
    color: Colors.blue,
    fontFamily: fonts.RubikRegular,
    fontSize: Metrix.customFontSize(15),
    marginLeft: Metrix.VerticalSize(10),
    textDecorationLine: 'underline',
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Metrix.VerticalSize(25),
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Metrix.HorizontalSize(20),
  },
});
