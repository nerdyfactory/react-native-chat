require 'sidekiq/web'

Rails.application.routes.draw do
  devise_for :user, only: []

  concern :paginatable do
    get '(page/:page)', :action => :show, :on => :collection, :as => ''
  end

  namespace :v1, defaults: { format: :json } do
    resource :login, only: [:create], controller: :sessions
    resources :users, only: [:index, :show, :create]
    resources :chat_rooms do
      resources :chat_messages, :concerns => :paginatable
    end
  end

  mount Sidekiq::Web => '/sidekiq'
end
