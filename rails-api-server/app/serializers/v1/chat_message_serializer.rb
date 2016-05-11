module V1
  class ChatMessageSerializer < ActiveModel::Serializer

    attributes :chat_message_id, :user_id, :created_at, :message

    belongs_to :chat_room_id

    def chat_message_id
      object.id
    end

  end
end
