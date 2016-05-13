import React, {Component, View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import { Actions } from 'react-native-router-flux';
import API from './Api';

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
    }
  }

  componentDidMount() {}

  _handleSignIn = async () => {
    let { email, password } = this.state;

    let data = {
      email: email,
      password: password
    }

    try {
      let response = await API.request("POST", "http://"+API.serverIP+":3000/v1/login", data);
      console.log("login response", JSON.stringify(response));
      API.setToken('accessToken', response.access_token);
      Actions.users({
        id: response.user_id,
        email: response.email
      });
    } catch (err) {
      console.error('_handleSignIn error', err);
    }

    // Clear the input values on submit
    this.refs.email.setNativeProps({text: ''});
    this.refs.password.setNativeProps({text: ''});
  }

  _handleSignUp = async () => {
    let { email, password } = this.state;

    let data = {
      email: email,
      password: password
    }

    try {
      let response = await API.request('POST', 'http://'+API.serverIP+':3000/v1/users', data);
      console.log("signup response", JSON.stringify(response));
      API.setToken('accessToken', response.access_token);
      Actions.users({
        id: response.user_id,
        email: response.email
      });
    } catch (err) {
      console.error('_handleSignUp error', err);
    }

    // Clear the input values on submit
    this.refs.email.setNativeProps({text: ''});
    this.refs.password.setNativeProps({text: ''});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <View>
            <TextInput
              style={styles.input}
              ref="email"
              onChangeText={email => this.setState({email})}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Email"
            />
            <TextInput
              style={styles.input}
              ref="password"
              onChangeText={password => this.setState({password})}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Password"
              secureTextEntry={true}
            />

            <View style={styles.flowRight}>
              <TouchableOpacity style={styles.button} onPress={this._handleSignIn}>
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={this._handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  center: {
    alignItems: 'center'
  },
  input: {
    //flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 8,
    height: 40,
    //width: 350,
    width: 300,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'stretch',
    justifyContent: 'center',
    margin: 10,
  },
  buttonText: {
    fontSize: 18,
    //color: 'white',
    alignSelf: 'center'
  },
});

module.exports = Login;
