module V1
  class UsersController < ApplicationController
    #skip_before_action :authenticate_user_from_token!, only: [:index, :show, :create]
    skip_before_action :authenticate_user_from_token!, only: [:create]

    # GET /v1/users
    # Get all the users
    def index
      @users = User.where.not("id = ?", current_user.id).order(:created_at)
      #@chat_rooms = ChatRoom.involving(current_user).order(created_at: :desc)
      render json: @users, each_serializer: UsersSerializer
    end

    # GET /v1/users/:id
    # GET an user
    def show
      @user = User.find(params[:id])
      render json: @user, serializer: UserSerializer
    end

    # POST /v1/users
    # Creates an user
    def create
      @user = User.new user_params

      if @user.save
        render json: @user, serializer: SessionSerializer
      else
        render json: { error: t('user_create_error') }, status: :unprocessable_entity
      end
    end

    private

    def user_params
      params.require(:user).permit(:email, :username, :password)
    end
  end
end
