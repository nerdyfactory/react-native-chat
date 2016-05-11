class AddStuffToUsers < ActiveRecord::Migration
  def change
    add_column :users, :username, :string
    add_column :users, :access_token, :string
  end
end
