FROM node:18-alpine

WORKDIR /app

# מעתיק רק את ה־package.json של השרת
COPY package*.json ./

RUN npm install

# מעתיק את כל הקוד של השרת
COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
