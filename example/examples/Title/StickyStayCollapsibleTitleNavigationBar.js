import * as React from 'react';
import { View } from 'react-native';
import MainTitleNavigationBar from '.';

class StickyStayCollapsibleTitleNavigationBar extends React.Component {
  render() {
    return (
      <MainTitleNavigationBar
        stayCollapsed
        stickyCollapsible
        collapsible
        stickyHeight={50}
        StickyComponent={() => (
          <View style={{ backgroundColor: 'red', height: 50 }} />
        )}
      />
    );
  }
}

export default StickyStayCollapsibleTitleNavigationBar;
