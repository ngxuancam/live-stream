import React from 'react';

import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

const LIST_OF_USER = [
  {
    userId: '1',
    msgId: '1',
    avatarUrl:
      'https://gravatar.com/avatar/324d1bdf6956bb5ce9544b745981d298?s=400&d=robohash&r=x',
    name: 'CamNX1',
    message: 'I love u <3 1',
  },
  {
    userId: '1',
    msgId: '2',
    avatarUrl:
      'https://gravatar.com/avatar/324d1bdf6956bb5ce9544b745981d298?s=400&d=robohash&r=x',
    name: 'CamNX1',
    message: 'I love u <3 2',
  },
  {
    userId: '1',
    msgId: '3',
    avatarUrl:
      'https://gravatar.com/avatar/324d1bdf6956bb5ce9544b745981d298?s=400&d=robohash&r=x',
    name: 'CamNX1',
    message: 'I love u <3 33333333333',
  },
];

const MessageLive = () => {
  return (
    <View style={styles.ctnBottom}>
      <ScrollView horizontal={true} style={{width: '100%'}}>
        <FlatList
          style={{marginBottom: 80, width: '100%'}}
          contentContainerStyle={{width: '100%'}}
          keyExtractor={props => props.msgId}
          data={LIST_OF_USER.reverse()}
          renderItem={props => (
            <View
              style={{
                flexDirection: 'row',
                padding: 10,
                marginVertical: 10,
                marginLeft: 24,
                backgroundColor: '#ffffff50',
                borderRadius: 50,
              }}>
              <View
                style={{
                  height: 38,
                  width: 38,
                  backgroundColor: 'red',
                  borderRadius: 17,
                }}
              />
              <View style={{marginLeft: 8, width: 200}}>
                <Text style={styles.black}>{props.item.name}</Text>
                <Text style={styles.black}>{props.item.message}</Text>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ctnBottom: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
  },
  ctnInput: {
    textAlign: 'left',
    backgroundColor: '#33333350',
    color: '#fff',
    textDecorationColor: '#fff',
    width: '70%',
    height: 48,
    marginHorizontal: 24,
    marginVertical: 12,
    paddingLeft: 16,
    borderRadius: 21,
  },
  black: {color: '#000'},
  ctnSend: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    position: 'absolute',
    right: 20,
    top: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MessageLive;
