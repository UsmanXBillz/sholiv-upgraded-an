import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initPaymentSheet,
  presentPaymentSheet,
} from '@stripe/stripe-react-native';
import axios from 'axios';
import moment from 'moment';
import momenttz from 'moment-timezone';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import {NavigationService} from '.';
import {OPEN_AI_API_KEY} from '../../env';
import {Store} from '../Redux';
import {AuthAction} from '../Redux/Actions';
import {Platform} from 'react-native';

export let ToastError = message => {
  return {
    type: 'error',
    position: 'top',
    text1: 'Error',
    text2: message,
    visibilityTime: 4000,
    autoHide: true,
    topOffset: 30,
    onShow: () => {},
    onHide: () => {},
  };
};
export let ToastSuccess = message => {
  return {
    type: 'success',
    position: 'top',
    text1: 'Success',
    text2: message,
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 30,
    onShow: () => {},
    onHide: () => {},
  };
};

export let ToastInfo = message => {
  return {
    type: 'info',
    position: 'top',
    text1: 'Info',
    text2: message,
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 30,
    onShow: () => {},
    onHide: () => {},
  };
};

export const textCharacterLimit = (limitCount, text) => {
  if (text.length < limitCount) {
    return text;
  } else {
    return text.slice(0, limitCount);
  }
};

