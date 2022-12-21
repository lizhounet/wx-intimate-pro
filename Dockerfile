FROM wechaty/wechaty:latest

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /wx-bot

COPY package.json .
RUN npm install
# 删除群聊消息延迟的代码
RUN sed -i '/if (payload.roomId && payload.text)/,/}/d' /wx-bot/node_modules/wechaty-puppet-wechat/dist/cjs/src/puppet-wechat.js
COPY . .

CMD [ "npm", "start" ]
