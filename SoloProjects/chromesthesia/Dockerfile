FROM node:10.1

WORKDIR usr/src/app

COPY package.json .

RUN npm install

COPY . .

RUN npm build

EXPOSE 8888

CMD ["npm", "start"]