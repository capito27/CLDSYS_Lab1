FROM node:10

WORKDIR /frontend

COPY frontend/package.json package.json
RUN npm install

COPY frontend .
RUN npm run build

WORKDIR /app

COPY backend/package.json package.json
RUN npm install

COPY backend .

EXPOSE 3000

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

RUN npm install -g nodemon

CMD /wait && nodemon server.js