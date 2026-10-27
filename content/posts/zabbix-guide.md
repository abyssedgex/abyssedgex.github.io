---
title: "Zabbix使用指南"
date: 2017-05-20T16:38:30+08:00
tags: ["运维"]
categories: ["开发者工具"]
draft: false
---
[![](/res/img/zabbix/monitor.png)](/res/img/zabbix/monitor.png)

zabbix可监控服务器资源以及数据库资源，同时有开放的api接口可以方便的在它的基础上做二次开发，可作为数据中心建设的备选方案。

# Install

## 环境

```
ubuntu 14.04
mysql-5.6
php-5.5
zabbix-3.2
```

## 安装LAMP

### 安装Apache2和PHP

```
sudo apt install apache2
sudo apt-get install php5  php5-mysql  libapache2-mod-auth-mysql
```

查找date字符串，修改date.timezone及添加后面的字段

```
date.timezone = Asia/Shanghai
max_input_time = 600
max_execution_time= 600
post_max_size = 32M
```

重启apache2 `/etc/init.d/apache2 restart`

### 安装mysql

```
sudo apt-get install mysql-server
sudo apt isntall mysql-client
sudo apt install libmysqlclient-dev

sudo apt-get install phpmyadmin
sudo apt-get install php-mbstring
sudo apt-get install php-gettext
sudo ln -s /usr/share/phpmyadmin /var/www/html/phpmyadmin
```

## 安装Zabbix

### 增加zabbix用户和组

```
groupadd zabbix
useradd -g zabbix -m zabbix
```

### 安装依赖环境：

```
apt-get update
sudo apt-get install build-essential
sudo apt-get -y install make
sudo apt-get -y install gcc
sudo apt-get -y install libghc-hsql-mysql-dev
sudo apt-get install libmysqlclient18
sudo apt-get -y install libxml2-dev
sudo apt-get install libcurl3-dev
sudo apt-get install libsnmp-dev
```

### 导入数据

```
### 创建zabbix表
create database zabbix character set utf8;
### 创建mysql帐号：zabbix，密码：zabbix
grant all on zabbix.* to 'zabbix'@'localhost' identified by 'zabbix';
```

( 源码包下的路径：zabbix –> database –> mysql –> \*.sql )

```
mysql -uzabbix -pzabbix zabbix < schema.sql
mysql -uzabbix -pzabbix zabbix < images.sql
mysql -uzabbix -pzabbix zabbix < data.sql
```

### 编译安装

```
./configure --enable-server --enable-agent --with-mysql --enable-ipv6 --with-net-snmp --with-libcurl --with-libxml2

make install
```

### 安装中文字体

```
sudo apt-get install language-pack-zh-hans
```

### 启动zabbix\_server

`/etc/init.d/zabbix-server start`

访问[zabbix frontend](http://127.0.0.1/zabbix/),用户名密码`admin/zabbix`

# 添加Zabbix agent(active模式)监控主机

active模式：agent主机主动上报采集数据。

克隆一个模板

![](/res/img/zabbix/template.png)

修改为Agent active模式

![](/res/img/zabbix/activemode.png)

更新监控项

![](/res/img/zabbix/update.png)

创建主机

![](/res/img/zabbix/create_host.png)

选择模板

![](/res/img/zabbix/temp_choose.png)

## 安装 zabbix agent

1.  将zabbix文件夹解压后放在`C：\`
2.  C:\\zabbix\\下 新建一个`zabbix_agent.log`文件
3.  配置zabbix\_agentd.win.conf文件（位于`C:\zabbix\conf\`），需要修改的地方分别为：

    ```
    Logfile= C:\zabbix\zabbix_agent.log
            Server=X.X.X.X
            Hostname=X.X.X.X
    ```

注：

1.  Server是zabbix服务器的IP地址
2.  LogFile为`zabbix_agentd.log`文件的位置，用于记录事件，这里的zabbix\_agentd.log填写你新建log文件的位置
3.  Hostname需要和服务器端配置主机填入的主机名称一致，不然日志中将会报“host{主机名}not found”的错误

### 打开CMD命令行，注意文件路径执行：

```
C:\zabbix\bin\win32\zabbix_agentd.exe -c C:\zabbix\conf\zabbix_agentd.win.conf -i
C:\zabbix\bin\win32\zabbix_agentd.exe -c C:\zabbix\conf\zabbix_agentd.win.conf -s
```

## 查看监控项

![](/res/img/zabbix/monitor.png)

# 数据库监控

1.  oracle监控插件:[orabbix](http://www.smartmarmot.com/wiki/index.php?title=Orabbix)
2.  mysql：官方自带mysql监控模板，agent端运行mysql监控脚本
    todo

# CLI

todo
