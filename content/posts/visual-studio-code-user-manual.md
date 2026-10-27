---
title: "vs code 使用指南"
date: 2016-04-05T00:00:00+08:00
aliases: ["/2016/04/05/visual-studio-code-user-manual/"]
tags: ["IDE"]
categories: ["开发者工具"]
draft: false
---
# 基础

## 设置

### 字体设置

> File->Preferences->User Settings 添加 “editor.fontSize”: 16

### 编码设置

> User Settings 查看 Workspace Settings 的 files.encoding

## 命令面板

-   `CMD+SHIFT+P` 打开命令面板
-   `CMD+P` 通用命令面板.查找文件或者进行符号查找
    -   `?`: 查看命令行列表
    -   `#`: 查找工程内匹配符号
    -   `@`: 表示符号查找,接`:`进行删选符号查找.(`CMD+SHIFT+O`)
    -   `!`: 显示warnning和error.(`CMD+SHIFT+M`)
-   `CMD+Shift+F`:跨文件搜索
-   `CMD+G`:跳转到行
-   `CMD+TAB`: 历史文件切换

## 编辑器

-   `CMD+SHIFT+N`: 打开新的编辑器窗口
-   `CMD+N`: 创建新文件
-   `CMD+\`: 分割编辑窗口. ‘Cmd’+ `1`/`2`/`3`进行切换
-   `CMD+B`: 切换侧边栏

# 快捷键

[https://code.visualstudio.com/docs/customization/keybindings](https://code.visualstudio.com/docs/customization/keybindings)

# 智能编辑

-   `CMD+.`: 快速修复

[更多](http://johnpapa.net/intellisense-witha-visual-studio-code/)

# 重构

-   `OPT+UPARROW/DOWNARROW`: 上下移动行
-   `F8`: 移动到下一个’Warning’或’Error’
-   `F12`/`OPTION+F12`: 跳转到定义
-   `SHIFT F12`: 查找所有的引用
-   `CMD+F2`/`CMD+D`: 匹配选择,本地重构
-   `Click + OPTION`: 点击选择,本地重构
-   `F2`:文件内重命名
-   `Alt+Shift+F`: 格式化

# 调试

## Debug快捷键

-   Continue / Pause F5
-   Step Over F10
-   Step Into F11
-   Step Out Shift+F11
-   Restart Ctrl+Shift+F5
-   Stop Shift+F5

[更多](https://code.visualstudio.com/docs/editor/debugging)

# 版本管理

## COMMIT

`CMD+SHIFT+G`进入git版本管理

-   `CMD+ENTER`:输入message后commit

## 切换分支

`CMD+P` 输入 `git checkout *`

## 冲突管理

## 版本库

[Visual Studio Team Services](https://www.visualstudio.com/products/visual-studio-team-services-vs)
