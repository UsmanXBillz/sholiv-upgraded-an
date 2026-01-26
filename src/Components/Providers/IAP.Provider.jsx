/* eslint-disable react-hooks/exhaustive-deps */
import React, {createContext, useContext, useEffect, useState} from 'react';
import {Alert, Platform} from 'react-native';
import * as IAP from 'react-native-iap';
import {useDispatch, useSelector} from 'react-redux';
import {LoaderAction} from '../../Redux/Actions';
import {AuthMiddleware} from '../../Redux/Middlewares';

export const MESSAGES_SKUS = [
  'com.sholiv.message.bundle',
  'com.sholiv.message.single',
];
export const SKUS_PRODUCTS = [
  'com.sholiv.message.bundle',
  'com.sholiv.gold.package',
  'com.sholiv.vip.package',
];
export const ARTIST_ONLY_SKUS_PRODUCTS = ['com.sholiv.artist.boost.profile'];
export const FOLLOW_ARTIST_SKU_PRODUCT = ['com.sholiv.artist.follow'];
export const BOOST_POST_SKUS_PRODUCTS = ['com.sholiv.boost.post'];
export const LIVE_ACCESS_SKUS_PRODUCTS = ['com.sholiv.livestream.access'];

export const COMPETITION_ACCESS_SKUS_PRODUCTS = [
  'com.sholiv.competition.access',
];

export const GIFT_LIVESTREAM_SKUS_PRODUCTS = [
  'com.sholiv.livestream.gift.one',
  'com.sholiv.livestream.gift.two',
  'com.sholiv.livestream.gift.three',
  'com.sholiv.livestream.gift.five',
  'com.sholiv.livestream.gift.ten',
  'com.sholiv.livestream.gift.twentyfive',
];

export const IapContext = createContext({
  isConnected: false,
  plans: {
    allPlans: [],
    messagePlans: [],
    liveStream: {},
    competition: {},
    boostProfile: {},
    boostPost: {},
    boostCommunityPost: {},
    liveGift: [],
    artistFollow: {},
  },
  handlePurchase: async (sku, cb, data) => {},
  updateItemPurchaseRef: data => {},
});

export const useIAP = () => {
  const context = useContext(IapContext);
  return context;
};

