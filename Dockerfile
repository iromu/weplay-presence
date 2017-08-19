FROM iromu/weplay-common:latest

# Create app directory
RUN mkdir -p /usr/src/app/presence
WORKDIR /usr/src/app/presence

COPY . .

# Install app dependencies
RUN yarn --production
RUN yarn link weplay-common

# Setup environment
ENV NODE_ENV production
ENV WEPLAY_REDIS_URI "redis:6379"
ENV WEPLAY_LOGSTASH_URI "logstash:5001"


# Run
CMD [ "node", "index.js" ]
