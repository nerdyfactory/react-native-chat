class ChatRoom < ActiveRecord::Base
  belongs_to :sender, :foreign_key => :sender_id, class_name: 'User'
  belongs_to :recipient, :foreign_key => :recipient_id, class_name: 'User'

  has_many :chat_messages, dependent: :destroy

  validates_uniqueness_of :sender_id, :scope => :recipient_id

  scope :involving, -> (user) do
    where("chat_rooms.sender_id =? OR chat_rooms.recipient_id =?", user.id, user.id)
  end

  scope :between, -> (sender_id, recipient_id) do
    where("(chat_rooms.sender_id = ? AND chat_rooms.recipient_id =?) OR (chat_rooms.sender_id = ? AND chat_rooms.recipient_id =?)", sender_id, recipient_id, recipient_id, sender_id)
  end
end
