FROM node:22

WORKDIR /src

COPY . .

CMD ["node", "benchmarks.js"]
