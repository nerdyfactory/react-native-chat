Sidekiq.configure_server do |config|
  #config.redis = { url: 'unix://#{Rails.root}/tmp/sockets/redis.sock' }
  config.redis = { url: 'unix:///tmp/redis.sock' }
end

Sidekiq.configure_client do |config|
  #config.redis = { url: 'unix://#{Rails.root}/tmp/sockets/redis.sock' }
  config.redis = { url: 'unix:///tmp/redis.sock' }
end

