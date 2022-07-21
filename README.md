# 贴心小助手客户端
## 依赖

node 版本 >16

## 项目说明

本项目是基于[wechaty](https://github.com/wechaty/wechaty) 的个人开源智能机器人项目，更多关于`wechaty`项目说明及 api
文档可以移步：[wechaty 介绍](https://wechaty.js.org/docs/howto/)

## 更多功能说明

- [x] 微信每日说,定时给女朋友发送每日天气提醒，以及每日一句

* 定时提醒

- [x] 定时发送新闻咨询，自定义发送内容，笑话，等等


* 智能机器人

- [x] 天行机器人,智能陪聊


* 关键词

- [x] 关键词配置自动回复
- [x] 给机器人发送"更新配置"机器人会自动拉取最新配置信息
- [x] 给机器人发送"更新联系人"机器人会自动上传最新联系人到后台

## 开始使用
### 注册天行数据账号
1、注册: [天行数据](https://www.tianapi.com/source/865c0f3bfa)

2、申请接口权限

必选接口

* [天行机器人](https://www.tianapi.com/apiview/47)
* [天气](https://www.tianapi.com/apiview/72)
* [分类新闻](https://www.tianapi.com/apiview/51)
* [每日一句](https://www.tianapi.com/apiview/129)

其他接口自行申请使用
### 配置后台参数
- 配置天行参数，和其他配置
![输入图片说明](https://images.gitee.com/uploads/images/2022/0721/142244_63a21e1f_1843061.png "屏幕截图.png")
- 按需求配置定时任务，情侣每日说，关键词回复等功能
### 运行机器人
#### 直接本地运行
##### Step 1: 安装

克隆本项目，并进入项目根目录执行 `npm install`安装项目依赖

##### Step 2: 配置

`src/index.js`代码中配置`applictionToken`和`platformHostUrl`

##### Step 3: 运行

执行命令`npm run start`，终端会显示二维码，直接扫码登录

#### docker运行
我已经构建好镜像到dockerhub了，直接pull我的镜像即可，也可源码自行构建，不做说明
##### step1： 拉取镜像

```shell

docker pull 17783042962/wx-intimate:latest

```

##### step2： 启动docker
配置好自己的token

```shell
docker run -d -e APPLICTION_TOKEN=配置token--name wx-intimate-bot 17783042962/wx-intimate

```
启动成功后查看日志,查看登录二维码，扫码登录即可
```
docker logs -f wx-intimate-bot
```

