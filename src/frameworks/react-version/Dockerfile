FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./

RUN npm run build

EXPOSE 4201

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4201"]
