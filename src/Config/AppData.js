/* eslint-disable react/react-in-jsx-scope */
import {Colors, Icons, Images, Metrix, NavigationService} from '.';
import {Store} from '../Redux';
import {AuthAction} from '../Redux/Actions';

export default class AppData {
  static maxSizeMB = 5 * 1024 * 1024;
  static maxVideoSizeMB = 40 * 1024 * 1024;

  static uploadType = 1;

  static profilePicType = 1;

  static introVideoType = 2;

  static imageVideoType = 3;

  static priceList = {
    'com.sholiv.livestream.gift.one': {
      icon: '🚀',
    },
    'com.sholiv.livestream.gift.two': {
      icon: '🍪',
    },
    'com.sholiv.livestream.gift.three': {
      icon: '🦁',
    },
    'com.sholiv.livestream.gift.five': {
      icon: '🌟',
    },
    'com.sholiv.livestream.gift.ten': {
      icon: '🔥',
    },
    'com.sholiv.livestream.gift.twentyfive': {
      icon: '💎',
    },
  };
  // {value: '1.00', icon: '🚀'},
  // {value: '2.00', icon: '🍪'},
  // {value: '3.00', icon: '🦁'},
  // {value: '5.00', icon: '🌟'},
  // {value: '10.00', icon: '🔥'},
  // {value: '25.00', icon: '💎'},

  static notificationData = [
    {
      id: '1',
      title: 'Alexa just joined your live stream',
      type: 'notification',
      timestamp: '7:02 pm',
      image: Images.avatarone,
      timeIndicator: 'Just Now',
    },
    {
      id: '2',
      title: 'Emma is now part of your live audience',
      type: 'viewer_alert:',
      timestamp: '5:12 pm',
      image: Images.avatarone,
      timeIndicator: 'Just Now',
    },
    {
      id: '3',
      title: 'Growing fanbase! Another subscriber joined for exclusives. 🎉',
      type: 'notification',
      timestamp: '3 hours ago',
      image: Images.avatarone,
      timeIndicator: '2 hour ago',
    },
    {
      id: '4',
      title:
        'Your live stream is grabbing attention! Viewers are hooked. Keep it up',
      type: 'Breaking News:',
      image: Images.avatarone,
      timeIndicator: '1 day ago',
    },
    {
      id: '5',
      title: "Viewers are tuning in! Don't miss the action! 🚀",
      type: 'Live Now::',
      image: Images.avatarone,
      timeIndicator: '1 day ago',
    },
    {
      id: '6',
      title: "Welcome, Mia! She's now watching your live stream! 🚀",
      type: 'notification',
      image: Images.avatarone,
      timeIndicator: '1 day ago',
    },
  ];
  static artistSocialStatusData = [
    {
      count: '123',
      name: 'Videos',
    },
    {
      count: '32K',
      name: 'Followers',
    },
    {
      count: '12K',
      name: 'Videos',
    },
  ];

  static userSocialStatusData = [
    {
      count: '43',
      name: 'Posts',
    },
    {
      count: '13',
      name: 'Followers',
    },
    {
      count: '21',
      name: 'Following',
    },
  ];

  static contentTabList = ['POSTS', 'VIDEO_STREAMING', 'FREE_TRIAL'];
  static artistStatsLabels = ['FOLLOWERS', 'FOLLOWING'];
  static fanProfileStatsLabels = ['FOLLOWING'];
  static competitionLables = [
    {
      id: 1,
      value: 'PENDING',
    },
    {
      id: 2,
      value: 'ACCEPTED',
    },
    {
      id: 3,
      value: 'REJECTED',
    },
  ];

