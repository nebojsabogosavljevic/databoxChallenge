FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Copy TypeScript source files
COPY src ./src
COPY tsconfig.json ./

# Build TypeScript to JavaScript
RUN npm run build

# Expose the port
EXPOSE 3000
