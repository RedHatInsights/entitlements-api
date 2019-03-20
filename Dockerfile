FROM registry.access.redhat.com/rhoar-nodejs/nodejs-10

WORKDIR /opt/app-root/src

COPY package.json package-lock.json /opt/app-root/src/

RUN npm ci --only=production

COPY ./dist /opt/app-root/src

EXPOSE 8080
ENV NODE_ENV=production
CMD [ "node", "--max-http-header-size=16384", "./app.js" ]
