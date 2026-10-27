---
title: "Ubuntu的爱"
date: 2016-03-06T00:00:00+08:00
aliases: ["/2016/03/06/ubuntu_env/"]
tags: ["UBuntu", "开发环境"]
categories: ["开发者手册"]
draft: false
---
今年听闻ubuntu要发布16 LTS，于是win10弃坑，兜兜转转还是再次用回了自由的ubuntu系统，环境记录下。几个ide在ubuntu依然是不尽人意的，要解放鼠标还是得定制，得折腾，最终还不如使用mac或者emacs/vim等。

## 基础设置

### 设置快捷键

> System Settings -> Keyboard -> Shortcuts -> Launcher -> Launcher terminal，设成Super(Win) + R.

### 设置字体

> System Settings——》Universal Access——》Large Text——》on

### 输入法

方式1. 自带的ibus中文输入不是很好用，使用搜狗输入法：[http://pinyin.sogou.com/linux/](http://pinyin.sogou.com/linux/)
在Language Support将输入法系统切换到fcitx，在text entry中隐藏掉ibus界面。

方式2. emacs /etc/apt/sources.list.d/ubuntukylin.list文件，加入ubuntu kylin的apt源

```bash
deb http://archive.ubuntukylin.com:10006/ubuntukylin trusty main
sudo apt-get update
sudo apt-get install sogoupinyin
```

### 浏览器

`wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb`

### 安装迅雷：

[XwareDesktop](https://github.com/Xinkai/XwareDesktop)

### 压缩工具

`sudo apt-get install unrar`

### 安装jdk

```
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
sudo apt-get install oracle-java8-installer
sudo update-alternatives --config java
```

### 安装CMaker

`sudo apt-get install cmake qtcreator`

## python

alternatives机制实现python2和pyhton3的共享和切换

```
sudo apt-get install python3-pip
sudo update-alternatives --install /usr/bin/python python /usr/bin/python2 100
sudo update-alternatives --install /usr/bin/python python /usr/bin/python3 150
```

默认使用python3可能会导致ubuntu软件中心异常，此时需要切换到python2.

### 其他

ruby etc.

```
sudo apt-get install ruby rake
gem sources --remove https://rubygems.org/
gem sources -a http://ruby.taobao.org/
gem install jekyll rdiscount
```

## IDE

现在编译器之多，眼花缭乱，曾几何时一直都是捧着source insight，一做就是6年，呜呼哀哉.

### emacs

`sudo apt-get install emacs24`
[配置](https://github.com/purcell/emacs.d)

### sublime text

涉猎的语言太多(c/c++/java/python/php/ruby/javascript/c#/swift/lisp etc.)，实施的机会又越来越少.痛定思痛，决定梳理专精一门。

#### 安装

```
sudo add-apt-repository ppa:webupd8team/sublime-text-3
sudo apt-get update
sudo apt-get install sublime-text
```

#### 配置

1.  **package control**.
    安装包管理器，view->show console执行以下代码.

    ```python
    import urllib2,os;pf='Package Control.sublime-package';ipp=sublime.installed_packages_path();os.makedirs(ipp) if not os.path.exists(ipp) else None;open(os.path.join(ipp,pf),'wb').write(urllib2.urlopen('http://sublime.wbond.net/'+pf.replace(' ','%20')).read())
    ```

    以下的插件均用ctrl+shift+p安装。

2.  **SublimeREPL**

3.  **SideBarEnhancements**

> 扩展了侧边栏中菜单选项的数量，从而提升你的工作效率

1.  **Anaconda**

    > Anaconda 是一个终极 Python 插件。它为 ST3 增添了多项 IDE 类似的功能，例如：
    >
    > -   Autocompletion 自动完成，该选项默认开启，同时提供多种配置选项。
    >     Code linting 使用支持 pep8 标准的 PyLint 或者 PyFlakes。因为我个人使用的是另外的 linting 工具，所以我会在 Anaconda 的配置文件 Anaconda.sublime-settings 中将 linting 完全禁用。操作如下: Sublime > Preferences > Package Settings > Anaconda > Settings – User： {“anaconda\_linting”: false}
    > -   McCabe code complexity checker 让你可以在特定的文件中使用 [软件复杂度检查](https://en.wikipedia.org/wiki/Cyclomatic_complexity).
    > -   Goto Definitions 能够在你的整个工程中查找并且显示任意一个变量，函数，或者类的定义。
    > -   Find Usage 能够快速的查找某个变量，函数或者类在某个特定文件中的什么地方被使用了。
    > -   Show Documentation： 能够显示一个函数或者类的说明性字符串

2.  **Djaneiro**

    > Django.

3.  **SublimeLinter**

    > 代码静态检查工具框架(linter),对于 Python 的代码静态检查器，我使用 [SublimeLinter-pep8](https://packagecontrol.io/packages/SublimeLinter-pep8)。
    > 其他还有SublimeLinter-jshint, SublimeLinter-pyyaml, SublimeLinter-csslint，SublimeLinter-html-tidy，以及 SublimeLinter-json。

4.  **PEP8 Autoformat**

    > 按PEP8自动格式化代码的。快捷键 CTRL+SHIFT+R 自动格式化python代码.
    > 常用配置

    ```
    {
        "auto_complete": false,
        "caret_style": "solid",
        "ensure_newline_at_eof_on_save": true,
        "find_selected_text": true,
        "font_size": 11.0,
        "highlight_modified_tabs": true,
        "line_padding_bottom": 0,
        "line_padding_top": 0,
        "scroll_past_end": false,
        "show_minimap": false,
        "tab_size": 4,
        "translate_tabs_to_spaces": true,
        "trim_trailing_white_space_on_save": true,
        "wide_caret": true,
        "word_wrap": true,
    }
    ```

5.  **GitGutter**

6.  **Emmet**

    > 大名鼎鼎的Emmet

7.  **Markdown Preview**

    > markdown 预览

### atom

[下载](https://atom.io/), github血统，偶尔用来写markdown(shift + ctrl + m)

### pycharm

[下载](https://www.jetbrains.com/pycharm/)，python全栈ide.
注册时选择 License server, 填写[http://idea.lanyus.com](http://idea.lanyus.com)
