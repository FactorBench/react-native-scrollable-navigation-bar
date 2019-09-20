// @flow
import * as React from 'react';
import { Animated, View } from 'react-native';
import NavigationBarTitle from './NavigationBarTitle';
import { STATUS_BAR_HEIGHT, NAVIGATION_BAR_HEIGHT } from '../../constants';
import type {
    NavigationBarProps,
    NavigationBarDefaultProps,
} from '../../types';

class NavigationBar extends React.Component<NavigationBarProps> {
  static defaultProps: NavigationBarDefaultProps = {
      navigationBarHeight: NAVIGATION_BAR_HEIGHT,
      headerLeft: null,
      headerRight: null,
  };

  render() {
      const {
          title,
          titleStyle,
          backgroundColor,
          style,
          headerLeft,
          headerRight,
          navigationBarHeight,
          borderColor,
      } = this.props;
      return (
          <Animated.View
              style={[
                  {
                      backgroundColor,
                      height: navigationBarHeight,
                      flex: 1,
                  },
                  style,
              ]}
          >
              <View
                  style={{
                      paddingTop: STATUS_BAR_HEIGHT,
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottomWidth: borderColor !== undefined ? 1 : 0,
                      borderColor,
                  }}
              >
                  <View style={{ flexDirection: 'row' }}>
                      {headerLeft}
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                      {headerRight}
                  </View>
                  <NavigationBarTitle titleStyle={titleStyle}>
                      {title}
                  </NavigationBarTitle>
              </View>
          </Animated.View>
      );
  }
}

export default NavigationBar;
