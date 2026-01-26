import moment from 'moment-timezone';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import {
  ArtistCard,
  ArtistListingCard,
  Button,
  CompetitionSceduling,
  Header,
  ListEmpty,
  SearchTextField,
  TextField,
} from '../../Components';
import {AppData, Colors, Icons, Metrix, NavigationService} from '../../Config';
import {
  ToastError,
  ToastSuccess,
  extractFileName,
  fonts,
  formatDate,
  formatTime,
  pickImage,
} from '../../Config/Helper';
import {ArtistMiddleware, AuthMiddleware} from '../../Redux/Middlewares/index';
import gstyles from '../../styles';
const lodash = require('lodash');
const {maxSizeMB, uploadType, imageVideoType} = AppData;

const SelectArtistsForCompetition = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedArtists, setSearchedArtists] = useState([]);
  const [nextPage, setNextPage] = useState(0);
  const [selectionMode, setSelectionMode] = useState(true);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [image, setImage] = useState(null);
  const [formattedFileName, setFormattedFileName] = useState(null);
  const [checkedSchedule, setCheckedSchedule] = useState(false);
  const [eventDate, setEventDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [text, setText] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    getAllArtists();
  }, []);

  const onDateTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || eventDate;
    setShow(Platform.OS === 'ios');
    setEventDate(currentDate);
  };

  const changeCheck = () => {
    if (checkedSchedule) {
      setCheckedSchedule(false);
    } else {
      setCheckedSchedule(true);
      // setEventDate(new Date());
    }
  };
  const getAllArtists = () =>
    dispatch(
      ArtistMiddleware.GetAllArtists({
        offset: nextPage,
        cb: res => {
          if (res !== 'error') {
            setNextPage(nextPage + 1);
            setData([...data, ...res]);
          }
        },
      }),
    );

  const toggleSelection = artist => {
    if (selectedArtists.some(item => item.id === artist.id)) {
      setSelectedArtists(selectedArtists.filter(item => item.id !== artist.id));
    } else if (selectedArtists.length < 1) {
      setSelectedArtists([...selectedArtists, artist]);
      setSelectionMode(p => !p);
    } else if (selectedArtists.length >= 1) {
      console.warn('no more', typeof selectedArtists?.length);
      setSelectionMode(p => !p);
      return Toast.show(ToastError(t('ARTIST_LIMIT_ERROR')));
    }
  };

  const searchArtist = text => {
    setSearchText(text);

    if (text && text[0] !== ' ') {
      let debounce_fun = lodash.debounce(function () {
        const cb = data => {
          setSearchedArtists(
            text || !searchedArtists ? data : [...searchedArtists, ...data],
          );
        };
        dispatch(ArtistMiddleware.GetAllArtists({cb, name: text, offset: 0}));
      }, 1000);

      debounce_fun();
    } else {
      getAllArtists();
    }
  };

  const createCompetition = () => {
    if (selectedArtists?.length < 1 && selectionMode) {
      Toast.show(ToastError(t('SELECT_ARTIST')));
      return;
    }
    if (selectedArtists?.length) {
      setSelectionMode(false);
    }
    if (selectedArtists?.length && !text && !selectionMode) {
      Toast.show(ToastError(t('TEXT_ERROR')));
      return;
    }
    if (selectedArtists?.length && !image && !selectionMode) {
      return Toast.show(ToastError(t('SELECT_IMAGE')));
    }
    if (
      selectedArtists?.length &&
      text &&
      !selectionMode &&
      (!selectedTime || !selectedDate)
    ) {
      return Toast.show(ToastError(t('SELECT_TIME_DATE')));
    }
    // if (!validateSelectedTime(selectedTime)) {
    //     console.warn(validateSelectedTime(selectedTime));
    //     return Toast.show(ToastError(t('COMPETITION_TIME_ERROR')))
    // }
    const competitionTime = formatTime(selectedTime);
    const competitionDate = formatDate(selectedDate);

    if (image && selectedArtists?.length > 0) {
      if (image) {
        const formData = new FormData();
        const thumbnailImage = {
          name: 'image.jpg',
          uri:
            Platform.OS === 'ios'
              ? image[0]?.sourceURL ?? image[0]?.path
              : image[0]?.path,
          type: 'image/jpeg',
        };
        formData.append('images', thumbnailImage);

        dispatch(
          AuthMiddleware.UploadImage({
            payload: formData,
            type: imageVideoType,
            uploadType,
            cb: response => {
              let imageArray = response?.map(i => i?.Location);
              const payload = {
                text,
                url: imageArray,
                artist_id: selectedArtists[0]?.id,
                competitionDate,
                competitionTime,
                timezone: moment.tz.guess(),
              };

              dispatch(
                ArtistMiddleware.CreateCompetition({
                  payload,
                  cb: () => {
                    Toast.show(ToastSuccess(t('COMPETITION_SUCCESS')));

                    return NavigationService.resetStack('UserStack');
                  },
                }),
              );
            },
          }),
        );
      }
    }
  };
  const imagePress = ress => {
    setImage(ress);
    const fileName = extractFileName(
      Platform.OS === 'ios'
        ? ress[0]?.sourceURL ?? ress[0]?.path
        : ress[0]?.path,
    );
    setFormattedFileName(fileName);
  };

  const renderArtistCard = ({item}) => (
    <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
      <ArtistListingCard
        data={item}
        isSelectionEnabled={true}
        isSelected={selectedArtists.some(
          selectedItem => selectedItem.id === item.id,
        )}
        onSelect={() => toggleSelection(item)} // Handle selection
      />
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={gstyles.container}>
        <Header back={true} title={t('SELECT_ARTISTS')} isIcon={false} />
        <View style={gstyles.marginVertical15}>
          <SearchTextField
            onChangeText={text => searchArtist(text)}
            value={searchText}
          />
        </View>
        {selectedArtists.length > 0 && (
          <View style={gstyles.marginTop30}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text allowFontScaling={false} style={styles.selected}>{t('SELECTED_ARTISTS')}</Text>
              {!selectionMode && (
                <TouchableOpacity
                  onPress={() => {
                    setSelectionMode(true);
                    setImage(null);
                    setFormattedFileName(null);
                  }}>
                  <Icons.AntDesign
                    name="edit"
                    color={Colors.white}
                    size={Metrix.customFontSize(22)}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.selectedArtistRow}>
              {selectedArtists?.map(item => (
                <View key={item.id}>
                  <ArtistCard item={item} width={60} height={70} />
                </View>
              ))}
            </View>
          </View>
        )}

        {!selectionMode && (
          <View>
            <View style={gstyles.marginBottom20}>
              <TextField
                value={text}
                placeholder="Enter Text"
                // label={t('EMAIL_ADDRESS')}
                onChangeText={text => setText(text)}
                icon={
                  <Icons.FontAwesome
                    name={'pencil'}
                    color={Colors.blue}
                    size={Metrix.customFontSize(20)}
                  />
                }
              />
            </View>
            {formattedFileName && (
              <Text allowFontScaling={false}
                style={{
                  color: 'white',
                  fontFamily: fonts.MontserratBold,
                  marginVertical: Metrix.VerticalSize(18),
                }}>
                {formattedFileName}
              </Text>
            )}
            <TouchableOpacity
              onPress={() => pickImage('gallery', imagePress, maxSizeMB)}
              style={{
                height: Metrix.VerticalSize(100),
                borderWidth: 2,
                borderColor: Colors.blue,
                justifyContent: 'center',
                alignItems: 'center',
                borderStyle: 'dotted',
                padding: 10,
              }}>
              <Text allowFontScaling={false} style={{color: 'white', fontFamily: fonts.MontserratBold}}>
                *Select thumbnail
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!selectionMode && (
          <CompetitionSceduling
            checkedSchedule={checkedSchedule}
            changeCheck={() => changeCheck()}
            eventDate={eventDate}
            onDateTimeChange={onDateTimeChange}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}

        <View style={styles.container}>
          {selectionMode && (
            <FlatList
              data={searchText ? searchedArtists : data}
              keyExtractor={item => item?.id?.toString()}
              contentContainerStyle={{paddingBottom: Metrix.VerticalSize(0)}}
              //   numColumns={4}
              onEndReachedThreshold={0.3}
              onEndReached={() => getAllArtists()}
              showsVerticalScrollIndicator={false}
              renderItem={renderArtistCard}
              ListEmptyComponent={<ListEmpty message={t('EMPTY_LISTING')} />}
            />
          )}
          <View>
            <Button
              buttonText={t('CONTINUE')}
              onPress={createCompetition}
              btnStyle={gstyles.marginTop10}
            />
          </View>
        </View>
        {/* </ScrollView> */}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SelectArtistsForCompetition;

const styles = StyleSheet.create({
  container: {
    ...gstyles.marginVertical10,
    height: Metrix.VerticalSize(700),
    flex: 1,
  },
  selectedArtistName: {
    color: Colors.white,
    fontSize: Metrix.customFontSize(14),
    fontFamily: 'Rubik-Regular',
  },
  selectedArtistsContainer: {
    marginVertical: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(20),
    backgroundColor: Colors.blue,
    paddingVertical: Metrix.VerticalSize(10),
  },
  selectedArtistsTitle: {
    color: Colors.white,
    fontSize: Metrix.customFontSize(16),
    fontFamily: 'Rubik-Regular',
    marginBottom: Metrix.VerticalSize(5),
  },
  selected: {
    ...gstyles.HeaderTitleText,
    marginLeft: 0,
  },
  selectedArtistRow: {
    flexDirection: 'row',
    marginTop: Metrix.VerticalSize(30),
    width: '70%',
    alignItems: 'center',
  },
});
