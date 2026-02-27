import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import gstyles from '../../styles';
import {Header, FollowersListing, FollowingListing} from '../../Components';
import {capitalize} from '../../Config/Helper';

const LIST_TYPE_KEYS = {
  following: 'FOLLOWING',
  xclusive_followers: 'XCLUSIVE_FOLLOWERS',
  free_followers: 'FREE_FOLLOWERS',
};

const FollowersList = ({route}) => {
  const {t} = useTranslation();
  const id = route?.params?.id;
  const listType = route?.params?.listType || 'following';
  const artistName = route?.params?.artistName;

  const titleKey = LIST_TYPE_KEYS[listType] || 'FOLLOWING';
  const title = t(titleKey) || titleKey.replace(/_/g, ' ');
  const headerTitle = artistName
    ? `${capitalize(artistName)} - ${title}`
    : title;

  const isFollowing = listType === 'following';
  // type: 1 = exclusive followers, 2 = free followers (default)
  const followerType = listType === 'xclusive_followers' ? 1 : 2;

  return (
    <View style={gstyles.container}>
      <Header back={true} title={headerTitle} isIcon={false} />
      <View style={gstyles.marginVertical15}>
        {isFollowing ? (
          <FollowingListing selectedTab={0} id={id} type={2} />
        ) : (
          <FollowersListing selectedTab={0} id={id} type={followerType} />
        )}
      </View>
    </View>
  );
};

export default FollowersList;
