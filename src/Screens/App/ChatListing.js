import {useFocusEffect} from '@react-navigation/native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {ChatCard, Header, ListEmpty} from '../../Components/index';
import {Metrix} from '../../Config';
import {alertListener} from '../../libraries/initChat';
import {ChatMiddleware} from '../../Redux/Middlewares/index';
import gstyles from '../../styles';

const ChatListing = () => {
  const [conversations, setConversations] = useState(null);
  const [nextpage, setNextPage] = useState(0);

  const dispatch = useDispatch();
  const {t} = useTranslation();

  useFocusEffect(
    React.useCallback(() => {
      getConversations(true, false);
      alertListener(data => getConversations(true, false));
    }, []),
  );

  const getConversations = (fresh = true, loader = true) => {
    dispatch(
      ChatMiddleware.GetConversations({
        offset: fresh ? 0 : nextpage,
        loader,
        cb: res => {
          setConversations(fresh ? res : [...conversations, ...res]);
          setNextPage(fresh ? 1 : nextpage + 1);
        },
      }),
    );
  };
  const renderItem = ({item}) => <ChatCard item={item} />;
  return (
    <View style={gstyles.container}>
      <Header back={true} title={t('CHAT')} isIcon={false} />
      <FlatList
        data={conversations}
        style={gstyles.marginVertical20}
        keyExtractor={item => item?.id?.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: Metrix.VerticalSize(100)}}
        onEndReachedThreshold={0.3}
        renderItem={renderItem}
        onEndReached={() => getConversations()}
        ListEmptyComponent={<ListEmpty message={t('EMPTY_LISTING')} />}
      />
    </View>
  );
};

export default ChatListing;

const styles = StyleSheet.create({});
