---
title: "Docker环境"
date: 2016-10-27T11:03:37+08:00
tags: ["开发环境", "docker", "docker base image", "hadoop", "spark", "tesoflow"]
categories: ["开发者手册"]
draft: false
---
如今技术革新非常快,搭建环境也日趋繁杂.我是个爱好折腾之人,时不时的总想把玩下新的技术,每天在win10,ubuntu,mac系统间来回切换,感谢Docker,救我于水火.

# 基础镜像

自己裁剪一个baseImage,带emacs编辑器.编写Dockerfile,并编译

```bash
git clone https://github.com/LiZoRN/DockerBaseImage.git
cd DockerBseImage
docker build -t invain/ubuntu .
```

将镜像文件push到`Docker hub`

`docker push invain/ubuntu`

其他环境下就可以直接使用

`docker pull invain/ubuntu`

*注意*: Docker镜像共享，不建议直接拿Dockerfile build生产, 而应从Docker镜像库里拉,避免镜像Build的过程中引入编译环境差异.

# Hadoop环境搭建(单站)

## 创建hadoop用户

增加hadoop用户，授予管理员权限，并登录

```bash
$ sudo useradd -m hadoop
$ sudo passwd hadoop
$ sudo adduser hadoop sudo
$ sudo su hadoop
```

## 安装并配置SSH

安装openssh

`$ sudo apt-get install openssh-server`

启动

`$ sudo /etc/init.d/ssh start`

设置免密码登录，生成私钥和公钥,并将公钥追加到 authorized\_keys中，它为用户保存所有允许登录到ssh客户端用户的公钥内容。

```bash
$ ssh-keygen -t rsa -P ""
$  cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
```

## 安装Java环境

`sudo apt-get install openjdk-7-jdk`

获取java安装目录.

```bash
$ update-alternatives --config java
There is only one alternative in link group java (providing /usr/bin/java): /usr
/lib/jvm/java-7-openjdk-amd64/jre/bin/java
Nothing to configure.
```

`~/.bashrc`中写入JAVA\_HOME路径,

```
export JAVA_HOME=JDK安装路径
```

## 安装Hadoop

安装hadoop,如2.7.3版本

```bash
wget http://mirrors.tuna.tsinghua.edu.cn/apache/hadoop/common/hadoop-2.7.3/hadoop-2.7.3.tar.gz
sudo tar xzf hadoop-2.7.3.tar.gz
sudo mv hadoop-2.7.3 /usr/local/hadoop
```

配置Hadoop的环境变量

给你的`~/bashrc`添加如下内容.

```bash
#HADOOP VARIABLES START
export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64
export HADOOP_HOME=/usr/local/hadoop
export PATH=$PATH:$HADOOP_HOME/bin
export PATH=$PATH:$HADOOP_HOME/sbin
export HADOOP_MAPRED_HOME=$HADOOP_HOME
export HADOOP_COMMON_HOME=$HADOOP_HOME
export HADOOP_HDFS_HOME=$HADOOP_HOME
export YARN_HOME=$HADOOP_HOME
export HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native
export HADOOP_OPTS="-Djava.library.path=$HADOOP_HOME/lib"
export STREAM=$HADOOP_HOME/share/hadoop/tools/lib/hadoop-streaming-*.jar
export HADOOP_CLASSPATH=${JAVA_HOME}/lib/tools.jar
#HADOOP VARIABLES END
```

验证hadoop是否安装成功

```bash
hadoop@8bbae082ad69:~$ hadoop version
Hadoop 2.7.3
Subversion https://git-wip-us.apache.org/repos/asf/hadoop.git -r baa91f7c6bc9cb92be5982de4719c1c8af91ccff
Compiled by root on 2016-08-18T01:41Z
Compiled with protoc 2.5.0
From source with checksum 2e4ce5f957ea4db193bce3734ff29ff4
This command was run using /usr/local/hadoop/share/hadoop/common/hadoop-common-2.7.3.jar
```

将镜像push到Docker hub

```bash
docker commit 8bbae082ad69 invain/hadoop
docker push invain/hadoop
```

# spark

运行一个java docker容器.

`docker run -it invain/java`

下载spark包.

```
wget http://mirrors.hust.edu.cn/apache/spark/spark-2.0.1/spark-2.0.1-bin-hadoop2.7.tgz
sudo tar xzf spark-2.0.1-bin-hadoop2.7.tgz
sudo mv spark-2.0.1-bin-hadoop2.7 /usr/local/spark
```

配置好环境变量.

```bash
export SPARK_HOME=/usr/local/spark
export PATH=$SPARK_HOME/bin:$PATH
```

跑个小小示例.
创建个文本文件,如`hellospark.txt`:

```
hello world!
hello spark!
```

运行spark的python交互式控制台,`pyspark`.

```
hadoop@4532e4bdaa51:~$ pyspark
Python 2.7.6 (default, Jun 22 2015, 17:58:13)
[GCC 4.8.2] on linux2
Type "help", "copyright", "credits" or "license" for more information.
Using Spark's default log4j profile: org/apache/spark/log4j-defaults.properties
Setting default log level to "WARN".
To adjust logging level use sc.setLogLevel(newLevel).
16/10/28 02:10:51 WARN NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
Welcome to
      ____              __
     / __/__  ___ _____/ /__
    _\ \/ _ \/ _ `/ __/  '_/
   /__ / .__/\_,_/_/ /_/\_\   version 2.0.1
      /_/

Using Python version 2.7.6 (default, Jun 22 2015 17:58:13)
SparkSession available as 'spark'.
>>>
```

使用textFile加载文本到RDD,进行’wordcount’.

```bash
>>> text = sc.textFile("hellospark.txt")
>>> counts = text.flatMap(lambda line: line.split(" ")).map(lambda word: (word,1)).reduceByKey(lambda x,y: x + y)
```

调用saveAsTextFile,分布式作业开始了…

```
counts.saveAsTextFile("hellospark_out")
```

可以在工作台输出目录里查看

```
hadoop@4532e4bdaa51:~$ cat hellospark_out/part-00000
(u'', 1)
(u'spark!', 1)
(u'world!', 1)
(u'hello', 2)
```

# tensorflow

`docker run -it b.gcr.io/tensorflow/tensorflow`

# Docker hub

需要什么库可以从[docker hub](https://hub.docker.com/explore/)找.

Docker hub是一个类似Github一样的地方,只不过前者是一个镜像仓库.

docker可以让你的环境配置异常简单，通常你只需要执行一个命令.

*Mysql*

```
$ docker run -p 3306:3306 --name username -e MYSQL_ROOT_PASSWORD=password -d mysql:tag
```

*mongo*

`docker run --name some-mongo -d mongo`

*[Oracle](https://hub.docker.com/_/oraclelinux/)*
