import {TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors, Icons, Metrix} from '../Config';

const ToggleSwitch = ({on, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icons.MaterialCommunityIcons
        name={on ? 'toggle-switch' : 'toggle-switch-off'}
        color={Colors.primary}
        size={Metrix.customFontSize(40)}
      />
    </TouchableOpacity>
  );
};

export default ToggleSwitch;

