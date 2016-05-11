module V1
  class SessionSerializer < ActiveModel::Serializer

    #attributes :email, :token_type, :user_id, :access_token
    attributes :email, :user_id, :access_token

    def user_id
      object.id
    end

    #def token_type
    #  'Bearer'
    #end

  end
end
