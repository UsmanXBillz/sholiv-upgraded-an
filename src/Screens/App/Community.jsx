import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {Header, SearchTextField} from '../../Components';
import CommunityListing from '../../Components/Community/CommunityListing';
import {Colors, Icons, Metrix} from '../../Config';
import {AuthMiddleware} from '../../Redux/Middlewares';
import gstyles from '../../styles';
const lodash = require('lodash');

export const CommunityScreen = () => {
  const {t} = useTranslation();
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const searchNextPage = useRef(0);

  const refetchListings = useSelector(
    state => state?.GeneralReducer?.refetchCommPost,
  );

  const navigateToCreatPost = () => navigation.navigate('CreateComPost');

  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedStreams, setSearchedStreams] = useState([]);

  const getPosts = () => {
    dispatch(
      AuthMiddleware.GetCommunityPosts({
        cb: result => {
          // console.log('===result===>', JSON.stringify(result, null, 1));
          if (Array.isArray(result?.post?.rows)) {
            setPosts(result?.post?.rows);
          }
        },
      }),
    );
  };

  useEffect(() => {
    getPosts();
  }, [refetchListings]);

  const searchStream = text => {
    setSearchText(text);
    searchNextPage.current = 0;
    if (text && text.trim() !== '') {
      let debounce_fun = lodash.debounce(function () {
        const handleSearchResults = data => {
          console.log('first');
          if (Array.isArray(data?.post?.rows) && data?.post?.search) {
            setSearchedStreams(data.post?.rows);
          } else {
            console.log('fitler');
            const filter = posts.filter(
              i =>
                i?.title && i.title.toLowerCase().includes(text.toLowerCase()),
            );
            console.log('===filter===>', JSON.stringify(filter, null, 1));
            setSearchedStreams(filter);
          }
        };
        dispatch(
          AuthMiddleware.GetCommunityPosts({
            cb: handleSearchResults,
            title: text,
            offset: 0,
          }),
        );
      }, 1000);
      debounce_fun();
    } else {
      searchNextPage.current = 0;
      setSearchedStreams([]);
    }
  };

  return (
    <View style={[gstyles.container, styles.container, {paddingTop: top}]}>
      <Header
        back={true}
        showIconTop
        title={'Community'}
        icon={false}
        renderRightIcon={() => (
          <View style={styles.addContainer}>
            <Icons.MaterialCommunityIcons
              name="plus-circle"
              size={Metrix.HorizontalSize(30)}
              color={Colors.blue}
              onPress={navigateToCreatPost}
              style={{backgroundColor: 'white', borderRadius: 50}}
            />
          </View>
        )}
      />
      <SearchTextField
        onChangeText={text => searchStream(text)}
        value={searchText}
      />
      <CommunityListing posts={searchText ? searchedStreams : posts} />
    </View>
  );
};

const styles = StyleSheet.create({
  addContainer: {
    // position: 'absolute',
    right: Metrix.HorizontalSize(5),
    // bottom: Metrix.VerticalSize(10),
    borderRadius: 50,
    overflow: 'hidden',
  },
  container: {
    gap: 10,
  },
});
