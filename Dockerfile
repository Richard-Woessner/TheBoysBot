# Stage 1: Clone the repository
FROM alpine/git as clone
WORKDIR /app
RUN git clone https://github.com/yourusername/yourrepository.git

# Stage 2: Build the application
FROM node:14
WORKDIR /app
COPY --from=clone /app/yourrepository /app
RUN npm install
RUN npm run build

# Expose the port and define the command to run your app
EXPOSE 3000
EXPOSE 443
CMD [ "node", "your-start-script.js" ]