const IAPProvider = props => {
  const {children} = props;
  const user = useSelector(store => store.AuthReducer.user);
  const iapLoader = useSelector(state => state?.LoaderReducer?.iapLoader);

  const [metadata, setMetadata] = useState(null);
  const [callback, setCallBack] = useState(null);

  const dispatch = useDispatch();

  const updateItemPurchaseRef = data => {};

  const [isConnected, setConnected] = useState(false);
  const [plans, setPlans] = useState({
    allPlans: [],
    messagePlans: [],
    liveStream: {},
    competition: {},
    boostProfile: {},
    boostPost: {},
    boostCommunityPost: {},
    liveGift: {},
  });

  const handleIAPConnection = async res => {
    setConnected(res);
    if (res) {
      console.log('===INITIALIZED IAP===>', JSON.stringify(res, null, 1));
      const allPlans = await IAP.fetchProducts({skus: SKUS_PRODUCTS});
      const messagePlans = await IAP.fetchProducts({skus: MESSAGES_SKUS});
      const liveStream = await IAP.fetchProducts({
        skus: LIVE_ACCESS_SKUS_PRODUCTS,
        type: 'in-app',
      });
      console.log(
        '===[IAP] Livestream===>',
        JSON.stringify(liveStream, null, 1),
      );
      const boostProfile = await IAP.fetchProducts({
        skus: ARTIST_ONLY_SKUS_PRODUCTS,
        type: 'in-app',
      });
      const boostPost = await IAP.fetchProducts({
        skus: BOOST_POST_SKUS_PRODUCTS,
      });
      const competition = await IAP.fetchProducts({
        skus: COMPETITION_ACCESS_SKUS_PRODUCTS,
      });
      const liveGift = await IAP.fetchProducts({
        skus: GIFT_LIVESTREAM_SKUS_PRODUCTS,
      });
      const artistFollow = await IAP.fetchProducts({
        skus: FOLLOW_ARTIST_SKU_PRODUCT,
      });
      console.log('===liveGift===>', JSON.stringify(liveGift, null, 1));
      setPlans({
        allPlans:
          user?.user_role === 1 ? [boostProfile[0], ...allPlans] : allPlans,
        messagePlans,
        liveStream: liveStream[0],
        boostProfile: boostProfile[0],
        competition: competition[0],
        liveGift: liveGift,
        boostPost: boostPost[0],
        artistFollow: artistFollow[0],
      });
    }
  };

  const handleInitConnectionError = err => {
    console.log('===[IAP] ERROR INITIALIZED IAP===>', err);
  };

  const handlePurchase = async (sku, cb, data) => {
    console.log('===data===>', JSON.stringify(data, null, 1));
    dispatch({type: 'IAP_LOADER_TRUE', payload: true});
    dispatch(LoaderAction.LoaderTrue());
    if (data) {
      setMetadata(data);
    }
    if (cb) {
      setCallBack(cb);
    }
    try {
      await IAP.requestPurchase({
        request: {
          ios: {
            sku: sku,
          },
          android: {
            skus: [sku],
          },
        },
      });
    } catch (err) {
      console.warn(err.code, err.message);
    } finally {
      dispatch({type: 'IAP_LOADER_FALSE', payload: false});
      dispatch(LoaderAction.LoaderFalse());
    }
  };

  const handleUpdateServerAboutPurchase = async (data, cb) => {
    try {
      console.log('=======2222222222=======');
      dispatch({type: 'IAP_LOADER_TRUE', payload: true});
      dispatch(LoaderAction.LoaderTrue());

      console.log(
        '===data in server update===>',
        JSON.stringify(data, null, 1),
      );
      dispatch(AuthMiddleware.IapPurchase({body: data, cb}));
    } catch (error) {
      console.log(
        '===error.message===>',
        JSON.stringify(error.message, null, 1),
      );
    } finally {
      dispatch({type: 'IAP_LOADER_FALSE', payload: false});
      dispatch(LoaderAction.LoaderFalse());
    }
  };

  const finishTransaction = async (purchase, retryTimes = 0) => {
    let retry = retryTimes;
    const maxRetry = 3;
    try {
      console.log('==========INITIAL FINISHING TRANSACTION ==========');

      console.log('===purchase[0]===>', JSON.stringify(purchase, null, 1));
      const finishRes = await IAP.finishTransaction({
        purchase: purchase,
        developerPayloadAndroid: purchase?.developerPayloadAndroid,
        isConsumable: true,
      });
      console.log('==========END FINISHING TRANSACTION ==========');
      console.log('===finishRes===>', JSON.stringify(finishRes, null, 1));
      Alert.alert('Success', 'Your transaction has been successfull');
      dispatch({type: 'IAP_LOADER_FALSE', payload: false});
    } catch (error) {
      console.log('FINISHING TRANSACTIO NERROR', error);
      if (retry >= maxRetry) {
        return Alert.alert('Payment Error', 'Please contact support');
      }
      retry = retry + 1;
      console.log('===RETRYING===>', JSON.stringify(retry, null, 1));
      await finishTransaction(purchase, retry);
    } finally {
      dispatch(LoaderAction.LoaderFalse());
    }
  };

  const handleIOSPurchaseSuccess = async (purchase, data) => {
    try {
      console.log('======HANDLING IOS SUCCESS======');
      console.log('123123123123123123123');
      dispatch({type: 'IAP_LOADER_TRUE', payload: true});
      dispatch(LoaderAction.LoaderTrue());

      const recieptValidation = await IAP.validateReceipt({
        sku: purchase.id,
      });

      console.log(
        '===recieptValidation===>',
        JSON.stringify(recieptValidation, null, 1),
      );

      if (!recieptValidation?.receiptData) {
        throw new Error('=====Receipt Validation Error=====');
      }

      const body = {
        productId: purchase?.id,
        transactionReceipt: purchase.transactionReceipt,
        transactionDate: purchase.transactionDate,
        transactionId: purchase.transactionId,
      };
      if (data) {
        Object.keys(data).map(key => (body[key] = data[key]));
      }
      console.log('======REQUESTING SERVER UPDATE======');
      await handleUpdateServerAboutPurchase(body, () =>
        finishTransaction(purchase),
      );
    } catch (error) {
      console.log('HANDLE IOS PURCHASE SUCCESS ERROR =========>', error);
    } finally {
      dispatch(LoaderAction.LoaderFalse());
    }
  };

  const handleAndroidPurchaseSuccess = async (purchase, data) => {
    try {
      console.log('===purchase===>', JSON.stringify(purchase, null, 1));
      const purchaseObject = Array.isArray(purchase) ? purchase[0] : purchase;

      const isAcknowledgedAndroid = await IAP.acknowledgePurchaseAndroid(
        purchaseObject.purchaseToken,
      );

      console.log(
        '===isAcknowledgedAndroid===>',
        JSON.stringify(isAcknowledgedAndroid, null, 1),
      );

      const body = {
        productId: purchaseObject.productId,
        transactionReceipt: purchaseObject.purchaseToken,
        transactionDate: purchaseObject.transactionDate,
        transactionId: purchaseObject.transactionId,
      };

      if (data) {
        Object.keys(data).map(key => (body[key] = data[key]));
      }

      console.log('===body===>', JSON.stringify(body, null, 1));

      await handleUpdateServerAboutPurchase(
        body,
        async () => await finishTransaction(purchaseObject),
      );
    } catch (error) {
      console.log('HANDLE ANDROID PURCHASE SUCCESS ERROR =========>', error);
    }
  };

  useEffect(() => {
    IAP.initConnection()
      .then(handleIAPConnection)
      .catch(handleInitConnectionError);
  }, []);

  useEffect(() => {
    let purchaseUpdatedListener;
    let purchaseErrorListener;

    if (isConnected && user) {
      console.log(' [IAP] PURCHASE LISTENERE USEEFFECT RUNNING=');
      purchaseUpdatedListener = IAP.purchaseUpdatedListener(async purchase => {
        if (Platform.OS === 'android') {
          await handleAndroidPurchaseSuccess(purchase, metadata);
        }
        if (Platform.OS === 'ios') {
          await handleIOSPurchaseSuccess(purchase, metadata);
        }

        if (callback) {
          console.log('==========CALLBACK FIRED=========');
          await callback();
        }
      });

      purchaseErrorListener = IAP.purchaseErrorListener(error => {
        console.warn('purchaseErrorListener', error);
      });
    }

    return () => {
      if (purchaseErrorListener && purchaseUpdatedListener) {
        purchaseUpdatedListener?.remove();
        purchaseUpdatedListener = null;
        purchaseErrorListener?.remove();
        purchaseErrorListener = null;
      }
    };
  }, [isConnected, user, metadata]);

  // useEffect(() => {
  //   (async () => {
  //     const purchases = await IAP.getPurchaseHistory();
  //     console.log('===purchases===>', JSON.stringify(purchases, null, 1));
  //     purchases
  //       .filter(p => !p.isAcknowledgedAndroid)
  //       .map(async p => {
  //         const acked = await IAP.acknowledgePurchaseAndroid({
  //           token: p.purchaseToken,
  //         });
  //         console.log('===acked===>', JSON.stringify(acked, null, 1));
  //         const res = await IAP.finishTransaction(p);
  //         console.log('FINISJF ', res);
  //       });
  //   })();
  // }, []);

  const VALUES = {
    plans,
    isConnected,
    handlePurchase,
    updateItemPurchaseRef,
    loading: iapLoader,
  };

  return <IapContext.Provider value={VALUES}>{children}</IapContext.Provider>;
};

export default IAPProvider;
