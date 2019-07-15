import * as React from 'react';
import { View } from 'react-native';
import { constants } from 'react-native-scrollable-navigation-bar';
import MainRegularNavigationBar from '.';

class CollapsibleStickyRegularNavigationBar extends React.Component {
  render() {
    return (
      <MainRegularNavigationBar
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

export default CollapsibleStickyRegularNavigationBar;
