module V1
  class ChatMessagesController < ApplicationController

    # POST /v1/chat_rooms/:id/chat_messages
    # Creates a chat message
    def create
      @chat_room = ChatRoom.find(params[:chat_room_id])
      @chat_message = @chat_room.chat_messages.build(chat_message_params)
      @chat_message.user_id = current_user.id
      @chat_message.save!

      render json: @chat_message, serializer: ChatMessageSerializer
    end

    # GET /v1/chat_rooms/:id/chat_messages/
    # GET messages of a chat room
    def show
      @chat_room = ChatRoom.find(params[:chat_room_id])
      #@chat_messages = @chat_room.chat_messages
      @chat_messages = @chat_room.chat_messages.order(created_at: :desc).page(params[:page]).per(5)

      render json: @chat_messages, each_serializer: ChatMessageSerializer
    end

    private

    def chat_message_params
      params.require(:chat_message).permit(:message)
    end

  end
end
