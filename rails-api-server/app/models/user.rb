class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  after_create :update_access_token!  

  #validates :username, presence: true
  validates :email, presence: true

  has_many :chat_rooms , :foreign_key => :sender_id

  private

  def update_access_token!
    self.access_token = Devise.friendly_token
    save
  end
end
