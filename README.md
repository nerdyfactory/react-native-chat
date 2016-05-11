# react-native-chat
A demo chat app built with
- React-Native (iOS and Android)
- Rails (API server)
- socket.io (low-latency bi-directional communication)
- PostgreSQL

##Postgres setup
```
postgres -D /usr/local/var/postgres
psql postgres
create role rails_api with createdb login password 'password1';
\q
```
##Rails setup
```
cd rails-api-server
bundle install
rake db:create
rake db:migrate
rails s
```
##socket.io setup
```
cd socket-io-server
npm install
node index
```
##React-Native setup
```
cd RNChat
npm install
npm start
react-native run-android
OR
react-native run-ios
```

##APIs

####SignUp user
```bash
curl -X POST -H "Content-Type: application/json" http://localhost:3000/v1/users -d '{"user": {"email": "user1@example.com", "password": "123456"}}'

>> {"email":"user1@example.com","user_id":1,"access_token":"xfB32Lgoi_7A7CEkcMYh"}
```

####SignIn user
```bash
curl -X POST -H "Content-Type: application/json" http://localhost:3000/v1/login -d '{"email": "user1@example.com", "password": "123456"}'

>> {"email":"user1@example.com","user_id":1,"access_token":"xfB32Lgoi_7A7CEkcMYh"}
```

####SignOut user
```bash
TBD
```

####Show all users (except requesting user)
```bash
curl -X GET -H "Content-type: application/json" -H "Authorization: xfB32Lgoi_7A7CEkcMYh" http://localhost:3000/v1/users

>> [{"id":5,"email":"user5@example.com"},{"id":4,"email":"user4@example.com"},{"id":3,"email":"user3@example.com"},{"id":2,"email":"user2@example.com"}]
```

####Show an user
```bash
curl -X GET -H "Content-type: application/json" -H "Authorization: xfB32Lgoi_7A7CEkcMYh" http://localhost:3000/v1/users/1

>>  {"email":"user1@example.com"}
```

####Create a chat room
```bash
curl -X POST -H "Content-type: application/json" -H "Authorization: xfB32Lgoi_7A7CEkcMYh" http://localhost:3000/v1/chat_rooms -d '{"sender_id": 1, "recipient_id": 2}'
>> {"chat_room_id":1,"sender_id":1,"recipient_id":2,"chat_messages":[]}

curl -X POST -H "Content-type: application/json" -H "Authorization: xfB32Lgoi_7A7CEkcMYh" http://localhost:3000/v1/chat_rooms -d '{"sender_id": 1, "recipient_id": 2}'
>> {"chat_room_id":1,"sender_id":1,"recipient_id":2,"chat_messages":[{"id":1,"message":"whats up","chat_room_id":1,"user_id":1,"created_at":"2016-05-11T13:22:09.820Z"}]}
```

####Show a chat room
```bash
curl -X GET -H "Content-type: application/json" -H "Authorization: xfB32Lgoi_7A7CEkcMYh" http://localhost:3000/v1/chat_rooms/1

>> {"chat_room_id":1,"sender_id":1,"recipient_id":2,"chat_messages":[{"id":1,"message":"whats up","chat_room_id":1,"user_id":1,"created_at":"2016-05-11T13:22:09.820Z"}]}
```

####Create a chat message
```bash
curl -X POST -H "Content-type: application/json" -H "Authorization: xfB32Lgoi_7A7CEkcMYh" http://localhost:3000/v1/chat_rooms/1/chat_messages -d '{"message": "whats up"}'

>> {"chat_message_id":1,"user_id":1,"created_at":"2016-05-11T13:22:09.820Z","message":"whats up","chat_room_id":1}
```
