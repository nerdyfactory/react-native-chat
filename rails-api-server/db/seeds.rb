require 'faker'

# create users
1.upto(20) do |i|
  User.create(email: "user#{i}@example.com", password: "password")
end

# create a chat room between user 1 and 2 
ChatRoom.create(sender_id: 1, recipient_id: 2)

# create chat messages between user 1 and 2
uid = 1
20.times do
  ChatRoom.first.chat_messages.create!(user_id: uid, message: Faker::Lorem.sentence, created_at: Faker::Time.backward(14))
  uid = uid == 1 ? 2 : 1
end