  static artistsData = [
    {
      id: '1',
      user: {
        name: 'Sonic Voyager',
        image: 'https://xsgames.co/randomusers/assets/avatars/male/44.jpg',
      },
    },
    {
      id: '2',
      user: {
        name: 'Bella Ole',
        image: 'https://xsgames.co/randomusers/assets/avatars/female/39.jpg',
      },
    },
    {
      id: '3',
      user: {
        name: 'Leo Steele',
        image: 'https://xsgames.co/randomusers/assets/avatars/male/23.jpg',
      },
    },
    {
      id: '4',
      user: {
        name: 'Luke Jett',
        image: 'https://xsgames.co/randomusers/assets/avatars/female/38.jpg',
      },
    },
    {
      id: '5',
      user: {
        name: 'Sonic Voyager',
        image: 'https://xsgames.co/randomusers/assets/avatars/male/44.jpg',
      },
    },
    {
      id: '6',
      user: {
        name: 'Bella Ole',
        image: 'https://xsgames.co/randomusers/assets/avatars/female/39.jpg',
      },
    },
    {
      id: '7',
      user: {
        name: 'Leo Steele',
        image: 'https://xsgames.co/randomusers/assets/avatars/male/23.jpg',
      },
    },
    {
      id: '8',
      user: {
        name: 'Luke Jett',
        image: 'https://xsgames.co/randomusers/assets/avatars/female/28.jpg',
      },
    },
    {
      id: '9',
      user: {
        name: 'Sonic Voyager',
        image: 'https://xsgames.co/randomusers/assets/avatars/male/54.jpg',
      },
    },
    {
      id: '10',
      user: {
        name: 'Bella Ole',
        image: 'https://xsgames.co/randomusers/assets/avatars/female/19.jpg',
      },
    },
    {
      id: '11',
      user: {
        name: 'Leo Steele',
        image: 'https://xsgames.co/randomusers/assets/avatars/male/43.jpg',
      },
    },
    {
      id: '12',
      user: {
        name: 'Luke Jett',
        image: 'https://xsgames.co/randomusers/assets/avatars/female/38.jpg',
      },
    },
    {
      id: '13',
      user: {
        name: 'Sonic Voyager',
        image: 'https://xsgames.co/randomusers/assets/avatars/male/44.jpg',
      },
    },
    {
      id: '14',
      user: {
        name: 'Bella Ole',
        image: 'https://xsgames.co/randomusers/assets/avatars/female/39.jpg',
      },
    },
    {
      id: '15',
      user: {
        name: 'Leo Steele',
        image: 'https://xsgames.co/randomusers/assets/avatars/male/23.jpg',
      },
    },
    {
      id: '16',
      user: {
        name: 'Luke Jett',
        image: 'https://xsgames.co/randomusers/assets/avatars/female/38.jpg',
      },
    },
  ];

  static userChatData = [
    {
      id: '1',
      message:
        "Hey Aliyana! 🎤 Glad you're here and enjoying the music. 🎶 Any specific songs you'd like to hear? Let me know! 😊",
      timestamp: '9:12pm',
      userId: 12,
      images: [
        'https://video-stream-23.s3.us-east-2.amazonaws.com/user/7/artist_post/05-09-2024_0.006562232971191406_image.jpg',
        'https://video-stream-23.s3.us-east-2.amazonaws.com/user/7/artist_post/05-09-2024_0.006562232971191406_image.jpg',
        'https://video-stream-23.s3.us-east-2.amazonaws.com/user/7/artist_post/05-09-2024_0.006562232971191406_image.jpg',
        'https://video-stream-23.s3.us-east-2.amazonaws.com/user/7/artist_post/05-09-2024_0.006562232971191406_image.jpg',
      ],
    },
    {
      id: '2',
      message:
        "Hey Alexa! Excited to be here. Loving the vibes! Can't wait for more. 🎶",
      timestamp: '9:10pm',
      userId: 13,
    },
    {
      id: '3',
      message:
        "Thanks, Aliyana! 🎤 So glad you're enjoying it. 🎶 Bohemian Rhapsody is on the list! Any other favorites you'd like to hear? 😊",
      timestamp: '9:16pm',
      userId: 12,
    },
    {
      id: '4',
      message:
        "Alexa your performance is amazing! 🌟 Loving the energy. Any chance we'll hear Bohemian Rhapsody by Queen?",
      timestamp: '9:13pm',
      userId: 13,
    },
  ];

