FROM node:15
WORKDIR /usr
RUN ls -a
COPY Service/Authencation/package.json ./
COPY Service/Authencation/tsconfig.json ./
COPY Service/Authencation/src ./src
RUN ls -a
RUN yarn
RUN yarn run build

FROM node:15
WORKDIR /usr
COPY Service/Authencation/package.json ./
RUN npm install --only=production
COPY --from=0 /usr/build .
RUN npm install pm2 -g
EXPOSE 3200
CMD ["pm2-runtime","app.js"]
