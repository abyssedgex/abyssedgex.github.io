---
title: "hadoop实战(一)"
date: 2017-05-22T12:53:48+08:00
aliases: ["/2017/05/22/hadoop-in-action-1/"]
tags: ["大数据", "hadoop"]
categories: ["开发者手册"]
draft: false
---
# [Docker形式的Hadoop](/posts/hadoop-quick-start/)

# Hadoop环境搭建

## 创建hadoop用户

增加hadoop用户，授予管理员权限，并登录

```
$ sudo useradd -m hadoop
$ sudo passwd hadoop
$ sudo adduser hadoop sudo
$ sudo su hadoop
```

## 安装配置SSH

```
$ sudo apt-get install openssh-server
$ sudo /etc/init.d/ssh start
```

设置免密码登录，生成私钥和公钥,并将公钥追加到 authorized\_keys中，它为用户保存所有允许登录到ssh客户端用户的公钥内容。

```
$ ssh-keygen -t rsa -P ""
$  cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
$  chmod 0600 ~/.ssh/authorized_keys
```

在SSH安装之后，对SSH进行测试`$ssh localhost`

## 安装Hadhoop

### 安装Java环境

`sudo apt-get install openjdk-7-jdk`

配置 JAVA\_HOME， 获取java安装目录

```
hadoop@78dd25fb63f7:/usr/local/hadoop$ update-alternatives --config java
There is only one alternative in link group java (providing /usr/bin/java): /usr
/lib/jvm/java-7-openjdk-amd64/jre/bin/java
Nothing to configure.
hadoop@78dd25fb63f7:/usr/local/hadoop$
```

配置环境变量`$ emacs ~/.bashrc`并export JAVA\_HOME=JDK安装路径

```
$ source ~/.bashrc
```

## 安装Hadoop2.7

```
wget http://mirrors.tuna.tsinghua.edu.cn/apache/hadoop/common/hadoop-2.7.3/hadoop-2.7.3.tar.gz

sudo tar xzf hadoop-2.7.3.tar.gz
sudo mv hadoop-2.7.3 /usr/local/hadoop
sudo chmod 777 /usr/local/hadoop
update-alternatives --config java
```

添加以下环境变量:

```
#HADOOP VARIABLES START

export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64

export HADOOP_HOME=/usr/local/hadoop
export HADOOP_INSTALL=$HADOOP_HOME
export YARN_HOME=$HADOOP_HOME
export PATH=$PATH:$HADOOP_HOME/bin
export PATH=$PATH:$HADOOP_HOME/sbin
export HADOOP_MAPRED_HOME=$HADOOP_HOME
export HADOOP_COMMON_HOME=$HADOOP_HOME
export HADOOP_HDFS_HOME=$HADOOP_HOME
export YARN_HOME=$HADOOP_HOME
export HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native
export HADOOP_OPTS= "-Djava.library.path=$HADOOP_HOME/lib:$HADOOP_COMMON_LIB_NATIVE_DIR"
export STREAM=$HADOOP_HOME/share/hadoop/tools/lib/hadoop-streaming-*.jar
export HADOOP_CLASSPATH=${JAVA_HOME}/lib/tools.jar
export JAVA_LIBRARY_PATH=$HADOOP_HOME/lib/native
#HADOOP VARIABLES END
```

查看Hadhoop版本，验证是否成功

```
hadoop version

hadoop@VM-160-8-ubuntu:~$ hadoop version
Hadoop 2.7.3
Subversion https://git-wip-us.apache.org/repos/asf/hadoop.git -r baa91f7c6bc9cb92be5982de4719c1c8af91ccff
Compiled by root on 2016-08-18T01:41Z
Compiled with protoc 2.5.0
From source with checksum 2e4ce5f957ea4db193bce3734ff29ff4
This command was run using /usr/local/hadoop/share/hadoop/common/hadoop-common-2.7.3.jar
```

## 运行测试程序

### 步骤 1

创建一个临时的Input目录，将需要处理的文件copy到input文件夹下。

```
$ mkdir input
$ cp $HADOOP_HOME/*.txt input
$ ls -l input

-rw-r--r-- 1 root root 15164 Feb 21 10:14 LICENSE.txt
-rw-r--r-- 1 root root   101 Feb 21 10:14 NOTICE.txt
-rw-r--r-- 1 root root  1366 Feb 21 10:14 README.txt
```

### 步骤 2

利用Hadoop进行单词计数处理，统计input文件夹中所有文件中含有单词的次数

```
hadoop jar /usr/local/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-examples-2.7.3.jar  wordcount input output
```

查看

```
hadoop@VM-160-8-ubuntu:~$ cat output/*
cryptography    1
cure    3
currently    1
customarily    3
customary    1
d)    1
damage    1
damages    7
damages,    3
damages.    2
data    3
data,    1
date    7
day    4
days    4
de    1
deal    5
declaratory    2
decoding    1
decompression    4
deemed    2
defend    2
defend,    1
defense    1
defined    5
definition,    4
delete    2
deleted    2
deletion    2
deliberate    1
den    1
dependencies    8
depends    13
derivative    5
......
```

# Hadoop伪分布式安装

## core-site.xml

core-site.xml文件中包含Hadoop实例的端口号信息, 文件系统的内存分配信息，存储数据的内存限制，读/写缓冲区的容量等信息。 打开`core-site.xml`文件，并在, 标签之间添加以下属性信息。
cd $HADOOP\_HOME/etc/hadoop

```
<configuration>
   <property>
      <name>fs.default.name</name>
      <value>hdfs://localhost:9000</value>
   </property>
</configuration>
```

