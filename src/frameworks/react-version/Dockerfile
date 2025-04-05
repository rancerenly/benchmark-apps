FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 4201

CMD ["sh", "-c", "HOST=0.0.0.0 npm run start"]