export const translateWithOpenAI = async (text, language) => {
  const prompt = `Please translate ${text} into ${language}`;
  try {
    const result = await axios.post(
      'https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions',
      {
        prompt: prompt,
        max_tokens: 50,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPEN_AI_API_KEY}`,
        },
      },
    );
    if (result.data.choices[0]) {
      return result?.data?.choices[0]?.text;
    } else {
      throw 'error';
    }
  } catch (error) {
    Toast.show(ToastError('Error: Something Went Wrong'));
  }
};

// export const capitalize = (word) => {
//   return word?.charAt(0)?.toUpperCase() + word?.slice(1)
// }
export const capitalize = sentence => {
  if (!sentence) {
    return ''; // Return an empty string if input is null, undefined, or an empty string
  }

  return sentence
    .split(' ')
    .map(word => word.charAt(0)?.toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const checkTourGuideStatus = async (key, cb) => {
  const res = await AsyncStorage.getItem(key);
  cb(res ? true : false);
};

export const closeTourGuideModal = async (key, cb) => {
  await AsyncStorage.setItem(key, 'true');
  cb(true);
};

export const formattedDate = date => {
  return moment(date).format('MMMM DD, YYYY');
};

export const checkVideoDuration = (duration, type) => {
  const durationInSeconds = duration / 1000;
  if (type === 'trial') {
    return durationInSeconds <= 10; // Check for 10 seconds if type is 'trial'
  } else {
    return durationInSeconds <= 60; // Check for 1 minute for other types
  }
};

export const cc_format = value => {
  var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  var matches = v.match(/\d{4,16}/g);
  var match = (matches && matches[0]) || '';
  var parts = [];

  for (i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join('-');
  } else {
    return value;
  }
};
export const fmtMSS = s => (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
export const imageSizeLimit = 5 * 1024 * 1024;

export const expiry_format = value => {
  var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  var matches = v.match(/\d{2,4}/g);
  var match = (matches && matches[0]) || '';
  var parts = [];

  for (i = 0, len = match.length; i < len; i += 2) {
    parts.push(match.substring(i, i + 2));
  }

  if (parts.length) {
    return parts.join('/');
  } else {
    return value;
  }
};

export function filterRecentSessions(sessions) {
  const now = new Date();
  const cutoff = 1.5 * 60 * 60 * 1000; // 1.5 hours in milliseconds

  return sessions.filter(session => {
    const createdAt = new Date(session.createdAt);
    return now - createdAt <= cutoff;
  });
}

export const calculateDays = (start, end) => {
  var Difference_In_Time =
    new Date(start)?.getTime() - new Date(end)?.getTime();

  // To calculate the no. of days between two dates
  var noOfDays = Difference_In_Time / (1000 * 3600 * 24) + 1;
  var daysData = [];
  for (let i = 0; i < noOfDays; i++) {
    daysData.push({});
  }
  return daysData?.length;
};

export function getFileTypeFromUrl(url) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];

  const extension = url.split('.').pop()?.toLowerCase();

  if (!extension) return 'unknown';
  if (imageExtensions.includes(extension)) return 'image';
  if (videoExtensions.includes(extension)) return 'video';
  if (url.includes('https://ssrweb.zoom.us/replay')) return 'video';

  return 'unknown';
}

export const formatRelativeTime = dateString => {
  const date = moment(dateString);
  const now = moment();

  const secondsDiff = now.diff(date, 'seconds');
  const minutesDiff = now.diff(date, 'minutes');
  const hoursDiff = now.diff(date, 'hours');
  const daysDiff = now.diff(date, 'days');

  if (secondsDiff < 60) {
    return 'few seconds ago';
  } else if (minutesDiff < 60) {
    return `${minutesDiff} minutes ago`;
  } else if (hoursDiff < 24) {
    return `${hoursDiff}h ago`;
  } else {
    return date.format('DD MMM YYYY h:mm a');
  }
};

export const getFileName = str => {
  const strippedData = str.split('/');
  return strippedData[strippedData.length - 1];
};

export const createImageFormData = async (item, formData) => {
  try {
    let formattedItem;
    const uri =
      Platform.OS === 'ios' ? item.sourceURL ?? item?.path : item?.path;
    formattedItem = {
      uri,
      name: getFileName(item?.path),
      type: item?.mime,
    };
    formData.append('images', formattedItem);
    return formData;
  } catch (error) {
    console.log('===error===>', error);
  }
};

export let hole18 = {
  tableHead: [
    'Hole',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'OUT',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    'In',
    'Total',
  ],
  widthArr: [
    90, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70,
    70, 70, 70,
  ],
};

export let hole9 = {
  tableHead: ['Hole', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Total'],
  widthArr: [90, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70],
};

export let TimeZone = [
  {
    label: '(GMT -12:00) Eniwetok, Kwajalein',
    value: '(GMT -12:00) Eniwetok, Kwajalein',
    gmt: '(GMT-1200)',
  },
  {
    label: '(GMT -11:00) Midway Island, Samoa',
    value: '(GMT -11:00) Midway Island, Samoa',
    gmt: '(GMT-1100)',
  },
  {label: '(GMT-10:00) Hawaii', value: '(GMT-10:00) Hawaii', gmt: '(GMT-1000)'},
  {
    label: '(GMT -9:30) Taiohae',
    value: '(GMT -9:30) Taiohae',
    gmt: '(GMT-0930)',
  },
  {label: '(GMT -9:00) Alaska', value: '(GMT -9:00) Alaska', gmt: '(GMT-0900)'},
  {
    label: '(GMT -8:00) Pacific Time (US & Canada)',
    value: '(GMT -8:00) Pacific Time (US & Canada)',
    gmt: '(GMT-0800)',
  },
  {
    label: '(GMT -7:00) Mountain Time (US & Canada)',
    value: '(GMT -7:00) Mountain Time (US & Canada)',
    gmt: '(GMT-0700)',
  },
  {
    label: '(GMT -6:00) Central Time (US & Canada), Mexico City',
    value: '(GMT -6:00) Central Time (US & Canada), Mexico City',
    gmt: '(GMT-0600)',
  },
  {
    label: '(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima',
    value: '(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima',
    gmt: '(GMT-0500)',
  },
  {
    label: '(GMT -4:30) Caracas',
    value: '(GMT -4:30) Caracas',
    gmt: '(GMT-0430)',
  },
  {
    label: '(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz',
    value: '(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz',
    gmt: '(GMT-0400)',
  },
  {
    label: '(GMT -3:30) Newfoundland',
    value: '(GMT -3:30) Newfoundland',
    gmt: '(GMT-0300)',
  },
  {
    label: '(GMT -3:00) Brazil, Buenos Aires, Georgetown',
    value: '(GMT -3:00) Brazil, Buenos Aires, Georgetown',
    gmt: '(GMT-0300)',
  },
  {
    label: '(GMT -2:00) Mid-Atlantic',
    value: '(GMT -2:00) Mid-Atlantic',
    gmt: '(GMT-0200)',
  },
  {
    label: '(GMT -1:00) Azores, Cape Verde Islands',
    value: '(GMT -1:00) Azores, Cape Verde Islands',
    gmt: '(GMT-0100)',
  },
  {
    label: '(GMT) Western Europe Time, London, Lisbon, Casablanca',
    value: '(GMT) Western Europe Time, London, Lisbon, Casablanca',
    gmt: '(GMT+0000)',
  },
  {
    label: '(GMT +1:00) Brussels, Copenhagen, Madrid, Paris',
    value: '(GMT +1:00) Brussels, Copenhagen, Madrid, Paris',
    gmt: '(GMT+0100)',
  },
  {
    label: '(GMT +2:00) Kaliningrad, South Africa',
    value: '(GMT +2:00) Kaliningrad, South Africa',
    gmt: '(GMT+0200)',
  },
  {
    label: '(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg',
    value: '(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg',
    gmt: '(GMT+0300)',
  },
  {label: '(GMT +3:30) Tehran', value: '(GMT +3:30) Tehran', gmt: '(GMT+0330)'},
  {
    label: '(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi',
    value: '(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi',
    gmt: '(GMT+0400)',
  },
  {label: '(GMT +4:30) Kabul', value: '(GMT +4:30) Kabul', gmt: '(GMT+0430)'},
  {
    label: '(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent',
    value: '(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent',
    gmt: '(GMT+0500)',
  },
  {
    label: '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi',
    value: '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi',
    gmt: '(GMT+0530)',
  },
  {
    label: '(GMT +5:45) Kathmandu, Pokhara',
    value: '(GMT +5:45) Kathmandu, Pokhara',
    gmt: '(GMT+1200)',
  },
  {
    label: '(GMT +6:00) Almaty, Dhaka, Colombo',
    value: '(GMT +6:00) Almaty, Dhaka, Colombo',
    gmt: '(GMT+1200)',
  },
  {
    label: '(GMT +6:30) Yangon, Mandalay',
    value: '(GMT +6:30) Yangon, Mandalay',
    gmt: '(GMT+1200)',
  },
  {
    label: '(GMT +7:00) Bangkok, Hanoi, Jakarta',
    value: '(GMT +7:00) Bangkok, Hanoi, Jakarta',
    gmt: '(GMT+1200)',
  },
  {
    label: '(GMT +8:00) Beijing, Perth, Singapore, Hong Kong',
    value: '(GMT +8:00) Beijing, Perth, Singapore, Hong Kong',
    gmt: '(GMT+1200)',
  },
  {label: '(GMT +8:45) Eucla', value: '(GMT +8:45) Eucla', gmt: '(GMT+1200)'},
  {
    label: '(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk',
    value: '(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk',
    gmt: '(GMT+1200)',
  },
  {
    label: '(GMT +9:30) Adelaide, Darwin',
    value: '(GMT +9:30) Adelaide, Darwin',
    gmt: '(GMT+1200)',
  },
  {
    label: '(GMT +10:00) Eastern Australia, Guam, Vladivostok',
    value: '(GMT +10:00) Eastern Australia, Guam, Vladivostok',
    gmt: '(GMT+1200)',
  },
  {
    label: '(GMT +10:30) Lord Howe Island',
    value: '(GMT +10:30) Lord Howe Island',
    gmt: '(GMT+1200)',
  },
  {
    label: '(GMT +11:00) Magadan, Solomon Islands, New Caledonia',
    value: '(GMT +11:00) Magadan, Solomon Islands, New Caledonia',
    gmt: '(GMT+1200)',
  },
  {
    label: '(GMT +11:30) Norfolk Island',
    value: '(GMT +11:30) Norfolk Island',
    gmt: '(GMT+1200)',
  },
  {
    label: '(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka',
    value: '(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka',
    gmt: '(GMT+1200)',
  },
  {
    label: '(GMT +12:45) Chatham Islands',
    value: '(GMT +12:45) Chatham Islands',
    gmt: '(GMT+1200)',
  },
  {
    label: '(GMT +13:00) Apia, Nukualofa',
    value: '(GMT +13:00)',
    gmt: '(GMT+1200)',
  },
  {
    label: '(GMT +14:00) Line Islands, Tokelau',
    value: '(GMT +14:00) Line Islands, Tokelau',
    gmt: '(GMT+1200)',
  },
];

export const emailValidityCheck = email => {
  // if (/^[a-z0-9][-a-z0-9.!#$%&'*+-=?^_`{|}~\/]+@([-a-z0-9]+\.)+[a-z]{2,5}$/.test(email)) {
  if (
    /^[A-Za-z0-9][-A-Z-a-z0-9.!#$%&'*+-=?^_`{|}~\/]+@([-A-Z-a-z0-9]+\.)+[A-Za-z]{2,5}$/.test(
      email,
    )
  ) {
    return true;
  }
  return false;
};

export const openStripeModal = async (data, id, type, plan, cb) => {

  // let {client_secret, ephemeralKey, customer} = data;
  // const {error, ...rest} = await initPaymentSheet({
  //   merchantDisplayName: 'streamapp',
  //   customerId: customer,
  //   customerEphemeralKeySecret: ephemeralKey,
  //   paymentIntentClientSecret: client_secret,
  //   allowsDelayedPaymentMethods: false,
  //   defaultBillingDetails: {
  //     name:
  //       Store.getState()?.AuthReducer?.user?.username ??
  //       Store.getState()?.AuthReducer?.tempUser?.username, //redux user
  //   },
  // });
  // console.log('===ERROR IN STRIPE===>', JSON.stringify(error, null, 1));

  // if (!error) {
  //   const {error, ...rest} = await presentPaymentSheet();
  //   console.log(
  //     '===ERROR IN presentPaymentSheet===>',
  //     JSON.stringify(error, null, 1),
  //   );
  //   if (
  //     error &&
  //     error.message.includes('Please check your internet connection')
  //   ) {
  //     return Toast.show({
  //       text1: 'Network Error',
  //       text2: 'Please check your internet connection',
  //       type: 'error',
  //     });
  //   }
  //   if (!error) {
  //     if (type == 'gift') {
  //       // console.warn('gift');
  //       return cb();
  //     }

  //     if (type == 'bundle') {
  //       // console.warn('bundle');

  //       return NavigationService.navigate('SuccessfulPayment', {plan});
  //     }

  //     if (type == 'livestreaming') {
  //       // console.warn('livestreaming');
  //       Toast.show(ToastSuccess('Payment Successfull'));
  //       return cb();

  //       // return NavigationService.navigate('SuccessfulPayment', { plan,  });
  //     }

  //     if (type == 'messagePlan') {
  //       console.warn('messagePlan');

  //       return NavigationService.goBack();
  //     }
  //     if (type == 'susbscriptionBundle') {
  //       // console.warn('susbscriptionBundle');
  //       return NavigationService.navigate('SuccessfulPayment', {plan});
  //     }
  //     // console.warn('rest of teh payments eg artistprofile');

  //     NavigationService.navigate('SuccessfulAccessPayment', {id});
  //   }
  // }
};

export const handleSelectMedia = async (
  type,
  update,
  multipleImages = [],
  mediaType = 'any',
  singleImage = false,
) => {
  try {
    let files;
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const MAX_VISEO_SIZE = 25 * 1024 * 1024;

    if (type === 'gallery') {
      files = await ImagePicker.openPicker({
        multiple: !singleImage,
        mediaType: mediaType,
        maxFiles: singleImage ? 1 : 3,
      });

      // If single image mode is enabled, wrap the file in an array
      if (singleImage) {
        files = [files];
        // Check file size
        if (files?.size > MAX_FILE_SIZE) {
          return Toast.show(ToastError('File size must be less than 5 MB.'));
        }
      } else if (files.length > 3) {
        return Toast.show(
          ToastError('You cannot select more than three files.'),
        );
      }

      // Check for video duration only in multiple selection
      if (!singleImage) {
        for (const file of files) {
          if (file.mime.startsWith('video/')) {
            if (!checkVideoDuration(file.duration, 'postvideo')) {
              return Toast.show(
                ToastError('Video duration must be 60 sec or less.'),
              );
            }
          }
          // Toast.show(ToastError(file.size))

          // Check file size
          if (file.mime.startsWith('video/') && file.size > MAX_VISEO_SIZE) {
            return Toast.show(ToastError('File size must be less than 25 MB.'));
          }
          if (!file.mime.startsWith('video/') && file.size > MAX_FILE_SIZE) {
            return Toast.show(ToastError('File size must be less than 5 MB.'));
          }
        }
      }

      // Combine existing list with new files
      const combinedFiles = [...multipleImages, ...files];
      // console.log('combinedFiles', combinedFiles);

      // If combined files exceed 3, trim from the end
      if (!singleImage && combinedFiles.length > 3) {
        combinedFiles.splice(3);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'You cannot have more than three files.',
        });
      }

      update(singleImage ? files : combinedFiles); // Update with single file or combined files
    } else if (type === 'camera') {
      const image = await ImagePicker.openCamera({
        mediaType: singleImage ? 'photo' : 'any',
        cropping: false,
      });
      update(singleImage ? [image] : [...multipleImages, image]); // Wrap in an array for single image
    } else {
      Toast.show('Invalid image type.', ToastError());
      return;
    }
  } catch (error) {
    console.log('Error picking image:', error);
    throw error;
  }
};