## hdfs-site.xml

`hdfs-site.xml`文件包括本地文件系统中复制数据，主节点路径，数据节点路径等信息，该文件主要储存Hadoop基础设施。

```
<configuration>
   <property>
      <name>dfs.replication</name>
      <value>1</value>
   </property>
   <property>
      <name>dfs.name.dir</name>
      <value>file:///home/hadoop/hadoopinfra/hdfs/namenode</value>
   </property>
   <property>
      <name>dfs.data.dir</name>
      <value>file:///home/hadoop/hadoopinfra/hdfs/datanode</value>
   </property>
</configuration>
```

## yarn-site.xml

在以上文件中，所有的属性值都是用户定义的，可以通过改变属性值Hadoop基础构架，yarn-site.xml能够配置Hadoop的yarn，打开yarn-site.xml文件，在, 标签之间添加属性。

```
<configuration>
    <property>
      <name>yarn.nodemanager.aux-services</name>
      <value>mapreduce_shuffle</value>
   </property>
</configuration>
```

## mapred-site.xml

`mapred-site.xml`文件说明哪一个MapReduce框架正在被使用。在默认状态下，Hadoop包含一个yarn-site.xml模板。 首先，需要使用cp命令复制mapred-site,xml.template到mapred-site.xml文件。

```
$ cp mapred-site.xml.template mapred-site.xml
```

打开mapred-site.xml文件，并在, 标签之间添加属性。

```
<configuration>
    <property>
      <name>mapreduce.framework.name</name>
      <value>yarn</value>
   </property>
</configuration>
```

## Hadoop启动

### 建立主节点

建立主节点使用`hdfs namenode -format`命令。

```
$ cd ~
$ hdfs namenode -format
打开hadoop-env.sh，增加
export  HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native
export  HADOOP_HOME=/usr/local/hadoop
export  HADOOP_OPTS="-Djava.library.path=$HADOOP_HOME/lib:$HADOOP_COMMON_LIB_NATIVE_DIR"
```

命令正确执行后，可以得到以下的输出结果。

```
hadoop@VM-160-8-ubuntu:/usr/local/hadoop/etc/hadoop$ hdfs namenode -format
17/05/21 12:12:04 INFO namenode.NameNode: STARTUP_MSG:
/************************************************************
STARTUP_MSG: Starting NameNode
STARTUP_MSG:   host = VM-160-8-ubuntu/127.0.0.1
STARTUP_MSG:   args = [-format]
STARTUP_MSG:   version = 2.7.3
......
......
17/05/21 12:12:06 INFO namenode.NameNode: SHUTDOWN_MSG:
/************************************************************
SHUTDOWN_MSG: Shutting down NameNode at VM-160-8-ubuntu/127.0.0.1
************************************************************/
```

### 启动Hadoop的dfs文件系统

以下命令用来启动dfs，启动Hadoop文件系统。(2.7需将 /etc/hadoop/hadoop-env.sh中的 JAVA\_HOME设为绝对路径)

```
export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64
```

```
hadoop@VM-160-8-ubuntu:~$ start-dfs.sh
17/05/21 12:23:54 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
Incorrect configuration: namenode address dfs.namenode.servicerpc-address or dfs.namenode.rpc-address is not configured.
Starting namenodes on []
localhost: starting namenode, logging to /usr/local/hadoop/logs/hadoop-hadoop-namenode-VM-160-8-ubuntu.out
localhost: starting datanode, logging to /usr/local/hadoop/logs/hadoop-hadoop-datanode-VM-160-8-ubuntu.out
Starting secondary namenodes [0.0.0.0]
0.0.0.0: starting secondarynamenode, logging to /usr/local/hadoop/logs/hadoop-hadoop-secondarynamenode-VM-160-8-ubuntu.out
17/05/21 12:24:13 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
```

### 启动Yarn脚本

以下命令启动yarn script，执行这个命令将会启动yarn daemons程序。

```
$ start-yarn.sh
hadoop@VM-160-8-ubuntu:~$ start-yarn.sh
starting yarn daemons
starting resourcemanager, logging to /usr/local/hadoop/logs/yarn-hadoop-resourcemanager-VM-160-8-ubuntu.out
localhost: starting nodemanager, logging to /usr/local/hadoop/logs/yarn-hadoop-nodemanager-VM-160-8-ubuntu.out
```

通过浏览器访问Hadoop

Hadoop默认的端口号是50070，使用以下命令访问Hadoop服务。`http://localhost:50070/`

图1-Hadoop服务

![](/res/img/hadoop/dsf_overview.jpg)

### 启动集群中所有的应用程序

默认的端口号8088能够访问所有的应用程序，使用以下url能够访问这个服务。`http://localhost:8088/`

图2-Hadoop应用程序

![](/res/img/hadoop/8088.jpg)

出现以上图片表明Hadoop程序已经完成部署。

# Spark安装

获取并解压到Hadoop中.

```
wget https://d3kbcqa49mib13.cloudfront.net/spark-2.1.1-bin-hadoop2.7.tgz
tar -xf spark-2.1.1-bin-hadoop2.7.tgz
sudo mv spark-2.1.1-bin-hadoop2.7 $HADOOP_HOME/spark2
```

配置环境变量:

```
export SPARK_HOME=$HADOOP_HOME/spark2
export PATH=$SPARK_HOME/bin:$PATH
```

进入Spark安装路径,配置spark环境变量：`cp spark-env.sh.template spark-env.sh`

加入如下环境变量

```
export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64
export SPARK_MASTER_IP=10.154.160.8
```

sbin/start-all.sh启动spark, 8080端口访问spark的web站点
