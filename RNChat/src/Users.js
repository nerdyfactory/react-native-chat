import React, {Component, View, Text, TextInput, StyleSheet, ListView, TouchableOpacity, Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import API from './Api';

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
  }

  componentDidMount() {
    this._getUsers();
  }

  _getUsers = async() => {
    try {
      let accessToken = await API.getToken();
      let response = await API.request('GET', 'http://'+API.serverIP+':3000/v1/users', null, accessToken); 
      console.log("get all users", JSON.stringify(response));
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(response)
      });
    } catch (error) {
      console.error("_getUsers error: ", error);
    }
  }


  _openChatRoom(user) {
    Actions.chatroom({
      title: user.email,
      senderId: this.props.id,
      senderEmail: this.props.email,
      recipientId: user.id,
      recipientEmail: user.email
    });
  }

  renderUser(user) {
    return (
      <TouchableOpacity onPress={() => this._openChatRoom(user)}  underlayColor='#dddddd'>
        <View style={styles.rowStyle}>
           <Text style={styles.rowText}>{user.email}</Text>
        </View>
      </TouchableOpacity>
     );
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView 
          dataSource={this.state.dataSource}
          renderRow={this.renderUser.bind(this)}
          style={styles.listview}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 64 : 44,
  },
  rowStyle: {
    paddingVertical: 20,
    paddingLeft: 16,
    borderTopColor: 'white',
    borderLeftColor: 'white',
    borderRightColor: 'white',
    borderBottomColor: '#E0E0E0',
    borderWidth: 1
  },
  rowText: {
    color: '#212121',
    fontSize: 16
  },
});

module.exports = Users;
