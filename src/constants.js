// @flow
import { Platform, StatusBar, Dimensions } from 'react-native';

StatusBar.setTranslucent(true);

function isIphoneX() {
    const { width, height } = Dimensions.get('window');
    return (
        Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height === 812 || width === 812 || (height === 896 || width === 896))
    );
}

export const STATUS_BAR_HEIGHT: number =
  Platform.OS === 'ios' ? (isIphoneX() ? 44 : 20) : 0;
export const NAVIGATION_BAR_HEIGHT: number = (Platform.OS === 'ios' ? 44 : 56) + STATUS_BAR_HEIGHT;

export default {
    STATUS_BAR_HEIGHT,
    NAVIGATION_BAR_HEIGHT,
};
