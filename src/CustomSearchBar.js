import React, {Component} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

class CustomSearchBar extends Component {
  render() {
    const {
      autoCapitalize = 'none',
      reference,
      placeholder,
      onChangeText,
    } = this.props;
    return (
      <View style={styles.textInputContainer}>
        <TextInput
          autoCapitalize={autoCapitalize}
          style={styles.textInput}
          ref={r => reference(r)}
          placeholder={placeholder}
          onChangeText={text => onChangeText(text)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInputContainer: {
    //flex: 2,
    borderRadius: 8,
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    height: 20,
    borderColor: 'black',
    borderWidth: 0.5,
    height: 40,
    margin: 10
  },
  textInput: {},
});
export default CustomSearchBar;
