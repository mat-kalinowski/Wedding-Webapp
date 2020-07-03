FROM node:13.12.0

WORKDIR /node 
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install && npm install immutable && npm install @material-ui/icons && npm install @material-ui/core

CMD ["npm","start"]
