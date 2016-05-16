module V1
  class ChatRoomsController < ApplicationController

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

      render json: @chat_room, serializer: ChatRoomSerializer
    end

    private

    def chat_room_params
      params.permit(:sender_id, :recipient_id)
    end
  end
end
