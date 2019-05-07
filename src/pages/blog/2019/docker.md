---
path: '/blog/2019/docker'
title: 'docker'
date: '2019-04-21'
---

### docker 介绍

Docker 采用虚拟化技术（操作系统虚拟化），可以让开发人员在 Container 里开发，部署，运行应用。将开发代码与环境隔离，在隔离容器中运行，避免了由于环境问题导致的各类问题

思路 构建一个image ---> 在container里运行 ---> 对image和container进行管理

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
构建image的基本组成，包含一系列的指令的文本文件，可以使用docker build命令来创建
```
指令格式
INSTRUCTION arguments
```

* FROM 定义构建时需要使用的base image
* LABEL 添加image的元数据信息
* ARG 设置构建时的变量
* ENV 设置环境变量
* WORKDIR 定义容器内的工作目录，在使用COPY | ADD 等命令时可以使用.代替
* RUN 构建过程中需要执行的命令
* COPY 复制本地文件到容器
* ADD 复制文件、目录、以及远程文件的urls到导致
* VOLUME
* CMD 容器运行时需要执行的命令
* EXPOSE 定义容器运行时的端口

#### DockerCLI

docker build 使用Dockerfile文件构建image
docker run 使用image运行一个容器
docker images 查看已存在的镜像
docker ps 查看当前正在运行的容器
docker rm 删除容器
docker rmi 删除镜像
docker start | stop | restart | kill 启动、停止、重启、杀死容器
docker push 将本地的镜像推送到docker hub
docker pull 从docker hub上下载镜像

#### 制作一个镜像
1. 使用nginx

#### Docker-Compose
单个容器使用Dockerfile足够，运行多容器应用需要compose，使用docker-compose.yml