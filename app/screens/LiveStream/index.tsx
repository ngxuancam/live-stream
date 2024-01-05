import React, {useRef, useState, useEffect} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableHighlight,
  ToastAndroid,
} from 'react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
} from 'react-native-agora';
import ViewerSection from './ViewerSection';
import HostSection from './HostSection';

const appId = 'ac644ced814c4c328bc62d6076ddce35';
const channelName = 'Livestream Demo';
const token =
  '007eJxTYJgsKak+u83Cg0XpwwLBd6u1nnr+OSTRs7TWLPB/qMFuzx8KDInJZiYmyakpFoYmySbJxkYWSclmRilmBuZmKSnJqcam+p+mpDYEMjLI3MxkYIRCEJ+fwSezLLW4pCg1MVfBJTU3n4EBAHvuIx8=';
const uid = 0;

const App = () => {
  const agoraEngineRef = useRef<IRtcEngine>(); // Agora engine instance
  const [isJoined, setIsJoined] = useState(true); // Indicates if the local user has joined the channel
  const [isHost, setIsHost] = useState(false); // Client role
  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
  // const [message, setMessage] = useState(''); // Message to the user

  function showMessage(msg: string) {
    if (msg != null && msg.length > 0) {
      ToastAndroid.showWithGravityAndOffset(
        msg,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
  }
  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
  };
  useEffect(() => {
    // Initialize Agora engine when the app starts
    setupVideoSDKEngine();
  });

  const setupVideoSDKEngine = async () => {
    try {
      // use the helper function to get permissions
      if (Platform.OS === 'android') {
        await getPermission();
      }
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          showMessage('Successfully joined the channel ' + channelName);
          setIsJoined(true);
        },
        onUserJoined: (_connection, Uid) => {
          showMessage('Remote user joined with uid ' + Uid);
          setRemoteUid(Uid);
        },
        onUserOffline: (_connection, Uid) => {
          showMessage('Remote user left the channel. uid: ' + Uid);
          setRemoteUid(0);
        },
      });
      agoraEngine.initialize({
        appId: appId,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });
      agoraEngine.enableVideo();
    } catch (e) {
      console.log(e);
    }
  };
  const join = async () => {
    if (isJoined) {
      return;
    }
    try {
      agoraEngineRef.current?.setChannelProfile(
        ChannelProfileType.ChannelProfileLiveBroadcasting,
      );
      if (isHost) {
        agoraEngineRef.current?.startPreview();
        agoraEngineRef.current?.joinChannel(token, channelName, uid, {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        });
      } else {
        agoraEngineRef.current?.joinChannel(token, channelName, uid, {
          clientRoleType: ClientRoleType.ClientRoleAudience,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  const leave = () => {
    try {
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      showMessage('You left the channel');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      {!isJoined ? (
        <View style={styles.flCenter}>
          <View>
            <Text style={styles.head}>You are ...</Text>
          </View>
          <View style={styles.btnContainer}>
            <Text style={!isHost && styles.bold}>Audience</Text>
            <Switch
              onValueChange={switchValue => {
                setIsHost(switchValue);
                if (isJoined) {
                  leave();
                }
              }}
              value={isHost}
            />
            <Text style={isHost && styles.bold}>Host</Text>
          </View>
          <View style={styles.btnContainer}>
            <TouchableHighlight onPress={join} style={styles.button}>
              <Text style={styles.txtButton}>Join</Text>
            </TouchableHighlight>
            <Text />
          </View>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContainer}>
            {isHost ? (
              <HostSection isJoined={isJoined} isHost={isHost} uid={uid} />
            ) : (
              <ViewerSection
                isJoined={isJoined}
                isHost={isHost}
                remoteUid={remoteUid}
              />
            )}
          </ScrollView>
          <View style={styles.header}>
            <Text style={styles.btnBack} onPress={leave}>
              Back
            </Text>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 25,
    paddingVertical: 4,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#0055cc',
    margin: 5,
  },
  txtButton: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  main: {flex: 1, width: '100%'},
  scroll: {flex: 1, backgroundColor: '#ddeeff', width: '100%'},
  scrollContainer: {alignItems: 'center'},
  videoView: {width: '90%', height: 200},
  btnContainer: {flexDirection: 'row', justifyContent: 'center', marginTop: 10},
  head: {fontSize: 20},
  info: {backgroundColor: '#ffffe0', paddingHorizontal: 8, color: '#0000ff'},
  flCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bold: {fontWeight: 'bold'},
  header: {
    display: 'flex',
    position: 'absolute',
    justifyContent: 'center',
    overflow: 'visible',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 100,
  },
  btnBack: {
    marginTop: 24,
    marginLeft: 24,
    fontWeight: 'bold',
    color: 'black',
    zIndex: 10,
    backgroundColor: 'white',
    textAlign: 'center',
    borderRadius: 50,
    paddingHorizontal: 8,
    maxWidth: 50,
  },
});

export default App;
