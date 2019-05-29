import React from 'react';
import { TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { defaults } from '../Styles/defaultStyles';
import { colors } from '../Styles/variables';

export const CloseIcon = ({ toggle }) => (
  <TouchableHighlight onPress={toggle} underlayColor="transparent">
    <Icon
      name="close-circle"
      size={33}
      color="#ccc"
      style={defaults.closeIcon}
    />
  </TouchableHighlight>
);
