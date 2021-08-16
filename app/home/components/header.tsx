import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {connect} from 'react-redux';
import {withTheme} from 'react-native-paper';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'

class Header extends Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    const {colors} = this.props.theme

    return (
      <View style={{}}>
        <View style={{width: "70%"}}>
          <View style={{flexDirection: "row", width: "auto"}}>
            <FontAwesomeIcon style={{ aspectRatio: 1}} icon="coffee" size={20}/>
            <Text style={{marginLeft: 10, color: colors.placeholder, fontSize: 16, lineHeight: 19,}}>
              Hey Neil!
            </Text>
          </View>
          <Text style={{paddingTop: 8, color: colors.text, fontSize: 30, fontWeight: 'bold',}}>What does your mind need?</Text>
        </View>
      </View>
    );
  }
}

export default withTheme(Header)
