FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --save-dev tsx

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]