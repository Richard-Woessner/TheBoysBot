FROM node:alpine
ENV NODE_ENV=production
ENV DISCORD_TOKEN=???
ENV DISCORD_CLIENT_ID=???
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "./build/index.js"]