import moment from 'moment';
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {Colors, Images, Metrix, NavigationService} from '../../Config';
import {fonts, formatRelativeTime} from '../../Config/Helper';

const Reply = ({reply}) => {
  const {text, user, createdAt} = reply;
  const isBoosted = moment().isBefore(user?.artist_expiry);

  const redirectToProfile = id => {
    NavigationService.navigate('ArtistProfile', {id});
  };

  return (
    <View style={styles.replyContainer}>
      <View style={styles.replyUserInfoContainer}>
        <TouchableOpacity
          style={styles.replyUserImageContainer}
          onPress={() => redirectToProfile(user?.id)}>
          <Image
            source={{uri: user?.profile_pic_URL}}
            style={styles.userImage}
          />
        </TouchableOpacity>
        <View style={{gap: 3}}>
          <View style={{flexDirection: 'row', gap: 1, alignItems: 'center'}}>
            <Text
              allowFontScaling={false}
              style={styles.replyUserNameText}
              onPress={() => redirectToProfile(user?.id)}>
              {user?.name}
            </Text>
            {isBoosted && (
              <Image
                source={Images.varificationBadge}
                style={{
                  height: Metrix.VerticalSize(14),
                  width: Metrix.VerticalSize(14),
                }}
              />
            )}
          </View>
          <Text allowFontScaling={false} style={styles.replyTimeText}>
            {formatRelativeTime(createdAt)}
          </Text>
        </View>
      </View>
      <Text allowFontScaling={false} style={styles.replyText}>
        {text}
      </Text>
    </View>
  );
};

