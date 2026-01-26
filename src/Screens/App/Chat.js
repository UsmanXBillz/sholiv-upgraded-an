// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { AttachmentCard, Button, ChatFooter, CustomModal, Header, ModalCard } from '../../Components';
// import { AppData, Colors, Icons, Metrix, NavigationService } from '../../Config';
// import { capitalize, fonts, handleSelectMedia, ToastError } from '../../Config/Helper';
// import gstyles from '../../styles';
// import { AuthMiddleware, ChatMiddleware } from '../../Redux/Middlewares/index';
// import { useDispatch, useSelector } from 'react-redux';
// import { socketInstance } from '../../libraries/sockets';
// import moment from 'moment';
// import Images from 'react-native-chat-images';
// import Toast from 'react-native-toast-message';


// const { imageVideoType, uploadType, userChatData } = AppData;

// const Chat = ({ route, navigation }) => {

//   const participantData = route?.params?.participantData;
//   const conversationData = route?.params?.item;
//   console.warn("conversation ID extract", conversationData?.id)

//   const user = useSelector(state => state?.AuthReducer?.user);

//   const dispatch = useDispatch();
//   const offsetRef = useRef(true);
//   const messageList = useRef();

//   const [text, setText] = useState('');
//   const [conversations, setConversations] = useState([]);
//   const [nextPage, setNextPage] = useState(0);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [attachments, setAttachments] = useState([]);

//   useEffect(() => {

//     const unsubscribe = navigation.addListener('focus', () => {
//       getMessages();
//       getUserprofile();
//     });

//     return unsubscribe;

//   }, []);

//   const getUserprofile = () => {
//     console.log("getUserprofile");
//     const cb = data => console.log("==>>data==>>latest: ", data)
//     dispatch(AuthMiddleware.GetUserProfile({ cb }))
//   }

//   const getMessages = () => {

//     dispatch(ChatMiddleware.GetMessages({
//       id: conversationData?.id,
//       offset: nextPage,
//       cb: (res) => {
//         setAttachments([])
//         console.log("res chat ANIKA==>>", res);
//         setNextPage(nextPage + 1);
//         setConversations([...conversations, ...res]);
//       }
//     }))
//   }
//   const renderChatMessage = ({ item }) => {
//     const isOutgoing = (item?.user?.id == user?.id) || (item?.sender_id == user?.id);

//     const bubbleStyle = [
//       styles.container,
//       isOutgoing ? styles.myMessage : styles.otherMessage,
//     ];

//     return (
//       <View style={bubbleStyle}>
//         <View style={[
//           styles.messageContainer,
//           {
//             backgroundColor: isOutgoing ? Colors.blue : Colors.white,
//             borderBottomLeftRadius: isOutgoing ? 0 : 12,
//             alignItems: isOutgoing ? 'flex-end' : 'flex-start',
//           }
//         ]}>
//           <Text allowFontScaling={false} style={[styles.messageText, { color: isOutgoing ? Colors.white : Colors.black }]}>
//             {item?.latest_text ?? item?.text}
//           </Text>
//           {item?.images?.length > 0 && (
//             <View style={styles.imagesContainer}>
//               <Images
//                 images={item?.images}
//                 width={150}  // Fixed width
//                 height={150} // Fixed height
//                 backgroundColor={Colors.blue}
//                 style={{ borderRadius: 8, backgroundColor: Colors.blue, }}
//               />
//             </View>
//           )}
//           <View style={styles.timestampContainer}>
//             <Text allowFontScaling={false} style={[
//               styles.timestamp,
//               { color: isOutgoing ? Colors.white : Colors.black }
//             ]}>
//               {moment(item?.createdAt).format('h:mm A')}
//             </Text>
//           </View>
//         </View>
//       </View>
//     );
//   };




//   const uploadAttachments = () => {
//     // return setAttachments(null);
//     const formData = new FormData();

//     attachments?.forEach(item => {
//       let formattedItem;

//       if (item.mime.startsWith('video/')) {

//         formattedItem = {
//           name: 'video.mp4',
//           uri: Platform.OS === 'ios' ? (item.sourceURL ?? item.path) : item.path,
//           type: item.mime,
//         };
//       } else if (item.mime.startsWith('image/')) {
//         // Format for image
//         formattedItem = {
//           name: 'image.jpg',
//           uri: Platform.OS === 'ios' ? (item.sourceURL ?? item.path) : item.path,
//           type: item.mime,
//         };
//       }

//       if (formattedItem) {
//         formData.append('images', formattedItem);
//       }
//     });
//     dispatchCall(formData);

//   }
//   const dispatchCall = (formData) => {

//     const onImageUploadSuccess = (response) => {
//       // setAttachments(null)
//       console.log("response message for artachment", response)
//       let transformedFiles = response?.map(file => ({ url: file?.Location, file_name: file?.fileName }));
//       const payload = {
//         text,
//         sender_id: user?.id,
//         conversation_id: conversationData?.id,
//         images: transformedFiles
//       }
//       console.warn(" ready payload for send message", payload)
//       onSendMessage(payload);
//     };



