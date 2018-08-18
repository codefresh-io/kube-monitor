FROM node:9.6.1-alpine
WORKDIR /src
COPY ./package.json /src/package.json
RUN npm install 
COPY ./ /src 
CMD ["node", "./server.js"]