  static iconRenderer = {
    Home: selected => (
      <Icons.AntDesign
        name="home"
        size={Metrix.customFontSize(25)}
        color={selected ? Colors.white : Colors.white}
      />
    ),
    Explore: selected => (
      <Icons.AntDesign
        name="find"
        size={Metrix.customFontSize(25)}
        color={selected ? Colors.white : Colors.white}
      />
    ),
    Chat: selected => (
      <Icons.Ionicons
        name="chatbubble-ellipses-outline"
        size={Metrix.customFontSize(25)}
        color={selected ? Colors.white : Colors.white}
      />
    ),
    Profile: selected => (
      <Icons.FontAwesome
        name="user-o"
        size={Metrix.customFontSize(25)}
        color={selected ? Colors.white : Colors.white}
      />
    ),
  };

  //drawer Data
  static drawerData = [
    // {
    //   id: '1',
    //   name: 'PROFILE',
    //   icon: (
    //     <Icons.FontAwesome
    //       name={'user-o'}
    //       size={Metrix.customFontSize(22)}
    //       color={Colors.blue}
    //     />
    //   ),
    //   onPress: () => NavigationService.navigate('ArtistProfile'),
    // },
    {
      id: '2',
      name: 'HOME',
      icon: (
        <Icons.FontAwesome
          name={'home'}
          size={Metrix.customFontSize(22)}
          color={Colors.blue}
        />
      ),
      onPress: () => NavigationService.resetStack('Drawer'),
    },
    {
      id: '10',
      name: 'COMMUNITY',
      icon: (
        <Icons.MaterialCommunityIcons
          name={'account-group'}
          size={Metrix.customFontSize(22)}
          color={Colors.blue}
        />
      ),
      onPress: () => NavigationService.navigate('Community'),
    },
    // {
    //   id: '3',
    //   name: 'TOP_STREAMS',
    //   icon: (
    //     <Icons.MaterialIcons
    //       name={'stream'}
    //       size={Metrix.customFontSize(22)}
    //       color={Colors.blue}
    //     />
    //   ),
    //   onPress: () => NavigationService.navigate('TopStreams'),
    // },
    {
      id: '4',
      name: 'SUBSCRIPTION_PLAN',
      icon: (
        <Icons.MaterialIcons
          name={'currency-exchange'}
          size={Metrix.customFontSize(22)}
          color={Colors.blue}
        />
      ),

      onPress: () => NavigationService.navigate('SubscriptionPlan'),
    },
    {
      id: '5',
      name: 'YOUR_SUBSCRIPTION',
      icon: (
        <Icons.AntDesign
          name={'tags'}
          size={Metrix.customFontSize(22)}
          color={Colors.blue}
        />
      ),
      onPress: () => {
        NavigationService.navigate('MySubscription');
      },
    },
    {
      id: '11',
      name: 'RECENT_TRANSACTION',
      icon: (
        <Icons.AntDesign
          name={'book'}
          color={Colors.blue}
          size={Metrix.customFontSize(28)}
        />
      ),

      onPress: () => NavigationService.navigate('RecentTransactions'),
    },
    // {
    //   id: '6',
    //   name: 'NOTIFICATION',
    //   icon: (
    //     <Icons.Ionicons
    //       name={'notifications-outline'}
    //       size={Metrix.customFontSize(22)}
    //       color={Colors.blue}
    //     />
    //   ),
    //   onPress: () => NavigationService.navigate('Notifications'),
    // },
    {
      id: '7',
      name: 'COMPETITIONS',
      icon: (
        <Icons.MaterialCommunityIcons
          name={'gamepad-circle'}
          size={Metrix.customFontSize(22)}
          color={Colors.blue}
        />
      ),
      onPress: () => NavigationService.navigate('MyCompetetions'),
    },
    {
      id: '8',
      name: 'SETTINGS',
      icon: (
        <Icons.AntDesign
          name={'setting'}
          size={Metrix.customFontSize(22)}
          color={Colors.blue}
        />
      ),
      onPress: () => NavigationService.navigate('Settings'),
    },
    {
      id: '9',
      name: 'LANGUAGE',
      icon: (
        <Icons.MaterialIcons
          name={'language'}
          size={Metrix.customFontSize(22)}
          color={Colors.blue}
        />
      ),
      onPress: () => NavigationService.navigate('LanguageSettings'),
    },
    {
      id: '10',
      name: 'LOGOUT',
      icon: (
        <Icons.MaterialCommunityIcons
          name={'logout'}
          size={Metrix.customFontSize(22)}
          color={Colors.blue}
        />
      ),
      onPress: () => {
        Store.dispatch(AuthAction.ClearRedux());
        NavigationService.resetStack('AuthStack');
      },
    },
  ];
  static adminDrawerData = [
    {
      id: '1',
      name: 'ADMIN_KPIS',
      icon: (
        <Icons.FontAwesome
          name={'user-o'}
          size={Metrix.customFontSize(22)}
          color={Colors.blue}
        />
      ),
      onPress: () => NavigationService.navigate('AdminKPIs'),
    },
  ];
  static fanDrawerData = [
    // {
    //   id: '1',
    //   name: 'PROFILE',
    //   icon: (
    //     <Icons.FontAwesome
    //       name={'user-o'}
    //       size={Metrix.customFontSize(22)}
    //       color={Colors.blue}
    //     />
    //   ),
    //   onPress: () => NavigationService.navigate('EditProfile'),
    // },
    {
      id: '2',
      name: 'HOME',
      icon: (
        <Icons.FontAwesome
          name={'home'}
          size={Metrix.customFontSize(22)}
          color={Colors.blue}
        />
      ),
      onPress: () => NavigationService.resetStack('Drawer'),
    },
    {
      id: '10',
      name: 'COMMUNITY',
      icon: (
        <Icons.MaterialCommunityIcons
          name={'account-group'}
          size={Metrix.customFontSize(22)}
          color={Colors.blue}
        />
      ),
      onPress: () => NavigationService.navigate('Community'),
    },
    {
      id: '3',
      name: 'RECOMMENDATION',
      icon: (
        <Icons.EvilIcons
          name={'like'}
          size={Metrix.customFontSize(22)}
          color={Colors.blue}
        />
      ),
      onPress: () => NavigationService.navigate('Recommendation'),
    },
    {
      id: '4',
      name: 'YOUR_SUBSCRIPTION',
      icon: (
        <Icons.AntDesign
          name={'tags'}
          size={Metrix.customFontSize(22)}
          color={Colors.blue}
        />
      ),
      onPress: () => {
        NavigationService.navigate('MySubscription');
      },
    },
    {
      id: '5',
      name: 'SUBSCRIPTION_PLAN',
      icon: (
        <Icons.MaterialIcons
          name={'currency-exchange'}
          size={Metrix.customFontSize(22)}
          color={Colors.blue}
        />
      ),

      onPress: () => NavigationService.navigate('SubscriptionPlan'),
    },
    // {
    //   id: '11',
    //   name: 'RECENT_TRANSACTION',
    //   icon: (
    //     <Icons.AntDesign
    //       name={'book'}
    //       color={Colors.blue}
    //       size={Metrix.customFontSize(28)}
    //     />
    //   ),

    //   onPress: () => NavigationService.navigate('RecentTransactions'),
    // },
    // {
    //   id: '6',
    //   name: 'NOTIFICATION',
    //   icon: (
    //     <Icons.Ionicons
    //       name={'notifications-outline'}
    //       size={Metrix.customFontSize(22)}
    //       color={Colors.blue}
    //     />
    //   ),
    //   onPress: () => NavigationService.navigate('Notifications'),
    // },
    {
      id: '7',
      name: 'UPCOMINGCOMPETITIONS',
      icon: (
        <Icons.MaterialCommunityIcons
          name={'gamepad-circle'}
          size={Metrix.customFontSize(22)}
          color={Colors.blue}
        />
      ),
      onPress: () => NavigationService.navigate('UpcomingCompetitions'),
    },
    {
      id: '12',
      name: 'SETTINGS',
      icon: (
        <Icons.AntDesign
          name={'setting'}
          size={Metrix.customFontSize(22)}
          color={Colors.blue}
        />
      ),
      onPress: () => NavigationService.navigate('Settings'),
    },
    {
      id: '8',
      name: 'CATEGORY',
      icon: (
        <Icons.MaterialIcons
          name={'category'}
          size={Metrix.customFontSize(22)}
          color={Colors.blue}
        />
      ),
      // onPress: () => NavigationService.navigate('Settings'),
    },
    {
      id: '9',
      name: 'LANGUAGE',
      icon: (
        <Icons.MaterialIcons
          name={'language'}
          size={Metrix.customFontSize(22)}
          color={Colors.blue}
        />
      ),
      onPress: () => NavigationService.navigate('LanguageSettings'),
    },
    {
      id: '10',
      name: 'LOGOUT',
      icon: (
        <Icons.MaterialCommunityIcons
          name={'logout'}
          size={Metrix.customFontSize(22)}
          color={Colors.blue}
        />
      ),
      onPress: () => {
        Store.dispatch(AuthAction.ClearRedux());
        NavigationService.resetStack('AuthStack');
      },
    },
  ];

