require 'sidekiq/web'

Rails.application.routes.draw do
  devise_for :user, only: []

  namespace :v1, defaults: { format: :json } do
    resource :login, only: [:create], controller: :sessions
    resources :users, only: [:index, :show, :create]
    resources :chat_rooms do
      resources :chat_messages
    end
  end

  mount Sidekiq::Web => '/sidekiq'
end
