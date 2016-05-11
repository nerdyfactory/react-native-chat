class CreateChatRooms < ActiveRecord::Migration
  def change
    create_table :chat_rooms do |t|
      t.integer :sender_id
      t.integer :recipient_id

      t.timestamps null: false
    end
    add_index :chat_rooms, :sender_id
    add_index :chat_rooms, :recipient_id
  end
end
