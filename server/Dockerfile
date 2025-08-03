FROM node:18-alpine

WORKDIR /opt/render/project/src/server

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]