  static recommendedArtist = [
    {
      id: '1',
      name: 'Melody Muse',
      followers: '32k',
      viewers: '808.3k',
      image: Images.profilePicture,
    },
    {
      id: '2',
      name: 'Zoe Rae',
      followers: '32k',
      viewers: '808.3k',
      image: Images.zoe,
    },
    {
      id: '3',
      name: 'Melody Muse',
      followers: '32k',
      viewers: '808.3k',
      image: Images.profilePicture,
    },
    {
      id: '4',
      name: 'Zoe Rae',
      followers: '32k',
      viewers: '808.3k',
      image: Images.zoe,
    },
  ];

  static settingsData = [
    {
      id: '1',
      name: 'PROFILE',
      onPress: () => NavigationService.navigate('Profile'),
    },
    // {
    //   id: '2',
    //   name: 'NOTIFICATIONS',
    //   onPress: () => NavigationService.navigate('NotificationsSettings'),
    // },
    {
      id: '3',
      name: 'CHANGE_PASSWORD',
      onPress: () => NavigationService.navigate('ChangePassword'),
    },
    // {
    //   id: '4',
    //   name: 'CHANGE_LANGUAGE',
    //   onPress: () => NavigationService.navigate('LanguageSettings'),
    // },
    {
      id: '5',
      name: 'DELETE_ACCOUNT',
      // onPress: () => {},
    },
  ];
  static notoficationSettingsData = [
    {
      id: '1',
      name: 'LIVE_STREAMING',
      status: 'off',
    },
    {
      id: '2',
      name: 'NEW_ARTIST_JOIN_APP',
      status: 'off',
    },
    // {
    //   id: '3',
    //   name: 'Change Lorem Ipsum',
    //   status: 'off'
    // },
    // {
    //   id: '4',
    //   name: 'Dolar Simit',
    //   status: 'off'
    // },
  ];

