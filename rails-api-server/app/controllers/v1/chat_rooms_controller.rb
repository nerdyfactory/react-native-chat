module V1
  class ChatRoomsController < ApplicationController
    #before_filter :authenticate_user!

    # POST /v1/chat_rooms
    # Creates a chat room
    def create
      unless params[:sender_id] == current_user.id
        puts "Error: current_user.id and sender_id are different"
        return
      end

      chat_room = ChatRoom.between(params[:sender_id], params[:recipient_id])
      if chat_room.present?
        @chat_room = chat_room.first
      else
        @chat_room = ChatRoom.create!(chat_room_params)
      end

      #render json: { chat_room_id: @chat_room.id }
      render json: @chat_room, serializer: ChatRoomSerializer
    end

    # GET /v1/chat_rooms/:id
    # GET a chat room
    def show
      @chat_room = ChatRoom.find(params[:id])
      @reciever = interlocutor(@chat_room)
      @chat_messages = @chat_room.chat_messages
      #@chat_message = ChatMessage.new

      render json: @chat_room, serializer: ChatRoomSerializer
    end

    private

    def chat_room_params
      params.permit(:sender_id, :recipient_id)
    end

    def interlocutor(chat_room)
      current_user == chat_room.recipient ? chat_room.sender : chat_room.recipient
    end

  end
end