// export const handleSelectMedia = async (type, update, multipleImages = [], mediaType = 'any') => {

//   try {
//     let files;

//     if (type === 'gallery') {
//       files = await ImagePicker.openPicker({ multiple: true, mediaType: mediaType, maxFiles: 3 })
//       if (files.length > 3) {
//         return Toast.show(ToastError('You cannot select more than three files.'));
//       }
//       // Check for video duration
//       for (const file of files) {
//         if (file.mime.startsWith('video/')) {
//           if (!checkVideoDuration(file.duration)) {
//             return Toast.show(ToastError('Video duration must be 10 sec or less.'));
//           }
//         }
//       }
//       // Combine existing list with new files
//       const combinedFiles = [...multipleImages, ...files];
//       console.log("combinedFiles", combinedFiles)

//       // If combined files exceed 3, trim from the end
//       if (combinedFiles.length > 3) {
//         combinedFiles.splice(3);
//         Toast.show({
//           type: 'error',
//           text1: 'Error',
//           text2: 'You cannot have more than three files.',
//         });
//       }
//       update(combinedFiles)
//     } else if (type === 'camera') {
//       image = await ImagePicker.openCamera({
//         mediaType: 'photo',
//         cropping: false,
//       });
//     } else {
//       Toast.show('Invalid image type.', ToastError());
//       return;
//     }

