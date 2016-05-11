class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  
  # http://api.rubyonrails.org/classes/ActionController/RequestForgeryProtection.html
  skip_before_action :verify_authenticity_token, if: :json_request?

  before_action :authenticate_user_from_token!

  respond_to :json

  def authenticate_user_from_token!
    auth_token = request.headers['Authorization']

    if auth_token
      authenticate_with_auth_token auth_token
    else
      authentication_error
    end
  end

  private

  def json_request?
    request.format.json?
  end

  def authenticate_with_auth_token auth_token 
    user = User.where(access_token: auth_token).first

    if user && Devise.secure_compare(user.access_token, auth_token)
      # User can access
      sign_in user, store: false
    else
      authentication_error
    end
  end

  def authentication_error
    # User's token is either invalid or not in the right format
    render json: {error: t('unauthorized')}, status: 401  # Authentication timeout
  end
end