  static languageSettingsData = [
    {
      id: '1',
      name: 'ENGLISH',
      status: 'on',
      label: 'en',
    },
    {
      id: '2',
      name: 'SPANISH',
      status: 'off',
      label: 'es',
    },
    {
      id: '3',
      name: 'GERMAN',
      status: 'off',
      label: 'de',
    },
    {
      id: '4',
      name: 'FRENCH',
      status: 'off',
      label: 'fr',
    },
  ];

  static subscriptionPlanData = [
    {
      id: '1',
      type: 'Monthly',
      price: '$9.99/month',
      benifits: 'Flexible, cancel anytime, diverse content.',
    },
    {
      id: '2',
      type: 'Pay Per View',
      price: '$4.99/week',
      benifits: 'Per View access, on-the-go entertainment.',
    },
  ];

  static subscriptionDetailData = [
    {
      id: '1',
      title: 'Profile View',
      detail: 'Get access to artist profiles and exclusive content.',
      pricePerMonth: '$4.99/month',
      pricePerView: '$1.00/per view',
      pricingColor: Colors.blue,
      image: Images.profileView,
    },
    {
      id: '2',
      title: 'Video Streaming',
      detail: 'Enjoy live performances and exclusive streaming content.',
      pricePerMonth: '$4.99/month',
      pricePerView: '$1.00/per view',
      pricingColor: Colors.white,
      image: Images.videoStreaming,
    },
    {
      id: '3',
      title: 'Chat With Artist',
      detail: 'Directly Engage with Artists through Private Chats.',
      pricePerMonth: '$4.99/month',
      pricePerView: '$1.00/per view',
      pricingColor: Colors.white,
      image: Images.chatWithArtist,
    },
  ];
  static oneSubscriptionData = [
    {
      id: '1',
      title: 'One View',
      detail: 'Get access to one view artist profile to see content.',
      price: '$2.99',
      pricingColor: Colors.blue,
      image: Images.profileView,
    },
    {
      id: '2',
      title: 'One Message',
      detail: 'Get access of one message to send artist.',
      price: '$2.99',
      pricingColor: Colors.white,
      image: Images.videoStreaming,
    },
    {
      id: '3',
      title: 'One Subscription',
      detail: 'Get access of one artist subscription.',
      price: '$4.99',
      pricingColor: Colors.white,
      image: Images.chatWithArtist,
    },
    {
      id: '3',
      title: 'Lorem Ipsum',
      detail: 'Get access of one artist subscription.',
      price: '$4.99',
      pricingColor: Colors.white,
      image: Images.chatWithArtist,
    },
  ];

