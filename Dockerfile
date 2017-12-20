FROM node:8.9

ENV NODE_ENV=production
ENV TZ=Asia/Shanghai
EXPOSE 10008
ADD . /app
WORKDIR /app

RUN npm config set registry https://registry.npm.taobao.org && \
    npm install --production

CMD ["node", "index.js"]
