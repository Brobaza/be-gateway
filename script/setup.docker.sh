docker network create --driver bridge global_network
docker compose -f docker-compose-redis.yml up -d
docker compose -f docker-compose-postgres.yml up -d
docker compose -f docker-compose-kafka.yml up -d
docker compose -f docker-compose-mongo.yml up -d
docker compose -f docker-compose-mailhog.yml up -d