//   } catch (error) {
//     console.log('Error picking image:', error);
//     throw error;
//   }

// };

// image picker
export const pickImage = async (
  type,
  update,
  maxSizeMB,
  multiple = false,
  close: () => {},
) => {
  try {
    let image;
    let video;

    const commonOptions = {
      width: 110,
      height: 110,
      cropping: false,
      mediaType: 'photo',
      multiple: false,
    };
    if (type == 'videocam') {
      video = await ImagePicker.openCamera({mediaType: 'video', multiple});
      console.warn('videoooooo', video);
      if (video.mime.startsWith('video/')) {
        if (!checkVideoDuration(video.duration, 'postvideo')) {
          return Toast.show(
            ToastError('Video duration must be 60 sec or less.'),
          );
        }
      }
      update(video);
      return;
    }
    if (type == 'video') {
      video = await ImagePicker.openPicker({mediaType: 'video', multiple});
      update(video);
      return;
    }

    if (type === 'gallery') {
      image = await ImagePicker.openPicker(commonOptions);
    } else if (type === 'camera') {
      image = await ImagePicker.openCamera(commonOptions);
    } else {
      Toast.show('Invalid image type.', ToastError());
      return;
    }

    // if (Platform.OS === 'ios' && image?.sourceURL?.includes('GIF')) {
    //   Toast.show('GIFs are not allowed. Please select a different image.', ToastError());
    //   return;
    // }

    // if (Platform.OS === 'android' && image?.mime === 'image/gif') {
    //   Toast.show('GIFs are not allowed. Please select a different image.', ToastError());
    //   return;

    // }
    if (image?.size > maxSizeMB) {
      Toast.show(
        'Image size should be less than 20MB. Please select a different image.',
        ToastError(),
      );
      return;
    }
    update(image);
    close();
  } catch (error) {
    close();
    throw error;
  }
};

