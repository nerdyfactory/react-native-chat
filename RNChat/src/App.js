import React, {Component, Navigator, BackAndroid} from 'react-native';
import {Scene, Reducer, Router, Modal, Actions} from 'react-native-router-flux';

import Login from './Login';
import Users from './Users';
import ChatRoom from './ChatRoom';

BackAndroid.addEventListener('hardwareBackPress', () => {
  try {
    Actions.pop();
    return true;
  } catch (err) {
    //console.log("Cannot pop. Exiting the app...");
    return false;
  }
});

const reducerCreate = params=>{
  const defaultReducer = Reducer(params);
  return (state, action)=>{
    //console.log("ACTION:", action);
    return defaultReducer(state, action);
  }
};

class App extends Component {
  render() {
    return (
      <Router createReducer={reducerCreate}>
        <Scene key="modal" component={Modal}>
          <Scene key="root">
            <Scene key="login" component={Login} title="Login" />
            <Scene key="users" component={Users} title="Users" />
            <Scene key="chatroom" component={ChatRoom} title="Chat Room" />
          </Scene>
        </Scene>
      </Router>
    )
  }
}

export default App;
