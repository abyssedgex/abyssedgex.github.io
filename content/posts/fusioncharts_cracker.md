---
title: "FusionCharts Suite XT去水印"
date: 2016-03-10T00:00:00+08:00
aliases: ["/2016/03/10/fusioncharts_cracker/"]
tags: ["FusionCharts"]
categories: ["开发者手册"]
draft: false
---
闲来无事，挖掘了下单位的测试数据，分析生成pareto，用于持续改进,
发现Fusioncharts有现成的模块可以用，向来不想重复造轮子，下载开袋即食，见有水印，遂去之，再此奉上。

**拿来主义点**[此](http://download.csdn.net/download/anzor/8663635)

### 授人以鱼不如授人以渔。

1.  打开fusioncharts.js
2.  搜索fusioncharts.com ->

```javascript
<span style="white-space:pre">
</span>Q="http://www.fusioncharts.com?BS=FCHSEvalMark&utm_source=FCS_trial&pver="+m.escape(d.core.version)
```

置空->Q=””

1.  搜索Trial->

```javascript
<span style="white-space:pre">
</span>CREDIT_STRING:"FusionCharts XT Trial"
```

置空->CREDIT\_STRING:””