export const nameValidityCheck = text => {
  if (/^[A-Za-z.-\s]*$/.test(text)) {
    return true;
  }
  return false;
};

export const passwordValidityCheck = password => {
  if (
    /(?=[A-Za-z0-9@#$%^&+!=.,/]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=,./])(?=.{8,}).*$/.test(
      password,
    )
  ) {
    return true;
  }
  return false;
};

export const isPasswordAlphaNumeric = password => {
  if (/(?=.*?[A-Za-z])(?=.*\d)/.test(password)) {
    return true;
  }
  return false;
};

export const isPasswordLengthCorrect = password => {
  if (password.length > 5) {
    return true;
  }
  return false;
};

export const fonts = {
  RobotoLight: 'Roboto-Light',
  RobotoMedium: 'Roboto-Medium',
  MontserratRegular: 'Montserrat-Regular',
  MontserratBold: 'Montserrat-Bold',
  MontserratMedium: 'Montserrat-Medium',
  MontserratSemiBold: 'Montserrat-SemiBold',
  RubikRegular: 'Rubik-Regular',
  RubikBold: 'Rubik-Bold',
  RubikMedium: 'Rubik-Medium',
  RubikLight: 'Rubik-Light',
  LatoRegular: 'Lato-Regular.ttf',
  LatoBold: 'Lato-Bold.ttf',
};

export const convertToTimezone = (
  competitionDate,
  competitionTime,
  timezone,
) => {
  // Combine the competition date and time into a single string
  const dateTimeString = `${competitionDate} ${competitionTime}`;

  // Create a moment object with the given date, time, and timezone
  const competitionTimeInTimezone = momenttz.tz(
    dateTimeString,
    'YYYY-MM-DD HH:mm:ss',
    timezone,
  );

  // Convert the time to the local timezone
  const localTime = competitionTimeInTimezone.clone().local();

  // Format the local time to a readable string (adjust format as needed)
  return localTime.format('YYYY-MM-DD HH:mm:ss');
};

export const isCompetitionUpcoming = (
  competitionDate,
  competitionTime,
  timezone,
) => {
  // Get the current time in local timezone
  const currentTime = moment();

  // Get the local time for the competition
  const competitionLocalTime = convertToTimezone(
    competitionDate,
    competitionTime,
    timezone,
  );

  // Compare the current time with the competition time
  return currentTime.isBefore(competitionLocalTime); // Return true if current time is before competition time
};

export const logout = () => {
  Store.dispatch(AuthAction.ClearRedux());
  NavigationService.resetStack('AuthStack');
};

export const phoneNumberValidityCheck = number => {
  if (number.length >= 7 && number.length <= 14) {
    return true;
  }
  return false;
};

export const displayConsole = (key, value) => {
  // console.log(`${key}`, value ? value : '');
};

export const checkAmountValidity = amount => {
  const withdrawAmount = Number(amount);
  const isValid = /^\d*$/.test(withdrawAmount);

  if (!isValid || withdrawAmount <= 0) {
    return Toast.show(
      ToastError('Please enter valid amount, must be greater than zero.'),
    );
  }
};

export function showDistance(x1, y1, x2, y2) {
  var distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

  return (distance / 0.62137).toFixed(2);
}

export function formatAmount(amount) {
  return (Math.ceil(amount * 100) / 100).toFixed(2);
}

export const extractFileName = path => {
  const parts = path.split('/');
  return parts[parts.length - 1]; // The last part will be the file name
};

export const formatTime = time => {
  const formattedtime = moment(time).format('HH:mm:ss');
  return formattedtime;
};

export const formatDate = date => {
  const formattedDate = moment(date).format('YYYY-MM-DD');
  return formattedDate;
};

export const validateSelectedTime = selectedTime => {
  const currentTime = moment(); // Current time (in local timezone)
  const selectedMoment = moment(selectedTime); // The selected time

  // Add 1 hour to the current time
  const oneHourLater = currentTime.add(1, 'hour');

  // Compare if the selected time is at least 1 hour ahead
  if (selectedMoment.isBefore(oneHourLater)) {
    return false;
  } else {
    return true;
  }
};

export const formatZoomPassword = text => {
  return text.trim().toLowerCase().replace(/\s+/g, '').substring(0, 10);
};

export const filterObject = obj => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== null && value !== undefined && value !== '',
    ),
  );
};

export const isEndDateBeforeStartDate = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);
  return end.isBefore(start);
};

export const removeDuplicatesById = array => {
  const uniqueItems = new Map();
  array.forEach(item => {
    if (!uniqueItems.has(item.id)) {
      uniqueItems.set(item.id, item);
    }
  });
  return Array.from(uniqueItems.values());
};

export const formateTimeString = dateString => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};
