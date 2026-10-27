---
title: "键盘键位映射"
date: 2016-11-01T08:21:30+08:00
tags: ["keymap"]
categories: ["杂货摊"]
draft: false
---
自从`HHKB`键盘败家卖了后,其他键盘一直用着不爽,只能稍微设置下,聊以自慰.

首先,`capslock`必须死,这么好的位置居然被这废材占据着.

# linux

## capslock->ctrl

`sudo emacs /etc/default/keyboard`

修改下面这一行：

`XKBOPTIONS="ctrl:nocaps"`

重新配置系统键盘，全部选默认：

`sudo dpkg-reconfigure keyboard-configuration`

# windows

## capslock->ctrl

[Ctrl2Cap](https://technet.microsoft.com/en-us/sysinternals/bb897578.aspx?f=255&MSPPError=-2147217396)

# mac

## capslock->ctrl

打开`System Preferences` → `Keyboard` → `Modifier Keys`