const Comment = props => {
  const {
    text: comment,
    id,
    user,
    createdAt,
    currentUserId,
    editComment,
    deleteComment,
    replyComment,
    replies,
    onReplyPress,
  } = props;
  const [isEdit, setEdit] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [text, setText] = useState(comment);
  const [replyText, setReplyText] = useState('');
  const inputRef = useRef();
  const replyInputRef = useRef();
  const {t} = useTranslation();

  const onPressSubmit = () => {
    setEdit(false);
    inputRef?.current?.blur();
    editComment({commentId: id, text});
  };

  const onPressReplySubmit = () => {
    const trimmedText = replyText.trim();
    if (trimmedText) {
      replyComment({commentId: id, text: trimmedText});
      setReplyText('');
      setIsReplying(false);
    }
  };

  const handleReplyPress = () => {
    setIsReplying(true);
    onReplyPress?.();
    setTimeout(() => {
      replyInputRef?.current?.focus();
    }, 100);
  };

  const handleDelete = () => {
    Alert.alert(t('CONFIRM_DELETE'), t('CONFIRM_DELETE_MESSAGE'), [
      {text: 'Cancel', onPress: () => {}},
      {text: 'Delete', onPress: () => deleteComment({commentId: id})},
    ]);
  };

  const redirectToProfile = id => {
    NavigationService.navigate('ArtistProfile', {id});
  };

  const isBoosted = moment().isBefore(user?.artist_expiry);

  return (
    <View style={styles.commentContainer} key={id}>
      <View style={styles.userInfoContainer}>
        <TouchableOpacity
          style={styles.userImageContainer}
          onPress={() => redirectToProfile(user.id)}>
          <Image
            source={{uri: user?.profile_pic_URL}}
            style={styles.userImage}
          />
        </TouchableOpacity>
        <View style={{gap: 5}}>
          <View style={{flexDirection: 'row', gap: 1, alignItems: 'center'}}>
            <Text
              allowFontScaling={false}
              style={styles.userNameText}
              onPress={() => redirectToProfile(user.id)}>
              {user?.name}
            </Text>
            {isBoosted && (
              <View style={styles.floatBoosted}>
                <Image
                  source={Images.varificationBadge}
                  style={{
                    height: Metrix.VerticalSize(20),
                    width: Metrix.VerticalSize(20),
                  }}
                />
              </View>
            )}
          </View>
          <Text allowFontScaling={false} style={styles.communityDescText}>
            {formatRelativeTime(createdAt?.createdAt)}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          width: '100%',
          marginTop: 10,
        }}>
        <TextInput
          ref={ref => (inputRef.current = ref)}
          value={text}
          onChangeText={setText}
          style={styles.commentInput}
          placeholder="Edit your thoughts."
          placeholderTextColor={'lightgrey'}
          multiline
          editable={isEdit}
        />
        {isEdit && (
          <TouchableOpacity
            style={styles.editIconContainer}
            onPress={onPressSubmit}>
            <Icon name="send-circle" size={30} color={Colors.blue} disabled />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.commentActionContainer}>
        {currentUserId === user.id && !isEdit && (
          <>
            <TouchableOpacity
              onPress={() => {
                setEdit(true);
                inputRef.current.setNativeProps({
                  editable: true,
                });
                setTimeout(() => {
                  inputRef?.current?.focus(true);
                }, 10);
              }}>
              <Text allowFontScaling={false} style={styles.actionText}>
                {t('EDIT')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Text allowFontScaling={false} style={styles.actionText}>
                {t('DELETE')}
              </Text>
            </TouchableOpacity>
          </>
        )}
        {!isEdit && !isReplying && (
          <TouchableOpacity onPress={handleReplyPress}>
            <Text allowFontScaling={false} style={styles.actionText}>
              {t('REPLY') || 'Reply'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isReplying && (
        <View style={styles.replyInputContainer}>
          <TextInput
            ref={replyInputRef}
            value={replyText}
            onChangeText={setReplyText}
            style={styles.replyInput}
            placeholder={t('WRITE_REPLY') || 'Write a reply...'}
            placeholderTextColor={'lightgrey'}
            multiline
          />
          <View style={styles.replyButtonsContainer}>
            <TouchableOpacity onPress={() => setIsReplying(false)}>
              <Text allowFontScaling={false} style={styles.cancelText}>
                {t('CANCEL') || 'Cancel'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sendReplyButton}
              onPress={onPressReplySubmit}>
              <Icon name="send-circle" size={28} color={Colors.blue} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {replies && replies.filter(r => r.text).length > 0 && (
        <View style={styles.repliesContainer}>
          {replies
            .filter(reply => reply.text)
            .map(reply => (
              <Reply key={reply.id} reply={reply} />
            ))}
        </View>
      )}
    </View>
  );
};

const PostComments = props => {
  const {
    comments,
    onSendComment,
    text,
    setText,
    editComment,
    deleteComment,
    replyComment,
    onReplyPress,
  } = props;
  const user = useSelector(store => store.AuthReducer.user);
  const {t} = useTranslation();
  return (
    <View style={{gap: 10}}>
      <Text allowFontScaling={false} style={styles.heading}>
        {t('COMMENTS')}
      </Text>
      <View style={styles.textInputContainer}>
        <TextInput
          value={text}
          onChangeText={setText}
          style={styles.textInput}
          placeholder={t('SHARE_YOUR_THOUGHTS')}
          placeholderTextColor={Colors.lightGray}
          multiline
        />
        <TouchableOpacity style={styles.iconContainer} onPress={onSendComment}>
          <Icon name="send-circle" size={35} color={Colors.blue} disabled />
        </TouchableOpacity>
      </View>
      <FlatList
        data={comments}
        keyExtractor={item => item?.id}
        renderItem={({item}) => (
          <Comment
            {...item}
            currentUserId={user?.id}
            editComment={editComment}
            deleteComment={deleteComment}
            replyComment={replyComment}
            onReplyPress={onReplyPress}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainerStyle}
      />
    </View>
  );
};

export default PostComments;

const styles = StyleSheet.create({
  commentActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 5,
  },
  commentInput: {
    fontFamily: fonts.MontserratRegular,
    fontSize: Metrix.customFontSize(13),
    color: 'white',
    padding: 0,
    flex: 1,
    textAlignVertical: 'top',
  },
  actionText: {color: Colors.blue, fontFamily: fonts.LatoRegular},
  cancelText: {color: Colors.lightGray, fontFamily: fonts.LatoRegular},
  listContainerStyle: {gap: 5},
  heading: {
    fontFamily: fonts.MontserratBold,
    fontSize: Metrix.customFontSize(16),
    color: 'white',
  },
  commentContainer: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    padding: 10,
    textAlignVertical: 'top',
    minHeight: Metrix.VerticalSize(60),
    color: 'white',
    borderRadius: 12,
    width: '90%',
  },
  iconContainer: {
    alignItems: 'center',
    flex: 1,
    minHeight: Metrix.VerticalSize(60),
    justifyContent: 'center',
  },
  editIconContainer: {
    alignItems: 'center',
    minHeight: Metrix.VerticalSize(40),
    justifyContent: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  userImageContainer: {
    height: 40,
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.white,
    overflow: 'hidden',
  },
  userImage: {
    height: '100%',
    width: '100%',
  },
  userNameText: {
    fontFamily: fonts.LatoRegular,
    color: Colors.white,
    fontSize: Metrix.customFontSize(14),
    fontWeight: '700',
  },
  postCreatedText: {
    fontFamily: fonts.LatoRegular,
    color: Colors.white,
    fontSize: Metrix.customFontSize(13),
  },
  communityInfoContainer: {},
  communityDescText: {
    fontFamily: fonts.LatoRegular,
    color: Colors.lightGray,
    fontSize: Metrix.customFontSize(8),
  },
  // Reply input styles
  replyInputContainer: {
    marginTop: 10,
    marginLeft: 20,
    padding: 10,
    borderLeftWidth: 2,
    borderLeftColor: Colors.blue,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
  },
  replyInput: {
    fontFamily: fonts.MontserratRegular,
    fontSize: Metrix.customFontSize(12),
    color: 'white',
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    minHeight: Metrix.VerticalSize(40),
    textAlignVertical: 'top',
  },
  replyButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 15,
    marginTop: 8,
  },
  sendReplyButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Replies list styles
  repliesContainer: {
    marginTop: 10,
    marginLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: Colors.lightGray,
    paddingLeft: 10,
    gap: 8,
  },
  replyContainer: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
  },
  replyUserInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  replyUserImageContainer: {
    height: 28,
    aspectRatio: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.white,
    overflow: 'hidden',
  },
  replyUserNameText: {
    fontFamily: fonts.LatoRegular,
    color: Colors.white,
    fontSize: Metrix.customFontSize(12),
    fontWeight: '600',
  },
  replyTimeText: {
    fontFamily: fonts.LatoRegular,
    color: Colors.lightGray,
    fontSize: Metrix.customFontSize(7),
  },
  replyText: {
    fontFamily: fonts.MontserratRegular,
    fontSize: Metrix.customFontSize(12),
    color: 'white',
    marginTop: 5,
    marginLeft: 36,
  },
});
