import * as React from 'react';
import { View } from 'react-native';
import { constants } from 'react-native-scrollable-navigation-bar';
import MainTitleNavigationBar from '.';

class CollapsibleStickyTitleNavigationBar extends React.Component {
  render() {
    return (
      <MainTitleNavigationBar
        stickyCollapsible
        collapsible
        stickyHeight={
          constants.NAVIGATION_BAR_HEIGHT - constants.STATUS_BAR_HEIGHT
        }
        StickyComponent={() => (
          <View style={{ backgroundColor: 'red', height: 50 }} />
        )}
      />
    );
  }
}

export default CollapsibleStickyTitleNavigationBar;
