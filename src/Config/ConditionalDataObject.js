import React from 'react';
import Colors from './Colors';
import Images from './Images';

export default class ConditionalData extends React.Component {
  static type = {
    profilePic: 1,
    intro: 2,
    imageVideo: 3,
  };

  static uploadType = {
    profilePic: 1,
    intro: 1,
    imageVideo: 1,
  };

  static transactionType = {
    1: 'SUBSCRIPTION_RENEWAL',
    2: 'MESSAGES_PURCHASE',
    3: 'LIVE_STREAM_ACCESS',
    10: 'BOOST_YOUR_PROFILE',
    5: 'LIVE_STREAM_GIFT',
    6: 'Competition',
    7: 'Post Bundle',
    4: 'Gold Package',
    9: 'VIP Package',
  };

  static earningType = {
    1: 'SUBSCRIBE_ARTIST',
    2: 'LIVE_STREAM',
    3: 'LIVE_STREAM_GIFT',
    4: 'MESSAGE',
  };

  static transactionTypeDetails = {
    1: 'MONTHLY_SUBSCRIPTION_TO_ARTIST_PROFILE_ACCESS',
    2: 'PURCHASE_OF_MESSAGES_BUNDLE',
    3: 'ACCESS_TO_LIVE_STREAM',
    10: 'YOU_PURCHASED_BOOST_YOUR_PROFILE',
    5: 'PURCHASE_OF_LIVE_STREAM_GIFT',
    6: 'You bought a competiton access',
    7: 'You bought boost community post',
    4: 'You bought Gold Package',
    9: 'You bought VIP Package',
  };

  static earningTypeDetails = {
    1: 'EARN_FROM_SUBSCRIBER',
    2: 'LIVE_STREAM_EARNING',
    3: 'RECIEVED_LIVE_STREAM_GIFT',
    4: 'EARNED_FROM_MESSAGE',
  };

  static earningFilter = {
    Monthly: 1,
    Weekly: 2,
  };
}
