import React from 'react';

import {StyleSheet, View} from 'react-native';
import {RtcSurfaceView} from 'react-native-agora';
import {Dimensions} from 'react-native';

interface IProps {
  uid?: number;
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HostSection = ({uid}: IProps) => {
  return (
    <RtcSurfaceView
      id={'LIVE_VIEW_OF' + uid}
      canvas={{uid: uid}}
      style={styles.videoView}
    />
  );
};

const styles = StyleSheet.create({
  videoView: {flex: 1, width: windowWidth, height: windowHeight},
});

export default HostSection;
