---
title: "Docker使用手册"
date: 2016-09-27T00:00:00+08:00
aliases: ["/2016/09/27/docker-manual/"]
tags: ["新知", "开发环境", "Docker"]
categories: ["开发者手册"]
draft: false
---
# 什么是Docker?

先看一段Docker创始人的一段视频:

<iframe src="http://player.youku.com/embed/XODc2MjUwNDU2" width="510" height="310" frameborder="0" allowfullscreen=""></iframe>

Ship! Docker就是用来解决日渐繁杂的开发和生产环境的痛点问题的!大大简化了软件开发的流程和环境搭建的复杂性,解放重复劳动,让技术人员更关注功能和需求.

Docker的产生是为了解决以下的问题:

1.  环境管理复杂:从各种OS到中间件到APP,开发者需要关心太多的东西,Docker可以通过镜像分享的形式简化部署多应用实例.
2.  虚拟化手段变化:采用虚拟化手段满足用户按需分配的资源需求以及保证可用性和隔离型.

# 如何学习一种工具和技术?

入门非常的容易

1.  上[官网](https://docs.docker.com/docker-for-windows/),跟着教程走
2.  下载[DOCKER FOR WINDOWS SERVER](http://www.docker.com/products/docker#/windows)安装
3.  非win10 pro,得安装[docker toolbox](http://www.docker.com/products/docker-toolbox)
4.  安装后,上[docker hub](https://hub.docker.com/) pull一个镜像下来.
5.  试运行下 `Docker run hello-world`

发现已经被墙了,google之,配置DaoCloud的[Docker加速器](https://www.daocloud.io/mirror#accelerator-doc)

```
docker-machine ssh default
sudo sed -i "s|EXTRA_ARGS='|EXTRA_ARGS='--registry-mirror=加速地址 |g" /var/lib/boot2docker/profile
exit
docker-machine restart default
```

开胃菜结束,进入主菜

# Docker Overview

Docker是一个用于Developing,shipping,running应用的开放平台.

先预览一下,之后我们需要弄清楚以下几个问题.

1.  Docker是什么?
2.  Docker是如何驱动的?
3.  Docker能解决什么问题?
4.  Docker的架构?

## 什么是Docker平台?

Docker提供管理容器生命周期的工具和平台:

-   将你的应用\[包括组件\]打包到Docker容器内
-   分发这些容器到团队,进行进一步的开发和测试
-   将应用发布到生产环境

## Docker引擎?

Docker是C/S结构的应用,Server是守护程序常驻内存,Client通过REST API和Server交互.

![](/res/img/docker/engine-components-flow.png)

## Docker解决什么问题?

### *快速可持续行的发布应用*

开发人员本地编码并通过分享Dorker容器进行集成,测试,发布

### *按需部署和裁剪*

Docker容器具备很高的移植性,它可以在开发人员的本地环境运行,也可以在数据中心,云的物理和虚拟环境中运行.

### *同一个硬件环境提供更高的负载*

## Docker的架构?

![](/res/img/docker/architecture.svg)

### Docker daemon

Server守护程序,用户通过Docker client和它交互

### Docker Client

用户和Docker交互的主要工具,使用命令行和配置和Docker damon进行交互.

### Docker内部结构

#### images

Docker的镜像是只读的模板,用于指示Docker创建容器的,由Dockerfile文本文件来描述.说白了就是Docker的Build组件.

#### containers

可运行的Docker image实例.是Docker的运行组件.

#### registries

docker registry是镜像库,是Docker的分发组件.

## Docker的容器如何加载和运行?

`$ docker run -i -t ubuntu /bin/bash`

当运行一条命令,Docker引擎会进行一系列的处理来加载和运行容器:

1.  获取`ubuntu`镜像: Docker引擎首先在本地查找镜像,如果存在就作为新的容器加载进来,如不存在就从[Docker hub](https://hub.docker.com/)获取镜像
2.  创建一个新的容器:Docker使用image创建容器
3.  配置文件系统并加载一个读写层: 在文件系统里创建容器并将读写层让入image
4.  配置网络接口:创建一个网络接口,允许Docker容器和local host交互
5.  配置IP地址: 查找并绑定一个可用的ip地址
6.  执行命令: 执行`/bin/bash`
7.  应用输出:连接应用标准输入,输出,错误接口,供交互.

# 入门示例

## 构建image

### 从[Docker hub](https://hub.docker.com/r/docker/whalesay/)获取whalesay镜像

```
$ docker run docker/whalesay cowsay boo
Unable to find image 'docker/whalesay:latest' locally
latest: Pulling from docker/whalesay
e9e06b06e14c: Pull complete
a82efea989f9: Pull complete
37bea4ee0c81: Pull complete
07f8e8c5e660: Pull complete
676c4a1897e6: Pull complete
5b74edbcaa5b: Pull complete
1722f41ddcb5: Pull complete
99da72cfe067: Pull complete
5d5bd9951e26: Pull complete
fb434121fc77: Already exists
Digest: sha256:d6ee73f978a366cf97974115abe9c4099ed59c6f75c23d03c64446bb9cd49163
Status: Downloaded newer image for docker/whalesay:latest
 _____
< boo >
 -----
    \
     \
      \
                    ##        .
              ## ## ##       ==
           ## ## ## ##      ===
       /""""""""""""""""___/ ===
  ~~~ {~~ ~~~~ ~~~ ~~~~ ~~ ~ /  ===- ~~~
       \______ o          __/
        \    \        __/
          \____\______/
```

### 写一个Dockerfile

```
FROM docker/whalesay:latest
RUN apt-get -y update && apt-get install -y fortunes
CMD /usr/games/fortune -a | cowsay
```

### 编译image

```
$ docker build -t docker-whale .
```

### 编译流程

-   首先,Docker校验编译所需要素.

```
Sending build context to Docker daemon 2.048 kB
```

-   Docker加载`whalesay`镜像.镜像已经在本地,所以不需要再去下载.

```
Step 1 : FROM docker/whalesay:latest
 ---> 6b362a9f73eb
```

-   Docker更新`apt-get`包管理器

```
Step 2 : RUN apt-get -y update && apt-get install -y fortunes
 ---> Running in 21b7de6678a8
Ign http://archive.ubuntu.com trusty InRelease
Get:1 http://archive.ubuntu.com trusty-updates InRelease [65.9 kB]
Get:2 http://archive.ubuntu.com trusty-security InRelease [65.9 kB]
Hit http://archive.ubuntu.com trusty Release.gpg
Get:3 http://archive.ubuntu.com trusty-updates/main Sources [474 kB]
```

-   安装`fortunes`

```
Reading state information...
The following extra packages will be installed:
  fortune-mod fortunes-min librecode0
Suggested packages:
  x11-utils bsdmainutils
The following NEW packages will be installed:
  fortune-mod fortunes fortunes-min librecode0
0 upgraded, 4 newly installed, 0 to remove and 87 not upgraded.
```

-   完成编译

```
Step 3 : CMD /usr/games/fortune -a | cowsay
 ---> Running in 3a10806db557
 ---> e02e38c358db
Removing intermediate container 3a10806db557
Successfully built e02e38c358db
```

### 运行新的`docker-whale`

```
docker run docker-whale

/ Everyone has a purpose in life. Perhaps \
| yours is watching television.           |
|                                         |
\ -- David Letterman                      /
-----------------------------------------
  \
   \
    \
                  ##        .
            ## ## ##       ==
         ## ## ## ##      ===
     /""""""""""""""""___/ ===
~~~ {~~ ~~~~ ~~~ ~~~~ ~~ ~ /  ===- ~~~
     \______ o          __/
      \    \        __/
        \____\______/
```

## Docker hub

[使用Docker hub对镜像进行配置管理](https://docs.docker.com/engine/getstarted/step_five/),和Git使用方式类似.

## 容器命名

```
$ docker run -d -P --name web training/webapp python app.py
```

# [容器挂载管理](https://docs.docker.com/engine/tutorials/dockervolumes/)

# Docker Compose

`Compose`是一个定义和运行多Docker容器应用的工具.

使用`Compose`通常有3个步骤:

1.  将应用的环境定义到`Dockerfile`,以便在其他地方可以复用.
2.  在`docker-compose.yml`将应用定义为服务,这样你可以在解耦的环境中运行
3.  最后,执行`docker-compose up`

`docker-compose.yml`大致内容如下:

```
version: '2'
services:
  web:
    build: .
    ports:
    - "5000:5000"
    volumes:
    - .:/code
    - logvolume01:/var/log
    links:
    - redis
  redis:
    image: redis
volumes:
  logvolume01: {}
```

## Compose的使用场景

1.  开发环境
2.  自动化测试环境
3.  单站部署

## 使用指南

跟着[官网教程](https://docs.docker.com/compose/gettingstarted/)

# [Docker Machine](https://docs.docker.com/machine/)

Docker Machine说白了就是个Docker Server集群管理的client端,便于远程发布和部署Docker应用

# Docker应用到项目开发方法

![](/res/img/docker/CI.png)

如果是新的团队,那没什么问题,起初就可以商量好.如果是已经比较成熟的团队,Docker逐步嵌入到几个持续集成的流程中去.应用Docker到软件开发的流程,首先需要解决几个问题.

1.  Base Image的选择, [phusion-baseimage](https://phusion.github.io/baseimage-docker/)
2.  配置管理Docker镜像的工具的选择，如Ansible、Chef、Puppet
3.  Host主机系统的选择，如CoreOS、Ubuntu
4.  使用持续集成工具(Jenkins)进行管道部署进行持续集成
5.  使用[Google Kubernetes](https://github.com/kubernetes/kubernetes)进行生产部署

[Docker的集成测试部署之道](http://www.infoq.com/cn/articles/docker-integrated-test-and-deployment)

## Docker文件挂载

Docker image打包发布的时候,如果源码也一并放在image里是不合理的,所以具体开发过程中需要将宿主文件挂载到Docker容器里.

### windows下开发环境

windows在vxbox的虚拟机在起Docker,所以需要迂回挂载.

#### 利用vxbox共享

-   设置vxbox共享文件夹

![](/res/img/docker/vxbox.png)

-   进入vxbox虚拟机,将windows目录挂载到虚拟机,如：

```bash
sudo mount -t vboxsf project /mnt/data
```

-   进入Docker终端，-v启动挂载到容器

```
docker run -it -v /mnt/data:/usr/data ubuntu:trusty
```

# Docker常用命令

## 清除

-   停止所有container

```bash
docker stop $(docker ps -a -q)
```

-   删除所有container

```bash
docker rm $(docker ps -a -q)
```

-   删除所有images

```bash
docker rmi $(docker images -q)
```

# Docker的坑

[希特勒吐槽Docker](https://t.co/cmXB2Clj8D)

# Docker工具

1.  [Kubernetes](http://kubernetes.io/)
2.  [InfoQ上的Docker](http://www.infoq.com/cn/DockerDeep)
