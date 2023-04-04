FROM node:15
WORKDIR /usr
RUN ls -a
COPY Service/OS/package.json ./
COPY Service/OS/tsconfig.json ./
COPY Service/OS/src ./src
COPY Service/OS/src/ ./src/uploads
RUN ls -a
RUN yarn
RUN yarn run build

FROM node:15
WORKDIR /usr
COPY Service/OS/package.json ./
COPY Service/OS/src/ ./src/uploads
RUN npm install --only=production
COPY --from=0 /usr/build .
RUN npm install pm2 -g
EXPOSE 3201
CMD ["pm2-runtime","app.js"]
