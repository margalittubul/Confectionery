FROM node:18-alpine

WORKDIR /opt/render/project/src

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]