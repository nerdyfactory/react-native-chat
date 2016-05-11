require 'faker'

# create user
1.upto(10) do |i|
  User.create(email: "user#{i}@example.com", password: "password")
end

# create a chat room between user 1 and 2 
ChatRoom.create(sender_id: 1, recipient_id: 2)

# create chat messages between user 1 and 2
uid = 1
10.times do
  ChatRoom.first.chat_messages.create!(message: Faker::Lorem.sentence, user_id: uid)
  uid = uid == 1 ? 2 : 1
  sleep 1
end
