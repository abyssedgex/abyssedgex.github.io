---
title: "python spider intruduce"
date: 2018-05-22T16:55:00+08:00
tags: ["爬虫", "python", "spider"]
categories: ["开发者手册"]
draft: false
---
爬虫入门简单，精通也不易。虽然爬虫是Python的看家本领，网上也有大量的教程，但是大部分文章所涉及的内容都的粗浅，没有系统性的介绍，也不具备工程实战性。遂系统性的梳理一下。

# 什么是爬虫

`爬虫`（又被称为网页蜘蛛，网络机器人，在FOAF社区中间，更经常的称为网页追逐者），是一种按照一定的规则，自动地抓取万维网信息的程序或者脚本。另外一些不常使用的名字还有蚂蚁、自动索引、模拟程序或者蠕虫。

如果把互联网比喻成一个蜘蛛网，Spider就是一只在网上爬来爬去的蜘蛛。网络爬虫就是根据网页的地址来寻找网页的，也就是URL。Google、baidu就是最大的爬虫，搜索引擎的数据内容都是由`网络蜘蛛`爬去网络而来。

## 什么是URL

URL:统一资源定位符(Uniform Resource Locator)，一般格式如下：

`protocol ://hostname[port]/path/[parameters][?query]#fragment`

URL的格式由三部分组成：

1.  protocol：协议，通讯协议。一般使用TCP/IP应用层协议，例如http/https/ftp/smb等等；
2.  hostname\[:port\]：主机名\[端口号\];
3.  path: 资源在主机中的具体地址，如目录和文件名等。

通常，爬虫使用`URL`来获取(Request)资源信息，并对返回内容(Response)做对应的解析和处理。返回的内容比较多样，比如`文本`、`图片`、`excel/csv`、`json/xml`、`html`等。大部分人只知道`html`爬虫也就是通常意义上的`web spider`，因为它需求广泛而且解析较简单。

# 内容解析方式

爬虫获取的数据是多样的，`Response`可能是一堆字符串也有可能是一个二进制文件，这取决于文本的编码方式；`Response`可能是结构化的（数据库、json）也有可能是非结构化的（比如图片、视频），这取决于资源的组织形式。

解析非结构化的数据，一般需要耗费大量的资源，然后训练出一个相对拟合的、结构化的模型，最后用这个模型分析返回的数据，并且这一过程可能是不断迭代的，直到达到真正的价值转移。

这里我们只找`软柿子`捏。解析软柿子一般有以下几种形式：

## XML/JSON/CSV

这类数据已经是非常结构化的数据了，并且有大量的第三方库支持，它们是烂柿子，这里就不捏了。

XML

