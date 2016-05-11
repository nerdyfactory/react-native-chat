module V1
  class UsersSerializer < ActiveModel::Serializer

    #attributes :username, :email
    attributes :id, :email

  end
end
