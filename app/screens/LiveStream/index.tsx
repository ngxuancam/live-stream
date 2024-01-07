import React, {useRef, useState, useEffect} from 'react';

import {
  SafeAreaView,
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
import axios from 'axios';

const appId = 'f83e2cfcf12f4103a421ffc74a1bba46';
const channelName = 'live1';
const token =
  '007eJxTYBBYc4aZl2Nu+4PLHqvvfr//uuu71a0asaOxX9JaZK32TTBWYEizME41Sk5LTjM0SjMxNDBONDEyTEtLNjdJNExKSjQxi34/K7UhkJFh5vpjzIwMEAjiszLkZJalGjIwAAASUiJu';
const uid = 0;

const l = (a: any) => {
  // console.log(a);
};

const App = () => {
  const agoraEngineRef = useRef<IRtcEngine>(); // Agora engine instance
  const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
  const [isHost, setIsHost] = useState(false); // Client role
  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
  const [viewCount, setViewCount] = useState(0); // Message to the user
  const [uidHost, setUidHost] = useState<number>(0);

  function showMessage(msg: string) {
    if (msg != null && msg.length > 0) {
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravityAndOffset(
          msg,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      }
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

  useEffect(() => {
    let timerFetch: string | number | NodeJS.Timeout | null | undefined = null;
    if (isJoined) {
      timerFetch = setInterval(() => {
        const apiLink =
          'https://api.agora.io/dev/v1/channel/user/' +
          appId +
          '/' +
          channelName;

        axios
          .get(apiLink, {
            headers: {
              Authorization:
                'Basic YTEzNzllYjE1MWZiNGM4YjgxMDU0NzQyMmYzMDgwOWE6YzYzZWJhOTliZDU2NDMxOWFkOGEwMDExY2M3MTk3Y2E=',
              'Content-Type': 'application/json',
            },
          })
          .then(resp => {
            setViewCount(resp.data?.data?.audience_total || 0);
            setUidHost(resp.data?.data?.broadcasters || 0);
          });

        //
      }, 1000);
    }
    return () => {
      if (timerFetch != null) {
        clearInterval(timerFetch);
      }
    };
  }, [isJoined]);

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
      l(
        agoraEngineRef.current?.setChannelProfile(
          ChannelProfileType.ChannelProfileLiveBroadcasting,
        ),
      );
      if (isHost) {
        l(agoraEngineRef.current?.startPreview());
        l(
          agoraEngineRef.current?.joinChannel(token, channelName, uid, {
            clientRoleType: ClientRoleType.ClientRoleBroadcaster,
          }),
        );
      } else {
        l(
          agoraEngineRef.current?.joinChannel(token, channelName, uid, {
            clientRoleType: ClientRoleType.ClientRoleAudience,
          }),
        );
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
          <View style={styles.scroll}>
            {isHost ? (
              <HostSection uid={uid} />
            ) : (
              <ViewerSection
                isJoined={isJoined}
                isHost={isHost}
                remoteUid={remoteUid}
              />
            )}
          </View>
          <View style={styles.header}>
            <Text style={styles.btnBack} onPress={leave}>
              Back
            </Text>
            <Text style={styles.btnUserName} numberOfLines={1}>
              {uidHost}
            </Text>
            <Text style={styles.btnViewer}>{viewCount}</Text>
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
  scroll: {
    flex: 1,
    backgroundColor: '#ddeeff',
    width: '100%',
    alignItems: 'center',
  },
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
    justifyContent: 'space-between',
    flexDirection: 'row',
    overflow: 'visible',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 100,
    padding: 16,
  },
  btnBack: {
    fontWeight: 'bold',
    color: 'black',
    zIndex: 10,
    backgroundColor: '#fffffff0',
    textAlign: 'center',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  btnUserName: {
    fontWeight: 'bold',
    color: 'black',
    zIndex: 10,
    backgroundColor: '#fffffff0',
    textAlign: 'center',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: 200,
    minWidth: 150,
  },
  btnViewer: {
    fontWeight: 'bold',
    color: 'black',
    zIndex: 10,
    backgroundColor: '#fffffff0',
    textAlign: 'center',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: 200,
  },
});

export default App;
