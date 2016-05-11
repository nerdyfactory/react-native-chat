module V1
  class ChatRoomSerializer < ActiveModel::Serializer

    attributes :chat_room_id, :sender_id, :recipient_id

    has_many :chat_messages

    def chat_room_id
      object.id
    end

  end
end
