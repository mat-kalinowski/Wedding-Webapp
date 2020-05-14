FROM node:13.12.0

WORKDIR /node 
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install

CMD ["npm","start"]

