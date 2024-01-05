import React from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

const BottomTextBox = () => {
  return (
    <View style={styles.ctnBottom}>
      <TextInput
        placeholderTextColor="#fff"
        placeholder="Input your message"
        style={styles.ctnInput}
      />
      <TouchableHighlight style={styles.ctnSend}>
        <Text style={styles.black}>Send</Text>
      </TouchableHighlight>
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

export default BottomTextBox;