-   [libxml](https://docs.python.org/3/library/xml.html)
-   [lxml](https://pypi.org/project/lxml/)

JSON:

-   [json](https://docs.python.org/3/library/json.html)

CSV:

-   [csv](https://docs.python.org/3/library/csv.html)
-   [excel](https://pypi.org/project/xlrd/)

## 文本

### 正则表达式

正则表达式是一个特殊的字符序列，它能帮助你方便的检查一个字符串是否与某种模式匹配。

#### 目的

给定一个正则表达式和另一个字符串，我们可以达到如下的目的：

1.  给定的字符串是否符合正则表达式的过滤逻辑（称作“匹配”）：
2.  可以通过正则表达式，从字符串中获取我们想要的特定部分。

    #### 特点

正则表达式的特点是：

1.  灵活性、逻辑性和功能性非常强；
2.  可以迅速地用极简单的方式达到字符串的复杂控制。
3.  对于刚接触的人来说，比较晦涩难懂。

#### python RE Module

```python
>>> text = "He was carefully disguised but captured quickly by police."
>>> re.findall(r"\w+ly", text)
['carefully', 'quickly']
```

-   几个特殊字符要注意:
    1、. 匹配任意除换行符“\\n”外的字符；
    2、*表示匹配前一个字符0次或无限次；
    3、+或*后跟？表示非贪婪匹配，即尽可能少的匹配，如*？重复任意次，但尽可能少重复；
    4、 .*? 表示匹配任意数量的重复，但是在能使整个匹配成功的前提下使用最少的重复。

```python
In [1]: s = 'aabab'
In [2]: import re
In [3]: re.findall(r'a\w+b',s)
Out[3]: ['aabab']
In [4]: re.findall(r'a\w+?b',s)
Out[4]: ['aab']
In [5]: re.findall(r'a\w*?b',s)
Out[5]: ['aab', 'ab']
```

其他内容见[官网](https://docs.python.org/3/library/re.html)
[正则表达式](https://www.liaoxuefeng.com/wiki/001374738125095c955c1e6d8bb493182103fac9270762a000/001386832260566c26442c671fa489ebc6fe85badda25cd000)

### HTML

`HTML`:超文本标记语言，标准通用标记语言下的一个应用。“超文本”就是指页面内可以包含图片、链接，甚至音乐、程序等非文字元素。网络爬虫主要处理的就是这种格式的文本。在python体系中，有很多自带的方法和丰富的第三方库来处理这类数据。

-   [htmlparser](https://docs.python.org/3/library/markup.html)
-   [BeautifulSoup](https://pypi.org/project/bs4/)

#### XPath

什么是 XPath?

-   XPath 使用路径表达式在 XML 文档中进行导航
-   XPath 包含一个标准函数库
-   XPath 是 XSLT 中的主要元素
-   XPath 是一个 W3C 标准

总之`XPath` 是一门在`XML`文档中查找信息的语言，它使用路径表达式来选取`XML`文档中的节点或节点集。

`XML`是`HTML`的超集合。我们也可以使用`xpath`语法来解析`html`。

##### 路径表达式

| 表达式 | 描述 |
| --- | --- |
| nodename | 选取此节点的所有子节点。 |
| / | 从根节点选取。 |
| // | 从匹配选择的当前节点选择文档中的节点，而不考虑它们的位置。 |
| . | 选取当前节点。 |
| .. | 选取当前节点的父节点。 |
| @ | 选取属性。 |

#### 示例

##### [html.parser](https://docs.python.org/3/library/html.parser.html)

htmlParser是python自带的库，可以方便的对html结构的数据做解析。

```python
from html.parser import HTMLParser
from html.entities import name2codepoint

class MyHTMLParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        print("Start tag:", tag)
        for attr in attrs:
            print("     attr:", attr)

    def handle_endtag(self, tag):
        print("End tag  :", tag)

    def handle_data(self, data):
        print("Data     :", data)

    def handle_comment(self, data):
        print("Comment  :", data)

    def handle_entityref(self, name):
        c = chr(name2codepoint[name])
        print("Named ent:", c)

    def handle_charref(self, name):
        if name.startswith('x'):
            c = chr(int(name[1:], 16))
        else:
            c = chr(int(name))
        print("Num ent  :", c)

    def handle_decl(self, data):
        print("Decl     :", data)

parser = MyHTMLParser()

parser.feed('<img src="python-logo.png" alt="The Python logo">')
```

# 爬虫入门

## 抓取网页

urllib is a package that collects several modules for working with URLs:

-   urllib.request 打开和读取URLs
-   urllib.error 包含urllib.request产生的错误，可以使用try进行捕捉处理
-   urllib.parse 解析URLs
-   urllib.robotparser 解析robots.txt文本文件

```python
# -*- coding: UTF-8 -*-
from urllib import request
import chardet

if __name__ == "__main__":
    response = request.urlopen("https://www.baidu.com/")
    html = response.read()
    charset = chardet.detect(html)
    print(charset)
    print(html)
```

## [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/index.zh.html)

`Beautiful Soup` 是一个可以从HTML或XML文件中提取数据的Python库.它能够通过你喜欢的转换器实现惯用的文档导航,查找,修改文档的方式.Beautiful Soup会帮你节省数小时甚至数天的工作时间.

```python
# coding=utf-8

import requests
from bs4 import BeautifulSoup

# 获取html文档
def get_html(url):
    """get the content of the url"""
    response = requests.get(url)
    response.encoding = 'utf-8'
    return response.text

# 获取最新的笑话
def get_latest_joker(html):
    """get the last joke of the html"""
    soup = BeautifulSoup(html, "html.parser")
    joke_content = soup.select('div.content')[0].get_text()
    return joke_content

# 获取笑话
def get_joke_contents(html):
    """get the joke of the html"""
    joke_contents = []
    soup = BeautifulSoup(html, "html.parser")
    for content in soup.select('div.content'):
        joke_contents.append(content.get_text())
    # joke_content = soup.select('div.content')[1].get_text()
    return joke_contents

if __name__=="__main__":
    url_joke = "https://www.qiushibaike.com"
    html = get_html(url_joke)
    joke_contents = get_latest_joker(html)
    print(joke_contents)
```

### BS解析器

| 解析器 | 使用方法 | 优势 | 劣势 |
| --- | --- | --- | --- |
| Python标准库 | BeautifulSoup(markup, “html.parser”) | Python的内置标准库、执行速度适中、文档容错能力强 | Python 2.7.3 or 3.2.2)前 的版本中文档容错能力差 |
| BeautifulSoup(markup, “xml”) | BeautifulSoup(markup, “lxml”) | 速度快、唯一支持XML的解析器 | 需要安装C语言库 |
| html5lib | BeautifulSoup(markup, “html5lib”) | 最好的容错性、以浏览器的方式解析文档、生成HTML5格式的文档 | 速度慢 |

# 爬虫框架

## [Scrapy](https://scrapy.org/)

Scrapy，Python开发的一个快速,高层次的屏幕抓取和web抓取框架，用于抓取web站点并从页面中提取结构化的数据。Scrapy用途广泛，可以用于数据挖掘、监测和自动化测试。

### 架构

![](/res/img/spider/scrapy_architecture.png)

-   **引擎(Scrapy)**
    用来处理整个系统的数据流处理, 触发事务(框架核心)
-   **调度器(Scheduler)**
    用来接受引擎发过来的请求, 压入队列中, 并在引擎再次请求的时候返回. 可以想像成一个URL（抓取网页的网址或者说是链接）的优先队列, 由它来决定下一个要抓取的网址是什么, 同时去除重复的网址
-   **下载器(Downloader)**
    用于下载网页内容, 并将网页内容返回给蜘蛛(Scrapy下载器是建立在twisted这个高效的异步模型上的)
-   **爬虫(Spiders)**
    爬虫是主要干活的, 用于从特定的网页中提取自己需要的信息, 即所谓的实体(Item)。用户也可以从中提取出链接,让Scrapy继续抓取下一个页面
-   **项目管道(Pipeline)**
    负责处理爬虫从网页中抽取的实体，主要的功能是持久化实体、验证实体的有效性、清除不需要的信息。当页面被爬虫解析后，将被发送到项目管道，并经过几个特定的次序处理数据。
-   **下载器中间件(Downloader Middlewares)**
    位于Scrapy引擎和下载器之间的框架，主要是处理Scrapy引擎与下载器之间的请求及响应。
-   **爬虫中间件(Spider Middlewares)**
    介于Scrapy引擎和爬虫之间的框架，主要工作是处理蜘蛛的响应输入和请求输出。
-   **调度中间件(Scheduler Middewares)**
    介于Scrapy引擎和调度之间的中间件，从Scrapy引擎发送到调度的请求和响应。

### 运行流程

1.  引擎从调度器中取出一个链接(URL)用于接下来的抓取
2.  引擎把URL封装成一个请求(Request)传给下载器
3.  下载器把资源下载下来，并封装成应答包(Response)
4.  爬虫解析Response
5.  解析出实体（Item）,则交给实体管道进行进一步的处理
6.  解析出的是链接（URL）,则把URL交给调度器等待抓取

### 教程

无他，[官网](https://docs.scrapy.org/en/latest/intro/tutorial.html)

### 示例

爬取`有品质`的网站的数据相对简单（比如`知乎`、`51job`、`豆瓣`等等），它们的前端页面的元素的命名相对比较规范。大厂的页面反而好解析，而且网上有大量的实例，这里我们来爬取一些技术比较落后的网站，比如爬取[宁波新楼盘数据](https://newhouse.cnnbfdc.com/projects)。

#### 步骤

1.  创建工程： `scrapy startproject tutorial`
2.  创建爬虫:

    ```
    cd tutorial
    scrapy genspider nbnewhouse cnnbfdc.com
    ```

3.  爬取数据: `scrapy crawl nbnewhouse`

#### scrapy shell

可以在shell内分析网站，将xpath或css语句调试好。

```
scrapy shell https://newhouse.cnnbfdc.com/projects
>>> response.xpath("//div[@class='views-row']")
[]
>>> response.xpath("//div[@class='item-list']")
[<Selector xpath="//div[@class='item-list']" data='<div class="item-list"><ul class="faceta'>, <Selector xpath="//div[@class='item-list']" data='<div class="item-list"><ul class="faceta'>, <Selector xpath="//div[@class='item-list']" data='<div class="item-list"><ul class="faceta'>, <Selector xpath="//div[@class='item-list']" data='<div class="item-list"><ul class="faceta'>, <Selector xpath="//div[@class='item-list']" data='<div class="item-list"><ul class="search'>, <Selector xpath="//div[@class='item-list']" data='<div class="item-list">    <ul>         '>, <Selector xpath="//div[@class='item-list']" data='<div class="item-list"><ul class="pager"'>]
>>> response.xpath("//div[@class='item-list']")[5].css('li')
[<Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-1 views-r'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-2 views-r'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-3 views-r'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-4 views-r'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-5 views-r'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-6 views-r'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-7 views-r'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-8 views-r'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-9 views-r'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-10 views-'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-11 views-'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-12 views-'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-13 views-'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-14 views-'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-15 views-'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-16 views-'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-17 views-'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-18 views-'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-19 views-'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-20 views-'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-21 views-'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-22 views-'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-23 views-'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-24 views-'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-25 views-'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-26 views-'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-27 views-'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-28 views-'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-29 views-'>, <Selector xpath='descendant-or-self::li' data='<li class="views-row views-row-30 views-'>]
```

#### code

-   items.py

    ```python
    class TutorialItem(scrapy.Item):
        # define the fields for your item here like:
        # name = scrapy.Field()
        name = scrapy.Field()
        href = scrapy.Field()
        lic = scrapy.Field()
        address = scrapy.Field()
        developer = scrapy.Field()
        type = scrapy.Field()
    ```

-   nbnewhouse.py

    ```python
    # -*- coding: utf-8 -*-
    import scrapy
    from ..items import TutorialItem
    class NbnewhouseSpider(scrapy.Spider):
        name = 'nbnewhouse'
        allowed_domains = ['cnnbfdc.com']
        start_urls = ['http://cnnbfdc.com/']
        base_url = 'https://newhouse.cnnbfdc.com/projects/'
        def start_requests(self):

            urls = []
            page = 6
            for i in range(page):
                urls.append(NbnewhouseSpider.base_url + 'projects?page=%s' % i)

            for url in urls:
                yield scrapy.Request(url=url, callback=self.parse)

        def parse(self, response):
            projects = response.xpath("//div[@class='group-right']")
            for item in projects:
                tutorialItem = TutorialItem()
                tutorialItem['name'] = item.xpath("div/a/text()").extract()[0].strip()
                tutorialItem['href'] = item.xpath('div/a/@href').extract()[0].strip()
                tutorialItem['lic'] = item.xpath("div[2]/text()").extract()[0].strip()
                tutorialItem['address'] = item.xpath("div[3]/div/div[1]/span/text()").extract()[0].strip()
                tutorialItem['developer'] = item.xpath("div[3]/div/div[2]/span/text()").extract()[0].strip()
                tutorialItem['type'] = item.xpath("div")[-1].xpath('text()').extract()
                yield tutorialItem
    ```

# [Charlotte](https://github.com/LiZoRN/Charlotte)

爬虫框架

## 安装

-   数据库
    安装mysql,默认用户名密码:root/root，对应配置修改Charlotte下的setting.py的DATABASES。

-   安装库
    安装[python3](https://www.python.org/downloads/windows/),然后进入工程根目录，执行:

    ```
    git clone https://github.com/LiZoRN/Charlotte.git
    pip install -r requirements.txt
    ```

-   迁移数据表

    ```
    python manage.py makemigrations
    python manage.py migrate
    ```

## 爬取IP代理数据(可选)

-   cd 到 spiders/ProxyIp目录，命令行下执行：

    scrapy crawl xici

-   cd 到 spiders/tools目录，清晰有效ip数据：

    python proxyip.py

## 爬取[宁波楼盘信息](http://newhouse.cnnbfdc.com)

cd 到 spiders/newhouse目录，命令行下执行：

`scrapy crawl nbnewhouse`

## 运行api服务

运行服务：

`python manage.py runserver`

api接口如下：

获取新楼盘列表：api/newhouses/?page=2&page\_size=5

```

{
"data": [
    {
        "id": 768,
        "name": "宁波金融服务中心北区E栋二期",
        "project_state": "现房状态",
        "address": "东至鼎泰路北至和济街南至规划路西至规划路",
        "districts": "江东区",
        "created": "2017-05-06T02:46:55.063256Z"
    },
    {
        "id": 1024,
        "name": "嘉恒广场(西区)",
        "project_state": "现房状态",
        "address": "江东区东部新城混合住用区C2-1地块",
        "districts": "江东区",
        "created": "2017-05-06T02:46:55.063256Z"
    }
],
"page": 2,
"total": 799
}
```

```
获取楼盘详情：api/newhouses/1/
```

{
“id”: 1,
“name”: “万科云鹭湾Ⅱ-6地块二期”,
“supervision\_bank”: “中国建设银行股份有限公司宁波江北支行”,
“supervision\_acount”: “33101983736050512431”,
“project\_state”: “期房状态”,
“address”: “”,
“dev\_company”: “宁波江北万科置业有限公司”,
“license\_authority”: “”,
“sale\_permit”: “商品房预售许可证”,
“license\_key”: “2016”,
“online\_saleable\_area”: “24198.74”,
“online\_saleable\_flats”: “450.00”,
“saleable\_area”: “372.24”,
“saleable\_flats”: “29.00”,
“sold\_area”: “23826.50”,
“sold\_flats”: “421.00”,
“residential\_area”: “0.00”,
“residential\_flats”: “0.00”,
“sold\_residential\_area”: “21188.42”,
“sold\_residential\_flats”: “214.00”,
“reserve\_area”: “0.00”,
“reserve\_flats”: “0.00”,
“saleable\_parking\_amount”: “0.00”,
“saleable\_garage\_amount”: “29.00”,
“sold\_avg\_price”: “12234.12”,
“districts”: “江北慈城”,
“contact\_phone”: “”,
“remark”: “”,
“created”: “2017-05-06T02:46:55.063256Z”
}

## todolist

### 动态脚本

### 反爬虫

### 分布式

### 搜索引擎
