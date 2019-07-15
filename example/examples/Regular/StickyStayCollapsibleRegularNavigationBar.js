import * as React from 'react';
import { View } from 'react-native';
import MainRegularNavigationBar from '.';

class StickyStayCollapsibleRegularNavigationBar extends React.Component {
  render() {
    return (
      <MainRegularNavigationBar
        stickyCollapsible
        collapsible
        stayCollapsed
        stickyHeight={50}
        StickyComponent={() => (
          <View style={{ backgroundColor: 'red', height: 50 }} />
        )}
      />
    );
  }
}

export default StickyStayCollapsibleRegularNavigationBar;
