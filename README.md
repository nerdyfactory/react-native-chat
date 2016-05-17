# react-native-chat
A demo chat app built with
- React-Native (iOS and Android)
- Rails (API server)
- socket.io (low-latency bi-directional communication)
- PostgreSQL (save user and chat info)
- sidekiq and redis (background processing of chat messages)

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
rake db:seed
rails s
```
##socket.io setup
```
cd socket-io-server
npm install
node index
```
##redis and sidekiq
```
redis-server --unixsocket /tmp/redis.sock
bundle exec sidekiq
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
curl -X POST -H "Content-Type: application/json" http://localhost:3000/v1/users -d '{"user": {"email": "user1@example.com", "password": "password"}}'

>> {"email":"user1@example.com","user_id":1,"access_token":"xfB32Lgoi_7A7CEkcMYh"}
```

####SignIn user
```bash
curl -X POST -H "Content-Type: application/json" http://localhost:3000/v1/login -d '{"email": "user1@example.com", "password": "password"}'

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
#if chat room already exists then just return the chat room info
curl -X POST -H "Content-type: application/json" -H "Authorization: xfB32Lgoi_7A7CEkcMYh" http://localhost:3000/v1/chat_rooms -d '{"sender_id": 1, "recipient_id": 2}'

>> {"chat_room_id":1,"sender_id":1,"recipient_id":2}
```

####Show messages in a chat room
```bash
# paginated
curl -X GET -H "Content-type: application/json" -H "Authorization: xfB32Lgoi_7A7CEkcMYh" http://localhost:3000/v1/chat_rooms/1/chat_messages/page/1

>> [{"chat_message_id":50,"user_id":2,"created_at":"2016-05-16T11:14:22.130Z","message":"werwerwre"},{"chat_message_id":49,"user_id":1,"created_at":"2016-05-16T11:14:17.865Z","message":"Asdfas"},{"chat_message_id":48,"user_id":2,"created_at":"2016-05-16T08:55:40.489Z","message":"rssdsds"},{"chat_message_id":47,"user_id":2,"created_at":"2016-05-16T08:41:27.880Z","message":"what up?"},{"chat_message_id":46,"user_id":1,"created_at":"2016-05-16T08:39:15.508Z","message":"Yo man"}]

curl -X GET -H "Content-type: application/json" -H "Authorization: xfB32Lgoi_7A7CEkcMYh" http://localhost:3000/v1/chat_rooms/1/chat_messages/page/2

>> [{"chat_message_id":45,"user_id":1,"created_at":"2016-05-14T09:24:15.817Z","message":"Jhjhh"},{"chat_message_id":44,"user_id":2,"created_at":"2016-05-14T09:18:20.898Z","message":"sdfsdfsdf"},{"chat_message_id":43,"user_id":1,"created_at":"2016-05-14T09:18:09.200Z","message":"Asdfasdf"},{"chat_message_id":42,"user_id":2,"created_at":"2016-05-14T09:17:42.405Z","message":"sdfsdf"},{"chat_message_id":41,"user_id":1,"created_at":"2016-05-14T09:17:10.838Z","message":"asdfasd"}]
```

####Create a chat message
```bash
curl -X POST -H "Content-type: application/json" -H "Authorization: xfB32Lgoi_7A7CEkcMYh" http://localhost:3000/v1/chat_rooms/1/chat_messages -d '{"message": "whats up"}'

>> {"chat_message_id":1,"user_id":1,"created_at":"2016-05-11T13:22:09.820Z","message":"whats up","chat_room_id":1}
```
