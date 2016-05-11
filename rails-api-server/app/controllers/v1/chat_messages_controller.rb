module V1
  class ChatMessagesController < ApplicationController
    #before_filter :authenticate_user!

    # POST /v1/chat_rooms/chat_messages
    # Creates a chat message
    def create
      @chat_room = ChatRoom.find(params[:chat_room_id])
      @chat_message = @chat_room.chat_messages.build(chat_message_params)
      @chat_message.user_id = current_user.id
      @chat_message.save!

      #@path = chat_room_path(@chat_room)

      render json: @chat_message, serializer: ChatMessageSerializer
    end

    private

    def chat_message_params
      params.require(:chat_message).permit(:message)
    end

  end
end
