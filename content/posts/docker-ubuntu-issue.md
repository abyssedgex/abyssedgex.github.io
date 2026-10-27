---
title: "ubuntu docker镜像问题"
date: 2016-11-02T11:22:51+08:00
aliases: ["/2016/11/02/docker-ubuntu-issue/"]
tags: ["docker", "spacemacs", "emacs", "linux环境变量"]
categories: ["开发者手册"]
draft: false
---
# 起因

emacs使用多年,发现spacemacs的配置还算符合胃口,于是想做一个基于Ubuntu16.04的Docker镜像,以后就可以带着这粒胶囊行走天下了.

没想到踩到一个坑…

*Dockerfile:*

```bash
RUN \
 DEBIAN_FRONTEND=noninteractive apt-get update && \
 DEBIAN_FRONTEND=noninteractive apt-get -y install wget curl git emacs&& \
 DEBIAN_FRONTEND=noninteractive apt-get -y autoremove && \
 DEBIAN_FRONTEND=noninteractive git clone https://github.com/syl20bnr/spacemacs ~/.emacs.d && \
```

镜像build完成,启动emacs报错:
`Debugger entered--Lisp error:(Wrong-type-argument stringp nil)`

打开`--debug-info`进行调试,出错的堆栈信息如下:

```
string-match("\\(fish\\|t?csh\\)$" nil)
exec-path-from-shell--standard-shell-p(nil)
exec-path-from-shell-printf("%S\\000%s" ("${PATH-ad3306701bb5eb9f528b5c1b34485248}" "${MANPYTHON-ad3306701bb5eb9f528b5c1b34485248}"))
exec-path-from-shell-getenvs(("PATH" "MANPATH"))
exec-path-from-shell-copy-envs(("PATH" "MANPATH"))
exec-path-from-shell-initialize()
(progn (exec-path-from-shell-initialize))
...
```

# 分析

Emacs本质上是个操作系统,它有自己的环境变量.

所以为了让它可以使用宿主的`shell`,首先需要确保宿主和Emacs自身环境变量的一致性.

`exec-path-from-shell` 就是一这么个`GNU Emacs`库,它将宿主的关键`SHELL`环境复制到EMACS的环境变量里,从而确保Emacs可以正常调用宿主机的`BASH`.

查看`exec-path-from-shell-printf`的代码:

```lisp
(defun exec-path-from-shell-printf (str &optional args)
  "Return the result of printing STR in the user's shell.
  Executes $SHELL as interactive login shell.
  STR is inserted literally in a single-quoted argument to printf,
  and may therefore contain backslashed escape sequences understood
  by printf.
  ARGS is an optional list of args which will be inserted by printf
  in place of any % placeholders in STR.  ARGS are not automatically
  shell-escaped, so they may contain $ etc."
  (let* ((printf-bin (or (executable-find "printf") "printf"))
         (printf-command
          (concat printf-bin
                  " '__RESULT\\000" str "' "
                  (mapconcat #'exec-path-from-shell--double-quote args " ")))
         (shell-args (append exec-path-from-shell-arguments
                             (list "-c"
                                   (if (exec-path-from-shell--standard-shell-p (getenv "SHELL"))
                                       printf-command
                                     (concat "sh -c " (shell-quote-argument printf-command))))))
         (shell (getenv "SHELL")))
```

结合出错堆栈分析,问题基本可以定位,即: `(getenv "SHELL")`去获取”SHELL”的环境变量,返回为空.

接着来查看`getenv`方法,它通过调用`getenv-internal`用来获取系统`environment`的变量.

查看系统环境变量,`env|grep SHELL`,果然无值.

那么只需要设置Docker-Ubuntu16.04容器的`SHELL`环境变量到`env`里就可以了.

```
echo "export SHELL=/bin/bash" >> ~/.bashrc
source ~/.bashrc
```

运行`emacs`,问题解决.
此时Dockerfile可以配置如下:

