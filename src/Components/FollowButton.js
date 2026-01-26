import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Metrix } from '../Config'
import { fonts } from '../Config/Helper'

const FollowButton = ({ isFollowed, style = {}, onPress }) => {
  return (
    <TouchableOpacity style={styles.buttonStyle} onPress={onPress}>
      <Text allowFontScaling={false} style={styles.buttonText}>{isFollowed ? 'Following' : 'Follow'}</Text>
    </TouchableOpacity>
  )
}

export default FollowButton

const styles = StyleSheet.create({
  container: {
    color: Colors.white,
    backgroundColor: Colors.red,
    paddingVertical: Metrix.VerticalSize(10),
    // width: '30%',
    justifyContent: 'center',
    borderRadius: 6,
    // marginVertical: Metrix.VerticalSize(10)s
  },
  buttonText: {
    color: Colors.white,
    // textAlign: 'center',
    fontFamily: fonts.MontserratSemiBold
    
  },
  buttonStyle: {
    width: '100%',
    paddingHorizontal: Metrix.HorizontalSize(12),
    paddingVertical: Metrix.VerticalSize(16),
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blue
  },
})