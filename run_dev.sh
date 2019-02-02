
#!/bin/bash

docker run --rm -it \
  -e NODE_ENV="development" \
  -e NPM_TOKEN="$NPM_TOKEN" \
  -v `pwd`:/app/ \
  -w /app/ \
    node:11.6-alpine /bin/sh