  static recentTransactionsData = [
    {
      id: '1',
      title: 'Subscription Renewal',
      detail: 'Monthly subscription to Artist Profile Access',
      date: '5 July, 2023',
      price: '$4.99',
    },
    {
      id: '1',
      title: 'Live Stream Access',
      detail: 'Access to live stream by Artist Name',
      date: '7 July, 2023',
      price: '$4.99',
    },
    {
      id: '1',
      title: 'Subscription Renewal',
      detail: 'Monthly subscription to Artist Profile Access',
      date: '11 July, 2023',
      price: '$4.99',
    },
    {
      id: '1',
      title: 'Subscription Renewal',
      detail: 'Monthly subscription to Artist Profile Access',
      date: '5 July, 2023',
      price: '$4.99',
    },
  ];

  static benifitsList = [
    {
      id: '1',
      title: 'Access to artist biographies and information.',
    },
    {
      id: '2',
      title: 'View Previous And Live Video Streaming.',
    },
    {
      id: '3',
      title: 'Exclusive behind-the-scenes content and updates from artists.',
    },
  ];

  static messages = [
    {
      id: Math.random().toString(),
      message: 'Hello',
      myMessage: true,
    },
    {
      id: Math.random().toString(),
      message: 'Hi! How can we Help you?',
      myMessage: false,
    },
    {
      id: Math.random().toString(),
      message: 'I need Help on Subscribing Plan',
      myMessage: true,
    },
    {
      id: Math.random().toString(),
      message: 'Sure! Can I call you Now?',
      myMessage: false,
    },
  ];

