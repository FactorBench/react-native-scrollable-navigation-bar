// @flow
import * as React from 'react';
import { Animated } from 'react-native';
import Sticky from './api/Sticky';
import NavigationBarContainer from './api/NavigationBarContainer';
import Header from './api/Header';
import NavigationBar from './components/NavigationBar';
import Container from './api/Container';
import StatusBarComponent from './components/StatusBarComponent';
import Snap from './api/Snap';
import type {
    StatusBarComponentProps,
    ContainerProps,
    ContainerDefaultProps,
} from './types';
import { NAVIGATION_BAR_HEIGHT } from './constants';

const ImageStatusBar = () => (
    <StatusBarComponent barStyle="light-content" backgroundColor="transparent" />
);

export type NavigationBarProps = {
  title?: string,
  titleStyle?: mixed,
  headerBackgroundColor?: string,
  borderColor?: string,
  headerLeft?: ?(React.Element<React.ComponentType<{}>>),
  headerRight?: ?(React.Element<React.ComponentType<{}>>),
  transitionPoint: number
};

export type ScrollableNavigationBarDefaultProps = {|
  StatusBar: React.ComponentType<StatusBarComponentProps>,
  ContainerComponent: React.AbstractComponent<
    React.Config<ContainerProps, ContainerDefaultProps>,
    Container
  >,
  snapHeight: number,
  transitionPoint: number,
|};

export type ScrollableNavigationBarProps = {
  ...ScrollableNavigationBarDefaultProps,
  title?: string,
  titleStyle?: mixed,
  headerBackgroundColor?: string,
  borderColor?: string,
  headerTitle?: string,
  headertitleStyle?: mixed,
  children?: React.Node,
  collapsible?: boolean,
  StickyComponent?: React.ComponentType<any>,
  stickyCollapsible?: boolean,
  containerRef?: Function,
  stayCollapsed?: boolean,
  SnapComponent?: React.ComponentType<any>,
  ImageComponent?: React.ComponentType<any>,
  parallax?: number,
  fadeOut?: boolean,
  afterTransitionPoint?: () => void,
  beforeTransitionPoint?: () => void,
  ScrollComponent?: React.ComponentType<Animated.ScrollView>,
  animatedValue?: Animated.Value,
  HeaderForegroundComponent?: mixed => mixed,
  HeaderScrolledComponent?: mixed => mixed,
  HeaderUnscrolledComponent?: mixed => mixed
};

class ScrollableNavigationBar extends React.Component<ScrollableNavigationBarProps> {
  container: ?React.ElementRef<typeof Container>;

  static defaultProps = {
      StatusBar: () => (
          <StatusBarComponent
              barStyle="dark-content"
              backgroundColor="transparent"
          />
      ),
      ContainerComponent: Container,
      snapHeight: 0,
      transitionPoint: NAVIGATION_BAR_HEIGHT,
  };

  getContainerNode() {
      return this.container;
  }

  renderNavigationBarContainer(props) {
      const { collapsible, stayCollapsed } = this.props;

      return (
          <NavigationBarContainer
              collapsible={collapsible}
              stayCollapsed={stayCollapsed}
              {...props}
          >
              {this.renderNavigationBar(this.props)}
          </NavigationBarContainer>
      );
  }

  renderNavigationBar({
      title,
      titleStyle,
      headerBackgroundColor,
      borderColor,
      headerLeft,
      headerRight,
      transitionPoint,
  }: NavigationBarProps) {
      return (
          <NavigationBar
              title={title}
              titleStyle={titleStyle}
              backgroundColor={headerBackgroundColor}
              borderColor={
                  transitionPoint !==
          ScrollableNavigationBar.defaultProps.transitionPoint
                      ? undefined
                      : borderColor
              }
              headerLeft={headerLeft}
              headerRight={headerRight}
          />
      );
  }

  renderHeader(props) {
      const {
          title,
          titleStyle,
          headerTitle,
          headertitleStyle,
          headerBackgroundColor,
          headerLeft,
          headerRight,
          borderColor,
          collapsible,
          stayCollapsed,
          snapHeight,
          SnapComponent,
          ImageComponent,
          parallax,
          fadeOut,
          HeaderForegroundComponent,
          HeaderScrolledComponent,
          HeaderUnscrolledComponent,
      } = this.props;
      const imageStyle = ImageComponent !== undefined ? { color: 'white' } : {};
      return (
          <React.Fragment>
              <Header
                  stayCollapsed={stayCollapsed}
                  collapsible={collapsible}
                  title={headerTitle || title}
                  titleStyle={headertitleStyle || titleStyle || imageStyle}
                  backgroundColor={headerBackgroundColor}
                  borderColor={SnapComponent ? borderColor : undefined}
                  snapHeight={snapHeight}
                  parallax={parallax}
                  fadeOut={fadeOut}
                  SnapComponent={SnapComponent}
                  BackgroundComponent={ImageComponent}
                  ForegroundComponent={HeaderForegroundComponent}
                  UnscrolledNavigationBar={
                      HeaderUnscrolledComponent !== undefined
                          ? HeaderUnscrolledComponent
                          : () =>
                              this.renderNavigationBar({
                                  ...this.props,
                                  title: undefined,
                                  borderColor: undefined,
                                  headerLeft,
                                  headerRight,
                                  headerBackgroundColor:
                      ImageComponent !== undefined
                          ? 'transparent'
                          : this.props.headerBackgroundColor,
                              })
                  }
                  ScrolledNavigationBar={
                      HeaderScrolledComponent !== undefined
                          ? HeaderScrolledComponent
                          : () => this.renderNavigationBar(this.props)
                  }
                  {...props}
              />
          </React.Fragment>
      );
  }

  render() {
      const {
          StatusBar,
          children,
          StickyComponent,
          stickyCollapsible,
          ContainerComponent,
          containerRef,
          stayCollapsed,
          transitionPoint,
          snapHeight,
          beforeTransitionPoint,
          afterTransitionPoint,
          ImageComponent,
          ScrollComponent,
          animatedValue,
      } = this.props;
      return (
          <ContainerComponent
              beforeTransitionPoint={beforeTransitionPoint}
              afterTransitionPoint={afterTransitionPoint}
              transitionPoint={transitionPoint}
              headerHeight={transitionPoint - snapHeight}
              snapHeight={snapHeight}
              animatedValue={animatedValue}
              ScrollComponent={ScrollComponent}
              ref={containerRef}
              StatusBar={ImageComponent !== undefined ? ImageStatusBar : StatusBar}
              Header={props => (
                  <React.Fragment>
                      {transitionPoint ===
            ScrollableNavigationBar.defaultProps.transitionPoint
                          ? this.renderNavigationBarContainer(props)
                          : this.renderHeader(props)}
                      <Sticky
                          collapsible={stickyCollapsible}
                          stayCollapsed={stayCollapsed}
                      >
                          {StickyComponent}
                      </Sticky>
                  </React.Fragment>
              )}
              {...this.props}
          >
              {children}
          </ContainerComponent>
      );
  }
}

export default React.forwardRef<
  React.Config<
    ScrollableNavigationBarProps,
    ScrollableNavigationBarDefaultProps
  >,
  ScrollableNavigationBar
>((props, ref: Function) => (
    <ScrollableNavigationBar containerRef={ref} {...props} />
));