//     dispatch(AuthMiddleware.UploadImage({ payload: formData, type: imageVideoType, uploadType, cb: onImageUploadSuccess }));

//   }

//   const onSendPress = () => {
//     if (!text.trim() && attachments.length === 0) {
//       return Toast.show(ToastError('Please enter text or attach a file'));
//     }

//     offsetRef.current = true;
//     const payload = {
//       "text": text,
//       "sender_id": user?.id,
//       "conversation_id": conversationData?.id,
//       "files": [],
//       "images": []
//     }

//     // for message with attachments attached
//     if (attachments?.length > 0) {
//       uploadAttachments();
//       return;
//     }
//     onSendMessage(payload);
//   };

//   const onSendMessage = (payload) => {
//     // return console.warn("payloaddddd==>>::", payload)
//     const cb = (res) => {
//       if (!res) {
//         setText('');
//         setModalOpen(true)
//       } else {
//         console.log("send message ka responsepppppppp", res)
//         setText('');
//         setConversations([res, ...conversations]);
//         setAttachments([])
//       }

//     }
//     dispatch(ChatMiddleware.SendMessage({ payload, cb }))
//   }
//   const onClose = () => setModalOpen(false);

//   const onModalPressContinue = () => {
//     NavigationService.navigate('Bundles', { type: 'messagePlan' });
//     setTimeout(() => {
//       setModalOpen(false)
//     }, 400);
//   }

//   const onPickImage = () => {
//     handleSelectMedia('gallery', setAttachments, attachments, mediaType = 'photo')
//   };

//   const deleteAttachment = (i) => {
//     let attachmentListing = [...attachments];
//     attachmentListing?.splice(i, 1);
//     setAttachments(attachmentListing);

//   };
//   const renderAttachments = ({ item, index }) => (
//     <View style={styles.attachmentWrapper}>
//       <AttachmentCard item={item} index={index} onPress={deleteAttachment} />
//     </View>
//   );
//   return (
//     <View style={gstyles.container}>
//       <Header back={true} title={capitalize(participantData?.name ?? participantData?.username)} isIcon={false} isChat={true} profileImage={participantData?.profile_pic_URL} />
//       <FlatList
//         data={conversations}
//         inverted={conversations && conversations?.length > 0}
//         ref={(ref) => (messageList.current = ref)}

//         // contentContainerStyle={{ marginVertical: 30, paddingBottom: 200 }}
//         renderItem={renderChatMessage}
//         keyExtractor={(item, index) => `${index}`}
//         showsVerticalScrollIndicator={false}
//         onEndReachedThreshold={0.2}
//         onEndReached={() => { }}
//         style={{ flex: 1 }}
//       />
//       <View style={styles.attachmentListContainer}>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} >
//           {attachments?.map((item, index) => renderAttachments({ item, index, key: item?.id }))}
//         </ScrollView>
//       </View>
//       <ChatFooter onSendMessage={onSendPress} onPickImage={onPickImage} text={text} setText={setText} />
//       <CustomModal
//         show={modalOpen}
//         children={<ModalCard
//           title={'You don\'t have message package. Please Buy Messages'}
//           bgColor={Colors.inputBg}
//           onPress={onModalPressContinue}
//           onClose={onClose}
//           modalHeight={180}
//         />}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     maxWidth: '86%',
//     marginVertical: Metrix.VerticalSize(10),
//     flexDirection: 'row',  // Align items in a row
//     justifyContent: 'flex-start', // Align bubbles to the left or right
//   },
//   messageContainer: {
//     paddingVertical: Metrix.VerticalSize(10),
//     paddingHorizontal: Metrix.HorizontalSize(15),
//     borderTopRightRadius: 12,
//     borderTopLeftRadius: 14,
//     flexShrink: 1, // Allow the container to shrink to fit content
//   },
//   messageText: {
//     fontSize: Metrix.customFontSize(14),
//     fontFamily: fonts.MontserratRegular,
//     flexWrap: 'wrap', // Allow text to wrap within the container
//   },
//   imagesContainer: {
//     marginTop: Metrix.VerticalSize(5),
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'flex-start',
//     // No fixed height or width here; let the content dictate the size
//   },
//   timestampContainer: {
//     marginTop: Metrix.VerticalSize(5),
//     alignItems: 'flex-end',
//   },
//   timestamp: {
//     fontSize: Metrix.customFontSize(12),
//     fontFamily: fonts.MontserratRegular,
//   },
//   myMessage: {
//     alignSelf: 'flex-end',
//   },
//   otherMessage: {
//     alignSelf: 'flex-start',
//   },
// });



// export default Chat;

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Chat = () => {
  return (
    <View>
      <Text allowFontScaling={false}>Chat</Text>
    </View>
  )
}

export default Chat

const styles = StyleSheet.create({})