```bash
...
RUN \
 DEBIAN_FRONTEND=noninteractive apt-get update && \
 DEBIAN_FRONTEND=noninteractive apt-get -y install wget curl git emacs&& \
 DEBIAN_FRONTEND=noninteractive apt-get -y autoremove && \
 DEBIAN_FRONTEND=noninteractive git clone https://github.com/syl20bnr/spacemacs ~/.emacs.d && \
 DEBIAN_FRONTEND=noninteractive echo "export SHELL=/bin/bash" >> ~/.bashrc && \
 ...
```

# 疑问

为什么官方Ubuntu Docker镜像没有将SHELL加到环境变量里?

1.  有一点很明确,Docker不同于虚拟机,它的镜像文件确实需要保持精简,只需为容器保留必要的linux核心功能就可以了.

    Docker官方也给出了,`-env`的选项命令,用于自行进行环境变量配置.
    在Dockerfile中也可以使用`ENV`进行环境变量的配置,我们的Dockerfile可以写成如下的形式.

    ```bash
    ...
    RUN \
     ...
     DEBIAN_FRONTEND=noninteractive ENV SHELL /bin/bash
     ...
    ```

2.  那么,这个Docker镜像连`$SHELL`,`$BASH`等环境变量都省略了,是否还有其他功能被阉割了呢?

    确实是的,问题还很多.

    比如Docker下的ubuntu有一个很大的问题,它的`PID1`是`bash`!

    ```bash
    root@0d9e754629e0:/# ps
      PID TTY          TIME CMD
        1 ?        00:00:00 bash
       37 ?        00:00:00 ps
    ```

    而完整的系统应该是`init`

    ```bash
    lizorn@lizorn:/etc$ ps aux
    USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
    root         1  0.0  0.0 185604  6388 ?        Ss   10:39   0:01 /sbin/init splash
    root         2  0.0  0.0      0     0 ?        S    10:39   0:00 [kthreadd]
    ```

    `PID1 init`是系统所有进程的祖先,同时它还负责接收和处理僵尸进程,[the PID 1 zombie reaping problem](https://blog.phusion.nl/2015/01/20/docker-and-the-pid-1-zombie-reaping-problem/).

    这个问题会导致docker-ubuntu系统有可能产生无法回收的僵尸进程,造成内存孤岛,浪费系统性能.需要额外的补丁程序来完成`PID1`任务的回收工作,修复该问题的轮子已经具备,你可以直接使用[phusion的baseimage](https://github.com/phusion/baseimage-docker)来制作Docker基础镜像文件.

# 附录: linux 环境变量

## shell变量&用户变量

-   set:显示当前shell的变量
-   env:显示当前用户的环境变量
-   export可将当前shell变量导出成用户变量.

`set`下的环境变量不等同于`env`下的用户变量,两者是有区分的,因为一个用户可以有多个`SHELL`,如`fish`,`tsh`等.

## linux shell环境初始化流程

Linux系统登录，`bash`其初始化过程依次加载如下文件(文件不存在就跳过):

`/etc/profile`\->`/etc/profile.d`~`/.bash_profile`\->`~/.bashrc`\->`~/.bash_logout`

-   /etc/profile: 系统级用户环境变量.当用户第一次登录时,该文件被加载.设置命令行提示符`$PS`,并从/etc/profile.d目录的配置文件中搜集shell的设置.
-   /etc/bashrc: 系统级用户环境变量.当bash shell被打开时加载.
-   ~/.bash\_profile: 用户级环境变量.用户登录时加载,默认情况下,他设置一些环境变量,执行用户的.bashrc文件.
-   ~/.bashrc: 用户级环境变量.该文件包含专用于你的bash shell的bash信息,当登录时以及每次打开新的shell时加载该文件.
-   ~/.bash\_logout:当每次退出系统(退出bash shell)时执行该文件.
