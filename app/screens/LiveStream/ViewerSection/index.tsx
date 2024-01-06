import React, {useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {RtcSurfaceView} from 'react-native-agora';
import BottomTextBox from './MessageTextBox';
import MessageLive from './MessageLive';
const windowHeight = Dimensions.get('window').height;

interface IProps {
  isJoined: boolean;
  isHost: boolean;
  remoteUid?: number;
}

const ViewerSection = ({isJoined, isHost, remoteUid}: IProps) => {
  remoteUid = 2;
  const [isOpenProdcut, setIsOpenProdcut] = useState(false);

  return (
    <View style={styles.ctnMain}>
      {isJoined && !isHost && remoteUid !== 0 ? (
        <React.Fragment key={remoteUid}>
          <RtcSurfaceView canvas={{uid: remoteUid}} style={styles.videoView} />
          {isOpenProdcut ? (
            <View style={styles.ctnProductFull}>
              <View style={styles.ctnImageFull} />
              <View style={styles.ctnContent}>
                <Text style={styles.txtStyle}>Product Name</Text>
                <Text style={styles.txtStyle}>Product Price</Text>
                <Text style={styles.txtStyle}>Bought count</Text>
              </View>
              <TouchableOpacity
                style={{position: 'absolute', right: 10, top: 0}}
                onPress={() => setIsOpenProdcut((old: boolean) => !old)}
                hitSlop={12}>
                <Text style={{fontSize: 24}}>x</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.ctnProductMini}
              onPress={() => setIsOpenProdcut((old: boolean) => !old)}>
              <View style={styles.ctnImageFull} />
            </TouchableOpacity>
          )}
          <MessageLive />
          <BottomTextBox />
        </React.Fragment>
      ) : (
        <Text>
          {isJoined && !isHost ? 'Waiting for a remote user to join' : ''}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ctnMain: {
    width: '100%',
    flex: 1,
    height: windowHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoView: {
    width: '100%',
    height: windowHeight,
    alignItems: 'center',
  },
  ctnProductFull: {
    width: '90%',
    backgroundColor: 'white',
    position: 'absolute',
    top: 64,
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    borderRadius: 8,
  },
  ctnProductMini: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 84,
    paddingVertical: 4,
    paddingHorizontal: 4,
    flexDirection: 'row',
    borderRadius: 8,
    alignSelf: 'flex-start',
    left: 24,
  },
  ctnImageFull: {
    height: 64,
    width: 64,
    borderRadius: 4,
    backgroundColor: 'gray',
  },
  ctnContent: {marginLeft: 8},
  txtStyle: {color: '#000'},
});

export default ViewerSection;
