import React from 'react';

import {StyleSheet, Text, View} from 'react-native';
import {RtcSurfaceView} from 'react-native-agora';

interface IProps {
  isJoined: boolean;
  isHost: boolean;
  uid?: number;
}

const HostSection = ({isJoined, isHost, uid}: IProps) => {
  return (
    <View>
      {isJoined && isHost ? (
        <React.Fragment key={0}>
          <RtcSurfaceView canvas={{uid: 0}} style={styles.videoView} />
          <Text>Local user uid: {uid}</Text>
        </React.Fragment>
      ) : (
        <Text>{isHost ? 'Join a channel' : ''}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  videoView: {width: '90%', height: 200},
  header: {},
});

export default HostSection;
