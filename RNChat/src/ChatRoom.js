import React, {Linking, Platform, ActionSheetIOS, Dimensions, View, Text, Navigator, Component} from 'react-native';
import GiftedMessenger from 'react-native-gifted-messenger';
import API from './Api';

// You need to set `window.navigator` to something in order to use the socket.io
// client. You have to do it like this in order to use the debugger because the
// debugger in React Native runs in a webworker and only has a getter method for
// `window.navigator`.
// Remove this after socket.io releases with this patch
// https://github.com/socketio/engine.io-parser/pull/55
if (window.navigator && Object.keys(window.navigator).length == 0) {
  window = Object.assign(window, { navigator: { userAgent: 'ReactNative' }});
}

var io = require('socket.io-client/socket.io');

var STATUS_BAR_HEIGHT = Navigator.NavigationBar.Styles.General.StatusBarHeight;

class ChatRoom extends Component {
  constructor(props) {
    super(props);

    const socketServer = 'http://'+API.serverIP+':4000';
    
    const options = {transports: ['websocket'], forceNew: true};
    this.socket = io(socketServer, options);

    this._messages = [];
    
    this.state = {
      messages: this._messages,
      isLoadingEarlierMessages: false,
      allLoaded: false,
      chatRoomId: null
    };
  }
  
  componentDidMount() {
    this._getChatRoom();

    this.socket.emit('add user', this.props.senderId);

    // Socket events
    this.socket.on('connect', () => {
      console.log('connected to socket.io server');
    });

    this.socket.on('disconnect', () => {
      console.log('disconnected from socket.io server');
    });

    var that = this;
    this.socket.on('new message', function (data) {
      console.log('new message', JSON.stringify(data));
      that.handleReceive({
        text: data.message,
        name: that.props.recipientEmail,
        image: null,
        position: 'left',
        date: new Date(),
        uniqueId: Math.round(Math.random() * 10000),
      });
    });

  }

  componentWillUnmount() {}

  _getChatRoom = async() => {
    try {
      let accessToken = await API.getToken();

      let data = {
        sender_id: this.props.senderId,
        recipient_id: this.props.recipientId
      }

      let response = await API.request('POST', 'http://'+API.serverIP+':3000/v1/chat_rooms', data, accessToken);
      console.log("get chat room", JSON.stringify(response));

      let chatRoomId = response.chat_room_id;
      console.log('chatRoomId', chatRoomId);

      this.setState({chatRoomId: chatRoomId});

      this._getChatMessages();
    } catch(error) {
      console.error("_getChatRoom error: ", error);
    }
  }

  _getChatMessages = async() => {
    try {
      let accessToken = await API.getToken();

      let response = await API.request('GET', 'http://'+API.serverIP+':3000/v1/chat_rooms/'+this.state.chatRoomId, null, accessToken);
      console.log("get chat messages", JSON.stringify(response));

      let chatMessages = response.chat_messages;
      console.log('chat messages', chatMessages);

      let earlierMessages = [];

      for (let msg of chatMessages) {
        earlierMessages.push({
          text: msg.message,
          name: (msg.user_id == this.props.senderId) ? this.props.senderEmail : this.props.recipientEmail,
          image: null,
          position: (msg.user_id == this.props.senderId) ? 'right' : 'left',
          date: new Date(msg.created_at),
          uniqueId: msg.chat_message_id
        });
      }

      this.setMessages(earlierMessages.concat(this._messages));
    } catch(error) {
      console.error("_getChatMessages error: ", error);
    }
  }

  _saveMsgInServer = async(msg) => {
    try {
      let accessToken = await API.getToken();

      let data = {
        message: msg
      }

      let response = await API.request('POST', 'http://'+API.serverIP+':3000/v1/chat_rooms/'+this.state.chatRoomId+'/chat_messages', data, accessToken);
      console.log("save msg in server", JSON.stringify(response));
   } catch (error) {
      console.error("_saveMsgInServer error: ", error);
   }
 } 

  setMessages(messages) {
    this._messages = messages;
    
    // append the message
    this.setState({
      messages: messages,
    });
  }

  handleSend(message = {}) {
    message.uniqueId = Math.round(Math.random() * 10000); // simulating server-side unique id generation
    this.setMessages(this._messages.concat(message));

    this.socket.emit('new message', {
      message: message.text,
      senderId: this.props.senderId,
      recipientId: this.props.recipientId
    });

    // Send message.text to server
    this._saveMsgInServer(message.text);
  }

  onLoadEarlierMessages() {

    // display a loader until you retrieve the messages from your server
    this.setState({
      isLoadingEarlierMessages: true,
    });
    
    // Your logic here
    // Eg: Retrieve old messages from your server

    // IMPORTANT
    // Oldest messages have to be at the begining of the array
    
    var earlierMessages = [
      {
        text: 'JavaScript and React. https://github.com/facebook/react-native', 
        name: 'React-Bot', 
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, 
        position: 'left', 
        date: new Date(2016, 0, 1, 20, 0),
        uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
      }, {
        text: 'This is a touchable phone number 0606060606 parsed by taskrabbit/react-native-parsed-text', 
        name: 'Awesome Developer', 
        image: null, 
        position: 'right', 
        date: new Date(2016, 0, 2, 12, 0),
        uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
      },
    ];

    setTimeout(() => {
      this.setMessages(earlierMessages.concat(this._messages)); // prepend the earlier messages to your list
      this.setState({
        isLoadingEarlierMessages: false, // hide the loader
        allLoaded: true, // hide the `Load earlier messages` button
      });
    }, 1000); // simulating network
    
  }

  handleReceive(message = {}) {
    // make sure that your message contains :
    // text, name, image, position: 'left', date, uniqueId
    this.setMessages(this._messages.concat(message));
  }

  render() {
    return (
      <View style={{flex: 1, paddingTop: Navigator.NavigationBar.Styles.General.TotalNavHeight}}>
        <GiftedMessenger
          ref={(c) => this._GiftedMessenger = c}

          styles={{
            bubbleRight: {
              marginLeft: 70,
              backgroundColor: '#007aff',
            },
          }}

          autoFocus={false}
          messages={this.state.messages}
          handleSend={this.handleSend.bind(this)}
          maxHeight={Dimensions.get('window').height - Navigator.NavigationBar.Styles.General.NavBarHeight - STATUS_BAR_HEIGHT}

          loadEarlierMessagesButton={!this.state.allLoaded}
          onLoadEarlierMessages={this.onLoadEarlierMessages.bind(this)}

          senderName='Awesome Developer'
          senderImage={null}
          displayNames={true}

          isLoadingEarlierMessages={this.state.isLoadingEarlierMessages}
        />
      </View>
    );
  }
}

module.exports = ChatRoom;
