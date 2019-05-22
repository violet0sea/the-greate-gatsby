---
path: '/blog/2019/docker'
title: 'docker'
date: '2019-04-21'
---

### docker 介绍

Docker 采用虚拟化技术（操作系统虚拟化），可以让开发人员在 Container 里开发，部署，运行应用。将开发代码与环境隔离，在隔离容器中运行，避免了由于环境问题导致的各类问题。Docker之前使用虚拟机来做隔离，由于虚拟机占用较多的资源，导致资源利用率低，而且虚拟机里安装了独立的操作系统，进而使得启动速度较慢；基于以上的原因，linux一致在致力于容器技术的开发，而Docker正是利用LXC技术来实现了简单易用的API。
如何在项目里引入Docker呢？思路如下：
构建一个 image ---> 在 container 里运行 ---> 对 image 和 container 进行管理

### 特点

快速部署
轻量
易于迁移和扩展
性能高开销小

### 应用场景

自动化部署
微服务

### docker Engine

CS 架构
docker image
docker container

#### Dockerfile

构建 image 的基本组成，包含一系列的指令的文本文件，可以使用 docker build 命令来创建

```
指令格式
INSTRUCTION arguments
```

- FROM 定义构建时需要使用的 base image
- LABEL 添加 image 的元数据信息
- ARG 设置构建时的变量
- ENV 设置环境变量
- WORKDIR 定义容器内的工作目录，在使用 COPY | ADD 等命令时可以使用.代替
- RUN 构建过程中需要执行的命令
- COPY 复制本地文件到容器
- ADD 复制文件、目录、以及远程文件的 urls 到导致
- VOLUME 将宿主机器的目录挂载到容器目录里，适合配置文件，开发环境的代码
- ENTRYPOINT 设置容器运行时需要执行的命令和参数
- CMD 容器运行时需要执行的默认命令，在 ENTRYPOINT 之后执行
- EXPOSE 定义容器运行时的端口

#### DockerCLI

docker build 使用 Dockerfile 文件构建 image
docker run 使用 image 运行一个容器
docker exec 进入容器内部
docker images 查看已存在的镜像
docker ps 查看当前正在运行的容器
docker rm 删除容器
docker rmi 删除镜像
docker start | stop | restart | kill 启动、停止、重启、杀死容器
docker push 将本地的镜像推送到 docker hub
docker pull 从 docker hub 上下载镜像

#### 制作一个镜像

1. 使用 nginx

#### Docker-Compose

单个容器使用 Dockerfile 足够，运行多容器应用需要 compose，使用 docker-compose.yml来启动多个容器，一个简单的node例子

```
# docker-compose.yml
version: "3"
services:
  webapp:
    build: .
    ports:
      - "3006:3006"
    volumes:
      - .:/code
    depends_on:
      - redis
      - mongo
  redis:
    image: "redis:alpine"
  mongo:
    image: "mongo:4.0"

# app.js
const http = require('http');
const redis = require('redis');
const mongoose = require("mongoose")

const client = redis.createClient(6379, 'redis')
client.on('connect', function () {
  client.set('count', 1)
  console.log('connected');
});

mongoose.connect("mongodb://mongo/test", { useNewUrlParser: true })

const kittySchema = new mongoose.Schema({
  date: String
})

const Kitten = mongoose.model("Kitten", kittySchema)

const server = http.createServer(function (req, res) {
  const silence = new Kitten({ date: new Date() })
  if (req.url === '/') {
    client.get('count', function (err, count) {
      res.write(
        "It's works. \n The site have been visited  " +
          count +
          " times." +
          "silence " +
          silence.date
      )
      res.end()
      client.set('count', parseInt(count) + 1)
    });
  }


})

server.listen(3006, function () {
  console.log('server running at port 3006.')
})

# Dockerfile
FROM node:10
WORKDIR /code
CMD ["node", "app.js"]

# package.json
{
  "name": "docker-node",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "mongoose": "^5.5.6",
    "redis": "^2.8.0"
  }
}

```
