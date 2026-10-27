---
title: "Angularjs2 5分钟入门手册(ts)"
date: 2016-06-06T00:00:00+08:00
tags: ["前端", "Angularjs2"]
categories: ["开发者手册"]
draft: false
---
*译者注:仅是官方文档的翻译.5分钟教程,5分钟入门,过易,本不想译,久未译,遂译.*

我们将基于TypeScript来构建一个超级简单的Anglarjs2应用，同时为后续的APP应用开发,搭建好Angularjs2的开发环境.

## 在线示例

[在线示例](https://angular.io/resources/live-examples/quickstart/ts/plnkr.html)

## 开始构建APP!

### 前提: 安装 Node.js

[nodejs官网](https://nodejs.org/)

### 步骤1: 创建和配置工程

-   (a)创造工程文件夹
-   (b)增加一个包定义并配置文件
-   (c)安装包

#### (a) 创建文件

```
mkdir angular2-quickstart
cd    angular2-quickstart
```

#### (b) 增加包定义和配置文件

-   `package.json` NPM的包配置文件, 列举了QuickStart依赖的包并定义了一些有用的脚本.
-   `tsconfig.json` TypeScript的编译器配置文件
-   `typings.json` TypeScript标示定义文件
-   `systemjs.config.js` SystemJS配置文件

*package.json:*

```
{
  "name": "angular2-quickstart",
  "version": "1.0.0",
  "scripts": {
    "start": "tsc && concurrently \"npm run tsc:w\" \"npm run lite\" ",
    "lite": "lite-server",
    "postinstall": "typings install",
    "tsc": "tsc",
    "tsc:w": "tsc -w",
    "typings": "typings"
  },
  "license": "ISC",
  "dependencies": {
    "@angular/common":  "2.0.0-rc.2",
    "@angular/compiler":  "2.0.0-rc.2",
    "@angular/core":  "2.0.0-rc.2",
    "@angular/http":  "2.0.0-rc.2",
    "@angular/platform-browser":  "2.0.0-rc.2",
    "@angular/platform-browser-dynamic":  "2.0.0-rc.2",
    "@angular/router":  "2.0.0-rc.2",
    "@angular/router-deprecated":  "2.0.0-rc.2",
    "@angular/upgrade":  "2.0.0-rc.2",
    "systemjs": "0.19.27",
    "core-js": "^2.4.0",
    "reflect-metadata": "^0.1.3",
    "rxjs": "5.0.0-beta.6",
    "zone.js": "^0.6.12",
    "angular2-in-memory-web-api": "0.0.12",
    "bootstrap": "^3.3.6"
  },
  "devDependencies": {
    "concurrently": "^2.0.0",
    "lite-server": "^2.2.0",
    "typescript": "^1.8.10",
    "typings":"^1.0.4"
  }
}
```

*tsconfig.json:*

```
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "moduleResolution": "node",
    "sourceMap": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "removeComments": false,
    "noImplicitAny": false
  }
}
```

*typings.json:*

```
{
  "globalDependencies": {
    "core-js": "registry:dt/core-js#0.0.0+20160317120654",
    "jasmine": "registry:dt/jasmine#2.2.0+20160505161446",
    "node": "registry:dt/node#4.0.0+20160509154515"
  }
}
```

*systemjs.config.js:*

```
/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function(global) {
  // map tells the System loader where to look for things
  var map = {
    'app':                        'app', // 'dist',
    '@angular':                   'node_modules/@angular',
    'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
    'rxjs':                       'node_modules/rxjs'
  };
  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app':                        { main: 'main.js',  defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
  };
  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'router-deprecated',
    'upgrade',
  ];
  // Individual files (~300 requests):
  function packIndex(pkgName) {
    packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
  }
  // Bundled (~40 requests):
  function packUmd(pkgName) {
    packages['@angular/'+pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
  }
  // Most environments should use UMD; some (Karma) need the individual index files
  var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
  // Add package entries for angular packages
  ngPackageNames.forEach(setPackageConfig);
  var config = {
    map: map,
    packages: packages
  };
  System.config(config);
})(this);
```

#### (c) 安装依赖包

使用`npm`安装`package.json`列出的依赖包.

`npm install`

> 如果`typings`文件夹没有在`npm install`后显示,则需手动安装.
> `npm run typings install`

### 步骤2:第一个Aungular组件

在工程跟目录下**创建一个子文件夹`APP`**

`mkdir app`

**增加一个组件文件`app/app.component.ts`** 内容如下:

```
import { Component } from '@angular/core';
@Component({
  selector: 'my-app',
  template: '<h1>My First Angular 2 App</h1>'
})
export class AppComponent { }
```

*AppComponent是应用的根组件.*
每一个Angular应用至少有一个*根组件*,通常都命名为`AppComponent`,组件是Angular应用最基础的构建模块.组件通过其关联的模板控制着视图的展示.

本快速入门教程里的示例虽然只是一个超级简单的组件,但已经包含了每一个组件的基本结构要素.

-   `import` 引用想要的模块.
-   `@Component` 装饰器告诉Angular这个组件的模板以及如何构建组件
-   组件类通过模板来控制视图的展示和行为

#### Import

Angular的应用都是模块化的,他们由许多不同作用的文件组成.Angular本身就是是一个包含构建应用所需功能的模块库.

当我们需要某个模块或者库的时候,就import它.

示例中我们从Angular 2核心模块引入Component,这样就可以使用`@Component`装饰器了.

`import { Component } from '@angular/core';`

#### @Component decorator

`Component`是一个注释器函数,应用这类元数据对象函数需要在前面加个`@`符号.`@Component`是一个装饰器:

```
@Component({
  selector: 'my-app',
  template: '<h1>My First Angular 2 App</h1>'
})
```

这个元数据对象有两个属性,`selector`和`template`.

-   **selector**声明了一个简单的CSS选择器用来表示代表组件的HTML元素.*这个组件的HTML元素名为`my-app`,Angular创建`AppComponent`实例并展示到承载这个组件的HTML的每一个`my-app`元素里*

-   **template**声明组件相关的模板,决定了Angular如何渲染组件.

#### 组件类

文件的最后是一个`AppComponent`类.

`export class AppComponent { }`

由于本入门示例中不存在需要做的功能,目前`AppComponent`类是空的,以后我们想构建应用的时候,需要扩充类的特性和应用逻辑.

### 步骤3:增加`main.ts`

现在我们需要告诉Angular要加载根组件了,创建`app/main.ts`,内容如下:

```
import { bootstrap }    from '@angular/platform-browser-dynamic';
import { AppComponent } from './app.component';
bootstrap(AppComponent);
```

要启动应用,我们引入了两样东西:

1.  Angular的浏览器`bootstrap`功能
2.  应用的根组件`AppComponent`

然后调用`bootstrap(AppComponent)`,**Bootstrapping是平台的一个特性**.

注意到我们从`@angular/platform-browser-dynamic`而不是从`@angular/core`引入`bootstrap`功能.

Bootstrapping不属于核心库,这是因为可能会有多种方式启动Angular应用(没错,移动端/桌面/web端等等).当然,大部分的应用都是从浏览器库调用bootstrap方法的.但也有可能从不同的环境里加载组件,比如从`Apache Cordova`或者`NativeScript`加载,并运行在移动设备上.我们也有可能希望从服务器渲染第一个页面来改进性能或者加强`SEO`.这就需要有不同种类的bootstrap.

\_\_为什么要分离`main.ts`和app组件文件
*这只是一个简单的入门示例,现在`main.ts`和app组件文件都很小,我们确实可以灵活的合并或者拆分它们.
但我们想阐述一个更合理的Angular应用架构.App引导程序在不同的环境里多种多样,模块化分离文件,可以让测试变的更容易些,可以对某个组件进行单元测试,而不需要启动整个应用.*

### 步骤4:增加`index.html`

在工程根目录里创建一个`index.html`:

```
<html>
  <head>
    <title>Angular 2 QuickStart</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="styles.css">
    <!-- 1. Load libraries -->
     <!-- Polyfill(s) for older browsers -->
    <script src="node_modules/core-js/client/shim.min.js"></script>
    <script src="node_modules/zone.js/dist/zone.js"></script>
    <script src="node_modules/reflect-metadata/Reflect.js"></script>
    <script src="node_modules/systemjs/dist/system.src.js"></script>
    <!-- 2. Configure SystemJS -->
    <script src="systemjs.config.js"></script>
    <script>
      System.import('app').catch(function(err){ console.error(err); });
    </script>
  </head>
  <!-- 3. Display the application -->
  <body>
    <my-app>Loading...</my-app>
  </body>
</html>
```

这个`index.html`文件定义了承载这个应用的web页.HTML里的关键部分有:

1.  JavaScript库
2.  SystemJS的配置文件,一个导入app模块引用`main`文件的脚本
3.  在里的标签,这是我们这个应用渲染位置.

##### 库

我们加载以下脚本:

```
<!-- Polyfill(s) for older browsers -->
<script src="node_modules/core-js/client/shim.min.js"></script>
<script src="node_modules/zone.js/dist/zone.js"></script>
<script src="node_modules/reflect-metadata/Reflect.js"></script>
<script src="node_modules/systemjs/dist/system.src.js"></script>
```

首先是`core-js`,它是一个ES2015(ES6)的`shim`,这个猴子补丁替换全局上下文(window)的ES6功能要素.接着是`Angular2`,`zone.js`,`reflect-metadata`的plyfills,这样这些功能就可以兼容老的浏览器了.最后是用于模块加载的库`SystemJS`.

##### SystemJS

入门教程使用SystemJS加载应用和库模块.之前我们已经将`systemjs.config.js`文件加入到了工程根目录了.基本上可以用`webpack`替换,不过`SystemJS`已经是个好选择了,最终选择权这个取决于你.

所有的模块加载都需要有配置,所有的加载配置都会随着结构增加或者考虑性能等而变的复杂.我们建议在你精通加载器的配置,SystemJS配置[教程](https://github.com/systemjs/systemjs/blob/master/docs/config-api.md).

有了这些意识后,我们看看`systemjs.config.js`做了些什么?首先,我们创建一个map告诉SystemJS去哪里查找需要引入的模块.然后,将所有的包注册到SystemJS,包括:工程依赖包和应用包,`app`包.
`app`包告诉SystemJS如何从`app/`文件目录里请求一个模块.
本示例使用TypeScript导入：

```
import { AppComponent } from './app.component';
```

注意模块名不需要文件扩展名，SystemJS根据配置文件设置文件的默认扩展名为js.

System.import告诉SystemJS导入main文件；main是Aangular应用启动入口，我们可以抓取并记录启动时候的错误信息。
所有其他的模块都由import导入.

Angular调用main.ts里的bootstrap函数，它读取AppComponent的元数据，找到my-app选择器，定位my-app元素标签，并将组件转染到这些标签里.

#### 增加样式

样式并不是必须的但样式会让应用更加美观，在index.html里假设有个层级样式styles.css。
创建一个styles.css文件在工程根目录，内容如下：

```
h1 {
  color: #369;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 250%;
}
body {
  margin: 2em;
}

 /*
  * See https://github.com/angular/angular.io/blob/master/public/docs/_examples/styles.css
  * for the full set of master styles used by the documentation samples
  */
```

### 步骤5：构建和运行APP！

打开一个终端窗口，敲入如下命令：
`npm start`
这个命令执行了两条node进程：

1.  及时监控进行TypeScript编
2.  lite-server静态服务器加载index.html到浏览器，当应用文件有修改时实时刷新浏览器

浏览器上就会打开并显示:
![](/res/img/angularjs2/my-first-app.png)

## wrap up

我们最终的工程文件结构如下：

```
--angular2-quickstart

----app

------app.component.ts

------main.ts

----node_modules ...

----typings ...

----index.html

----package.json

----styles.css

----systemjs.config.js

----tsconfig.json

----typings.json
```

[打包下载](https://github.com/angular/quickstart/blob/master/README.md)

## 下一步？

我们第一个应用没有太多的功能，只是最基础的angular2的”Hello, World”应用。
我们写了一个简单的angular组件，构建了一个简单的index.html,并通过一个静态文件服务器加载它.这些就是这个 “Hello, World” app的全部了

后续教程 [Tour of Heroes Tutorial!](https://angular.io/docs/ts/latest/tutorial/)
