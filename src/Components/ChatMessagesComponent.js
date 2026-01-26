import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {TranslationComponent} from '.';
import {Colors, Metrix} from '../Config';
import {capitalize, fonts} from '../Config/Helper';

// translateWithOpenAI("How Are You", "French")
const ChatMessagesComponent = ({messages, messageList, isHost = false}) => {
  return (
    <View
      style={{
        height: Metrix.VerticalSize(170),
        padding: 10,
        backgroundColor: 'transparent',
        marginBottom: Metrix.VerticalSize(isHost ? 0 : 70),
      }}>
      <FlatList
        data={messages}
        inverted={messages && messages?.length > 0}
        ref={ref => (messageList.current = ref)}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: Metrix.VerticalSize(0)}}
        onEndReachedThreshold={0.3}
        renderItem={({item, index}) => {
          return (
            <View
              key={index?.toString()}
              style={{
                marginBottom: Metrix.VerticalSize(14),
                backgroundColor: Colors.liveColorCode,
                borderRadius: 10,
                padding: Metrix.VerticalSize(8),
              }}>
              <Text allowFontScaling={false}
                style={{
                  color: Colors.white,
                  fontFamily: fonts.MontserratSemiBold,
                }}>
                {capitalize(item?.sender)}
              </Text>
              <Text allowFontScaling={false}
                style={{
                  color: Colors.white,
                  fontFamily: fonts.MontserratRegular,
                }}>
                {item?.content}
              </Text>
              <TranslationComponent
                item={{text: item?.content}}
                isOutgoing={true}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default ChatMessagesComponent;

const styles = StyleSheet.create({});
