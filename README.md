echo "" | docker login ghcr.io -u bobruub --password-stdin

docker buildx build --platform linux/arm64 -t ghcr.io/bobruub/gsac_scheduler:latest --push .

docker run -d --restart unless-stopped --name gsac_scheduler -p 3000:3000 ghcr.io/bobruub/gsac_scheduler:latest

docker run -d --restart unless-stopped --name gsac_scheduler --env-file .env -p 3000:3000 ghcr.io/bobruub/gsac_scheduler:latest

docker run -d --restart unless-stopped --name gsac_scheduler --env-file .env -v home/tim/_git/perf_node_gsac/data:/home/tim/_git/perf_node_gsac/data -p 3000:3000 
  ghcr.io/bobruub/gsac_scheduler:latest


  docker buildx build --platform linux/arm/v7,linux/arm64 -t ghcr.io/bobruub/gsac_scheduler:latest --push .

