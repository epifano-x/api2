FROM node:18

WORKDIR /app

COPY . .

ENV PATH /app/node_modeules/.bin:$PATH
RUN npm update

EXPOSE 3001
CMD npm start
