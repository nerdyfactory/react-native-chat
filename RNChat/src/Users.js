import React, {Component, View, Text, TextInput, StyleSheet, ListView, TouchableHighlight} from 'react-native';
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
      <TouchableHighlight onPress={() => this._openChatRoom(user)}  underlayColor='#dddddd'>
        <View>
          <View style={styles.container}>
            <View style={styles.rightContainer}>
              <Text style={styles.id}>{user.id}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
     );
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderUser.bind(this)}
        style={styles.listView}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    //padding: 10,
  },
  rightContainer: {
    flex: 1
  },
  id: {
    fontSize: 20,
    marginBottom: 8
  },
  email: {
    color: '#656565'
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  listView: {
    backgroundColor: '#F5FCFF',
    marginTop: 64
  },
});

module.exports = Users;
