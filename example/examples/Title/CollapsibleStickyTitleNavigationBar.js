import * as React from 'react';
import { View } from 'react-native';
import MainTitleNavigationBar from '.';

class CollapsibleStickyTitleNavigationBar extends React.Component {
  render() {
    return (
      <MainTitleNavigationBar
        stickyCollapsible
        collapsible
        StickyComponent={() => (
          <View style={{ backgroundColor: 'red', height: 50 }} />
        )}
      />
    );
  }
}

export default CollapsibleStickyTitleNavigationBar;
