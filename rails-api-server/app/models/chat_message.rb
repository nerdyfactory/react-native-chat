class ChatMessage < ActiveRecord::Base
  belongs_to :chat_room
  belongs_to :user

  validates_presence_of :message, :chat_room_id, :user_id
end