  static followersList = [
    {
      id: '1',
      name: 'Sonic Voyager',
      image: Images.avatarone,
      handle: '@sonicvo12',
      isFollowed: false,
    },
    {
      id: '2',
      name: 'Bella Faith',
      image: Images.liveStreamOne,
      handle: '@bella111',
      isFollowed: false,
    },
    {
      id: '3',
      name: 'Leo Steele',
      image: Images.liveStreamTwo,
      handle: '@leosteele',
      isFollowed: false,
    },
    {
      id: '4',
      name: 'Leo Steele',
      image: Images.avatarone,
      handle: '@lukeee21',
      isFollowed: false,
    },
    {
      id: '5',
      name: 'Liam Storm',
      image: Images.avatarone,
      handle: '@sonicvo12',
      isFollowed: false,
    },
    {
      id: '6',
      name: 'Owen Cruz',
      image: Images.avatarone,
      handle: '@owen000',
      isFollowed: false,
    },
    {
      id: '7',
      name: 'Sonic Voyager',
      image: Images.avatarone,
      handle: '@sonicvo12',
      isFollowed: false,
    },
    {
      id: '8',
      name: 'Bella Faith',
      image: Images.avatarone,
      handle: '@bella111',
      isFollowed: false,
    },
  ];
  static followingList = [
    {
      id: '1',
      name: 'Sonic Voyager',
      image: Images.avatarone,
      handle: '@sonicvo12',
      isFollowed: true,
    },
    {
      id: '2',
      name: 'Bella Faith',
      image: Images.liveStreamOne,
      handle: '@bella111',
      isFollowed: true,
    },
    {
      id: '3',
      name: 'Leo Steele',
      image: Images.liveStreamTwo,
      handle: '@leosteele',
      isFollowed: true,
    },
    {
      id: '4',
      name: 'Leo Steele',
      image: Images.avatarone,
      handle: '@lukeee21',
      isFollowed: true,
    },
    {
      id: '5',
      name: 'Liam Storm',
      image: Images.avatarone,
      handle: '@sonicvo12',
      isFollowed: true,
    },
    {
      id: '6',
      name: 'Owen Cruz',
      image: Images.avatarone,
      handle: '@owen000',
      isFollowed: true,
    },
    {
      id: '7',
      name: 'Sonic Voyager',
      image: Images.avatarone,
      handle: '@sonicvo12',
      isFollowed: true,
    },
    {
      id: '8',
      name: 'Bella Faith',
      image: Images.avatarone,
      handle: '@bella111',
      isFollowed: true,
    },
  ];

  static exploreArtistData = [
    {
      id: '1',
      image: Images.liveStreamOne,
      isLive: true,
    },
    {
      id: '2',
      image: Images.liveStreamTwo,
      isLive: false,
    },
    {
      id: '3',
      image: Images.liveStreamOne,
      isLive: false,
    },
    {
      id: '3',
      image: Images.liveStreamTwo,
      isLive: false,
    },
  ];

  static artistProfileData = {
    name: 'Melody Muse',
    country: 'United State',
    description:
      'Bringing creativity to life through captivating live video streams.',
    videosCount: '123',
    followersCount: '32k',
    followingCount: '12k',
    isFollowed: false,
    email: 'owencruz123@gmail.com',
  };

  static categories = [
    {
      id: 1,
      label: 'Singer',
      value: 'Singer',
    },
    {
      id: 2,
      label: 'Baker',
      value: 'Baker',
    },
    {
      id: 3,
      label: 'Makeup Artist',
      value: 'Makeup Artist',
    },
    {
      id: 4,
      label: 'Fitness Trainer',
      value: 'Fitness Trainer',
    },
  ];
  static bands = [
    {
      id: 1,
      label: 'Drums',
      value: 'Drums',
    },
    {
      id: 2,
      label: 'Iron',
      value: 'Iron',
    },
    {
      id: 3,
      label: 'Folk',
      value: 'Folk',
    },
    {
      id: 4,
      label: 'Rock',
      value: 'Rock',
    },
  ];
}
