import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import Images from 'react-native-chat-images';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {
  AttachmentCard,
  ChatFooter,
  CustomModal,
  Header,
  ModalCard,
  TranslationComponent,
} from '../../Components';
import {AppData, Colors, Metrix, NavigationService} from '../../Config';
import {
  capitalize,
  fonts,
  handleSelectMedia,
  ToastError,
} from '../../Config/Helper';
import {initChat} from '../../libraries/initChat';
import {socketInstance} from '../../libraries/sockets';
import {AuthMiddleware, ChatMiddleware} from '../../Redux/Middlewares/index';
import gstyles from '../../styles';

const {imageVideoType, uploadType} = AppData;

const ChatDetails = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const messageList = useRef();
  const offsetRef = useRef(true);

  const participantData = route?.params?.participantData;
  const conversationData = route?.params?.item;

  const user = useSelector(state => state?.AuthReducer?.user);

  const [text, setText] = useState('');
  const [conversations, setConversations] = useState([]);
  const [nextPage, setNextPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    if (conversations?.length && offsetRef.current) {
      setTimeout(() => {
        messageList.current.scrollToIndex({animated: true, index: 0});
        offsetRef.current = false;
      }, 500);
    }
  }, [conversations?.length]);

  useEffect(() => {
    const updateConversation = res => {
      offsetRef.current = true;
      setConversations(prevState => [res, ...prevState]);
    };
    initChat(conversationData?.id, updateConversation);
    const unsubscribe = navigation.addListener('focus', () => {
      getMessages();
    });
    return unsubscribe;
  }, []);

  const getMessages = () => {
    dispatch(
      ChatMiddleware.GetMessages({
        id: conversationData?.id,
        offset: nextPage,
        cb: res => {
          setAttachments([]);
          setNextPage(nextPage + 1);
          setConversations([...conversations, ...res]);
        },
      }),
    );
  };
  const renderChatMessage = ({item}) => {
    const isOutgoing =
      item?.user?.id == user?.id || item?.sender_id == user?.id;

    const bubbleStyle = [
      styles.container,
      isOutgoing ? styles.myMessage : styles.otherMessage,
    ];

    return (
      <View style={bubbleStyle}>
        <View
          style={[
            styles.messageContainer,
            {
              backgroundColor: isOutgoing ? Colors.blue : Colors.white,
              borderBottomLeftRadius: 12,
              alignItems: isOutgoing ? 'flex-end' : 'flex-start',
            },
          ]}>
          <Text allowFontScaling={false}
            style={[
              styles.messageText,
              {color: isOutgoing ? Colors.white : Colors.black},
            ]}>
            {item?.latest_text ?? item?.text}
          </Text>
          {item?.images?.length > 0 && (
            <View style={styles.imagesContainer}>
              <Images
                images={item?.images}
                width={150}
                height={150}
                backgroundColor={isOutgoing ? Colors.blue : Colors.white}
                style={{
                  borderRadius: 8,
                  backgroundColor: isOutgoing ? Colors.blue : Colors.white,
                }}
              />
            </View>
          )}

          <TranslationComponent item={item} isOutgoing={isOutgoing} />

          <View style={styles.timestampContainer}>
            <Text allowFontScaling={false}
              style={[
                styles.timestamp,
                {color: isOutgoing ? Colors.white : Colors.black},
              ]}>
              {moment(item?.createdAt).format('h:mm A')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const uploadAttachments = () => {
    const formData = new FormData();

    attachments?.forEach(item => {
      let formattedItem;

      if (item.mime.startsWith('video/')) {
        formattedItem = {
          name: 'video.mp4',
          uri: Platform.OS === 'ios' ? item.sourceURL ?? item.path : item.path,
          type: item.mime,
        };
      } else if (item.mime.startsWith('image/')) {
        formattedItem = {
          name: 'image.jpg',
          uri: Platform.OS === 'ios' ? item.sourceURL ?? item.path : item.path,
          type: item.mime,
        };
      }

      if (formattedItem) {
        formData.append('images', formattedItem);
      }
    });
    dispatchCall(formData);
  };
  const dispatchCall = formData => {
    const onImageUploadSuccess = response => {
      let transformedFiles = response?.map(file => ({
        url: file?.Location,
        file_name: file?.fileName,
      }));
      const payload = {
        text,
        sender_id: user?.id,
        conversation_id: conversationData?.id,
        images: transformedFiles,
      };
      onSendMessage(payload);
    };
    dispatch(
      AuthMiddleware.UploadImage({
        payload: formData,
        type: imageVideoType,
        uploadType,
        cb: onImageUploadSuccess,
      }),
    );
  };

  const onSendPress = () => {
    if (!text.trim() && attachments.length === 0) {
      return Toast.show(ToastError(t('PLEASE_ENTER_TEXT_OR_ATTACH_A_FILE')));
    }

    offsetRef.current = true;
    const payload = {
      text: text,
      sender_id: user?.id,
      conversation_id: conversationData?.id,
      files: [],
      images: [],
    };

    // for message with attachments attached
    if (attachments?.length > 0) {
      uploadAttachments();
      return;
    }
    onSendMessage(payload);
  };

  const onSendMessage = payload => {
    const cb = res => {
      if (!res) {
        setText('');
        setModalOpen(true);
      } else {
        setText('');
        socketInstance.emit('message:send', res);
        setConversations([res, ...conversations]);
        setAttachments([]);
      }
    };
    dispatch(ChatMiddleware.SendMessage({payload, cb}));
  };
  const onClose = () => setModalOpen(false);

  const onModalPressContinue = () => {
    NavigationService.navigate('Bundles', {type: 'messagePlan'});
    setTimeout(() => {
      setModalOpen(false);
    }, 400);
  };

  const onPickImage = () => {
    handleSelectMedia(
      'gallery',
      setAttachments,
      attachments,
      (mediaType = 'photo'),
    );
  };

  const deleteAttachment = i => {
    let attachmentListing = [...attachments];
    attachmentListing?.splice(i, 1);
    setAttachments(attachmentListing);
  };
  const renderAttachments = ({item, index}) => (
    <View style={styles.attachmentWrapper}>
      <AttachmentCard item={item} index={index} onPress={deleteAttachment} />
    </View>
  );
  return (
    <View style={gstyles.container}>
      <Header
        back={true}
        title={capitalize(participantData?.name ?? participantData?.username)}
        isIcon={false}
        isChat={true}
        profileImage={participantData?.profile_pic_URL}
      />
      <FlatList
        data={conversations}
        inverted={conversations && conversations?.length > 0}
        ref={ref => (messageList.current = ref)}
        renderItem={renderChatMessage}
        // keyExtractor={(item, index) => `${index}`}
        keyExtractor={item => item?.id?.toString()}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.2}
        style={{flex: 1}}
        onEndReached={() => {
          offsetRef.current = false;
          getMessages();
        }}
      />
      <View style={styles.attachmentListContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {attachments?.map((item, index) =>
            renderAttachments({item, index, key: item?.id}),
          )}
        </ScrollView>
      </View>
      <ChatFooter
        onSendMessage={onSendPress}
        onPickImage={onPickImage}
        text={text}
        setText={setText}
      />
      <CustomModal
        show={modalOpen}
        disableScroll
        children={
          <ModalCard
            title={t('YOU_DONT_HAVE_MESSAGE_PACKAGE_PLEASE_BUY_MESSAGES')}
            bgColor={Colors.inputBg}
            onPress={onModalPressContinue}
            onClose={onClose}
            modalHeight={230}
            disableScroll
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '86%',
    marginVertical: Metrix.VerticalSize(10),
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  messageContainer: {
    paddingVertical: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(15),
    borderTopRightRadius: 12,
    borderTopLeftRadius: 14,
    flexShrink: 1,
  },
  messageText: {
    fontSize: Metrix.customFontSize(14),
    fontFamily: fonts.MontserratRegular,
    flexWrap: 'wrap',
  },
  imagesContainer: {
    marginTop: Metrix.VerticalSize(5),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  timestampContainer: {
    marginTop: Metrix.VerticalSize(5),
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: Metrix.customFontSize(12),
    fontFamily: fonts.MontserratRegular,
  },
  seeTranslation: {
    fontSize: Metrix.customFontSize(14),
    fontFamily: fonts.MontserratRegular,
    paddingVertical: 4,
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
});
export default ChatDetails;
