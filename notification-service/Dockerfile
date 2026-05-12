FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# Create the logs directory inside the container
RUN mkdir -p logs
CMD [ "node", "index.js" ]
