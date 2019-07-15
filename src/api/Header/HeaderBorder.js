// @flow
import * as React from 'react';
import { View } from 'react-native';
import Sticky from '../Sticky';
import type { HeaderBorderProps } from '../../types';
import { ContextConsumer } from '../Context';

class HeaderBorder extends React.Component<HeaderBorderProps> {
  render() {
    const {
      borderColor,
      collapsible = false,
      stayCollapsed = false,
      navigationBarHeight
    } = this.props;

    if (borderColor === undefined) return null;
    return (
      <Sticky
        collapsible={collapsible}
        stayCollapsed={stayCollapsed}
        height={navigationBarHeight}
      >
        <View style={{ height: 1, backgroundColor: borderColor }} />
      </Sticky>
    );
  }
}

export default ContextConsumer(HeaderBorder);
