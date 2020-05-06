// @flow
import * as React from 'react';
import { Animated, View, Platform } from 'react-native';
import { type ScrollEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { NAVIGATION_BAR_HEIGHT } from '../constants';
import Context from './Context';
import type {
    ContainerProps,
    ContainerDefaultProps,
    ContainerState,
    EventHandlerType,
} from '../types';
import EventHandler from '../EventHandler';

class Container extends React.Component<ContainerProps, ContainerState> {
  static defaultProps: ContainerDefaultProps = {
      ScrollComponent: Animated.ScrollView,
      headerHeight: 0,
      navigationBarHeight: NAVIGATION_BAR_HEIGHT,
      transitionPoint: NAVIGATION_BAR_HEIGHT,
      Header: () => null,
      StatusBar: () => null,
      snapHeight: 0,
      OverlayComponent: () => null,
  };

  state = {
      shouldEnlarge: false,
      reachedTransitionPoint: false,
      value: 0,
      androidOffset: 0,
  };

  animatedValue: Animated.Value = new Animated.Value(0);

  eventHandler: EventHandlerType<ContainerState>;

  component: ?Animated.ScrollView;

  constructor(props: ContainerProps) {
      super(props);
      const { animatedValue } = props;
      if (animatedValue !== undefined) {
          this.animatedValue = animatedValue;
      }
      this.eventHandler = EventHandler();
      this.scrollHeight = 0;
      this.contentHeight = 0;
  }

  componentDidMount() {
      const { beforeTransitionPoint } = this.props;
      if (beforeTransitionPoint !== undefined) beforeTransitionPoint();

      this.startListeningToValue();
  }

  componentWillUnmout() {
      this.stopListeningToValue();
  }

  // Events
  onScrollLayout = (e: any) => {
      if (Platform.OS === 'web') {
        return;
      }
      const { height } = e.nativeEvent.layout;
      this.scrollHeight = height;
      this.checkIfNeedToEnlarge();
  }

  onContentLayout = (e: any) => {
      if (Platform.OS === 'web') {
          return;
      }
      const { height } = e.nativeEvent.layout;
      this.contentHeight = height;
      this.checkIfNeedToEnlarge();
  }

  // Getters
  shouldEnlarge() {
      return this.state.shouldEnlarge;
  }

  getEnlargedHeight() {
      const { transitionPoint, navigationBarHeight } = this.props;
      return this.scrollHeight + (transitionPoint - navigationBarHeight);
  }

  getValue() {
      return Platform.OS === 'web' ? this.state.value : this.animatedValue._value;
  }

  getNode() {
      if (this.component && this.component.getNode) {
          return this.component.getNode();
      }
      return this.component;
  }

  // Processing
  checkIfNeedToEnlarge() {
      const shouldEnlarge = this.contentHeight < this.getEnlargedHeight();
      if (this.shouldEnlarge() !== shouldEnlarge) {
          this.setState({ shouldEnlarge });
      }
  }

  startListeningToValue() {
      if (Platform.OS === 'web' && this.animatedValue) {
          this.valueListener = this.animatedValue.addListener(({ value }) => {
              this.setState({ value });
          });
      }
  }

  stopListeningToValue() {
      if (Platform.OS === 'web' && this.animatedValue && this.valueListener) {
          this.animatedValue.removeListener(this.valueListener);
      }
  }

  scrollListener(event: ScrollEvent) {
      const { y } = event.nativeEvent.contentOffset;
      const {
          transitionPoint,
          afterTransitionPoint,
          beforeTransitionPoint,
          navigationBarHeight,
      } = this.props;
      const { reachedTransitionPoint } = this.state;

      if(Platform.OS === 'android'){
          this.setState({androidOffset: y});
      }

      if (!reachedTransitionPoint && y >= transitionPoint - navigationBarHeight) {
          this.setState({ reachedTransitionPoint: true });
          this.eventHandler.fire(this.state);
          if (afterTransitionPoint !== undefined) afterTransitionPoint();
      }
      if (reachedTransitionPoint && y < transitionPoint - navigationBarHeight) {
          this.eventHandler.fire(this.state);
          this.setState({ reachedTransitionPoint: false });
          if (beforeTransitionPoint !== undefined) beforeTransitionPoint();
      }
  }

  // Render
  render() {
      const {
          children,
          OverlayComponent,
          Header,
          ScrollComponent,
          StatusBar,
          navigationBarHeight,
          headerHeight,
          transitionPoint,
          style,
          snapHeight,
          containerStyle,
          contentContainerStyle,
      } = this.props;
      const heightStyle = this.shouldEnlarge() ? { minHeight: this.getEnlargedHeight() } : {};
      return (
          <Animated.View style={[{ flex: 1, overflow: 'hidden' }]}>
              <Context.Provider
                  value={{
                      transitionPoint,
                      navigationBarHeight,
                      headerHeight:
              headerHeight === 0 && transitionPoint !== navigationBarHeight
                  ? transitionPoint
                  : headerHeight,
                      animatedValue: this.animatedValue,
                      containerEvents: this.eventHandler,
                  }}
              >
                  <StatusBar />
                  <Animated.View style={[{ flex: 1 }, containerStyle]}>
                      <Header animatedValue={this.animatedValue} />
                      <ScrollComponent
                          onLayout={this.onScrollLayout}
                          nestedScrollEnabled
                          scrollEventThrottle={1}
                          snapToOffsets={[
                              snapHeight,
                              transitionPoint - navigationBarHeight,
                          ]}
                          snapToEnd={false}
                          snapToStart
                          decelerationRate={0.994}
                          onScroll={Animated.event(
                              [{ nativeEvent: { contentOffset: { y: this.animatedValue } } }],
                              {
                                  listener: this.scrollListener.bind(this),
                                  useNativeDriver: Platform.OS !== 'web',
                              },
                          )}
                          ref={(component) => { this.component = component; }}
                          style={[style, { paddingTop: transitionPoint - this.state.androidOffset }]}
                          ListHeaderComponent={() => (
                              <Animated.View
                                  style={{ height: transitionPoint - navigationBarHeight }}
                              />
                          )}
                          ListFooterComponent={() => (
                              <Animated.View style={{ height: navigationBarHeight }} />
                          )}
                          contentContainerStyle={[contentContainerStyle, heightStyle]}
                          {...this.props}
                      >
                          <OverlayComponent />
                          <View onLayout={this.onContentLayout}>
                              {children}
                          </View>
                          <View style={{ height: Platform.OS !== 'web' ? transitionPoint : 0 }} />
                      </ScrollComponent>
                  </Animated.View>
              </Context.Provider>
          </Animated.View>
      );
  }
}

export default Container;
