import React, {memo} from 'react';
import {Text} from 'react-native';
import styles from '../styles';

const ListEmpty = ({message, style = {}}) => {
  return <Text allowFontScaling={false} style={[styles.listEmptyStyle, {...style}]}>{message}</Text>;
};

export default memo(ListEmpty);
