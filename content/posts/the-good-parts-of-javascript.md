---
title: "Javascript精髓笔记"
date: 2016-03-12T00:00:00+08:00
aliases: ["/2016/03/12/the-good-parts-of-javascript/"]
tags: ["前端", "Javascript"]
categories: ["开发者手册"]
draft: false
---
# 语法

## 注释

-   没有用的注释比没有注释更糟糕.
-   建议避免使用`/* */`注释(可能会出现在正则表达式中),使用`//`.

## 数字

-   javascript只有一个数字类型,它在内部表示为64位的浮点数,和double类型一样.
-   负数可以用 `-` 加数字构成.
-   NaN是一个数值,它表示一个不能产生正常结果的运算结果.isNaN(number)检测NaN.

## 字符串

-   `\`是转义字符
-   Unicode是一个16位的字符集,Javascript的所有字符都是16位的.
-   Javascript没有字符类型
-   字符串是不可变的,可以通过+运算符连接其他字符串来创建一个新字符串.

# 对象

## 引用

-   对象通过引用来传递,引用不会复制

## 原型

-   每一个对象都有一个原型对象,Object.prototype是Javascript中的标配对象
-   原型连接在更新时不起作用,对某个对象做出改变时,不会触及该对象的原型
-   原型连接在检索的时候会用到,属性会从原型链上查找.
-   typeof和hasOwnProperty可以检查属性是否在对象中,后者不会检查原型链

## 枚举

-   for in该语句会遍历一个对象中的所有属性名.该枚举过程将会列出原型链上的所有属性,最常用的过滤器是hasOwnProperty方法,以及typeof来排除函数.

    ```javascript
    var name;
    for (name in sample) {
      if (typeof sampe[name] !== 'function') {
        document.writeln(name + ':' + sample[name]);
      }
    }
    ```

-   属性名出现的顺序是不确定的,通过for而不是for in才能按顺序获取属性

## 删除

delete 不会删除原型链上的属性.

## 减少全局变量的污染

Javascript可以随意的使用全局变量,全局变量削弱了程序的灵活性,应当避免使用.

# 函数

-   JS中函数是对象,每个函数创建的时候会附加两个隐藏属性:函数的上下文和实现函数行为的代码.

## 方法调用模式

当一个函数被保存为一个对象的属性时,我们称之为方法.当一个方法被调用时,this被绑定到该对象

## 函数调用模式

当一个函数并非一个对象的属性时,那么会被当做一个函数来调用,此时this被绑定到了全局变量(设计失误),可以用that方式来解决这个问题.

```javascript
myObject.double = function() {
  var that = this;
  var helper = function (
    that.value = add(that.value,that.value);
  );

  helper(); //以函数的形式调用
};

myObject.double();
doucument.writeln(myObject.vale);
```

## Apply调用模式

因为JS是一门函数式的面向对象的语言,所以函数可以拥有方法.

apply方法接收两个参数,第一个绑定给this,第二个是参数数组.

```javascript
var array = [3,4]; //构造一个包含两个数字的数组,并将它们相加.
var sum = add.apply(null,array); // sum为7
```

## 闭包

-   避免属性被非法更改
-   省去想函数名字的麻烦

## 回调

回调属于异步调用,执行上不会堵塞,事件驱动模式提高并发量和响应速度,nodejs上大量使用

## 模块

我们可以使用闭包或者函数来构造模块.模块是一个提供接口缺隐藏状态与实现的函数或对象,可以提高程序的复用性.

# 数组

-   长度: JS的数组长度无上限
-   判断一个对象是否是数组:

```javascript
  var is_array = function (value) {
  return Object.prototype.toString.apply(value) === '[object Array]';
}
```

-   方法:增加一个方法给数组

    ```javascript
    Array.method('reduce', function (f,value) {
      var i;
      for (i = 0; i < this.length; i += 1){
          value = f(this[i],value);
      }
      return value;
    })
    ```

-   制定初始值:

    ```javascript
    Array.dim = function (dimension, initial) {
      var a = [], i;
      for (i = 0; i < dimension; i += 1) {
        a [i] = initial;
      }
      return a;
    };
    ```

# 正则表达式

Javascript是一个大杂烩,许多特性继承自其他语言,语法继承自java/C,函数借鉴自Scheme,原型继承自Self.

## 示例

```javascript
var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)
(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
var url = "http://www.ora.com:80/goodparts?q#fragment";
var result = parse_url1.exec(url); //["http://www.ora.com:80/goodparts?q#fragment", "http", "//", "www.ora.com", "80", "goodparts", "q", "fragment"]
```

-   `^` : 字符串开始标记.
-   `(?:([A-Za-z]+):)`:
    -   `?:`:非捕获性匹配
    -   `+`: 匹配一次或多次
    -   `?`: 匹配零次或一次
-   `(\/{0,3})`:最少匹配0次,最多匹配3次
-   `([0-9.\-A-Za-z]+)`: 匹配主机名
-   `(?::(\d+))?`: 端口号匹配
-   `(?:\/([^?#]*))?`: 匹配出去`?`和`#`之外的所有字符.

## 结构

有两个方法来创建一个RegExp对象.

-   正则表达式字面量. 如上文示例中的正则表达式就是采用字面量的方式.

    ```javascript
    var reg=/<%[^%>]%>/g;
    ```

-   使用RegExp构造器.

    ```javascript
    var reg=new RegExp('<%[^%>]+%>','g');;
    ```

### 正则表达式标识符

| 标示 | 含义 |
| --- | --- |
| g | 全局的(匹配多次) |
| i | 大小写不敏感 |
| m | 多行 |

## 元素

构成正则表达式的元素有如下几种

-   正则表达式分支
    一个正则表达式分支包含一个或多个正则表达式序列.序列被`|`字符分隔.

    ```javascript
    "into".match(/in|int/) //in匹配成功,不会去匹配int
    ```

-   正则表达式序列
    一个正则表达式序列包含一个或多个正则表达式因子.

-   正则表达式因子
    一个正则表达式因子可以是一个字符,圆括号包含的组,字符类,或者一个转义序列.

    ```javascript
    \ / [ ] ( ) { } ? + * | . ^ $
    ```

-   正则表达式转义

-   正则表达式分组
    -   捕获型
    -   非捕获型: `?:`
    -   向前正向匹配: `?=`
    -   向前负向匹配: ‘?!’
-   正则表达式字符集: 一种指定一组字符的便利方式.

    ```javascript
    (?:a|e|i|o|u) //写成 [aeiou]
    ```

-   正则表达式字符转义:在字符类中需要被转义的特殊字符有

```
- / [ \ ] ^
```

-   正则表达式量. 用来决定因子的匹配次数. 如`{m,n}`

# 方法

## Array

### concat和push

concat方法产生一个新数组,它包含一份array的浅复制.
push和concat不同,push的参数作为单个元素添加到数组,并返回新数组的长度.

```javascript
var a = ['a', 'b', 'c'];
var b = ['x', 'y', 'z'];
var c = a.concat(b, true);// c is ['a', 'b', 'c', 'x', 'y', 'z', true]
var d = a.push(b,true) // a is ['a', 'b', 'c', ['x', 'y', 'z'], true], d is 5;
```

### join

建议用`+`,性能更优

### pop 和 shift

类似stack, 移除最后一个元素,并返回该元素.

```javascript
var a = ['a', 'b', 'c'];
var c = a.pop( ); // a is ['a', 'b'] & c is 'c'
var d = a.shift( ); // a is ['b'] & d is 'a'
```

### push 和 unshift

push将元素插入到数组末尾,unshift相反.

```javascript
var a = ['a', 'b', 'c'];
var r = a.unshift('?'); // a is ['?', 'a', 'b', 'c'], r is 4
var p = a.push('@');// a is ['?', 'a', 'b', 'c', '@'], p is 5
```

### sort 和 reverse

```javascript
var n = [4, 8, 15, 16, 23, 42,"a","b"];
var b = n.sort( ); //n和b 都是 [15, 16, 23, 4, 42, 8, "a", "b"]
var b = n.reverse( ); //n和b 都是 ["b", "a", 8, 42, 4, 23, 16, 15]
```

### slice

slice方法对array中的一段做浅复制.

```javascript
var a = ['a', 'b', 'c'];
var b = a.slice(0, 1); // b is ['a']
var c = a.slice(1); // c is ['b', 'c']
var d = a.slice(1, 2); // d is ['b']
```

### splice

array.splice(start, deleteCount, item…) : 从start开始删除deleteCount数量的元素,并用item替换

```javascript
var a = ['a', 'b', 'c'];
var r = a.splice(1, 1, 'ache', 'bug');
// a = ['a', 'ache', 'bug', 'c']
// r = ['b']
```

## Function

### apply

apply 方法调用function, 产地一个会绑定到this上的对象和一个可选的数组作为参数.

```javascript
Function.method('bind', function (that) {
    // Return a function that will call this function as
    // though it is a method of that object.
    var method = this,
    slice = Array.prototype.slice,
    args = slice.apply(arguments, [1]);
    return function ( ) {
    return method.apply(that,
    args.concat(slice.apply(arguments, [0])));
  };
});
var x = function ( ) {
  return this.value;
}.bind({value: 666});
alert(x( )); // 666
```

## Number

-   toExponential(fractionDigits):把number转换成一个指数形式的字符串.参数(0-20)控制小数点后的数字位数.

    ```javascript
    Math.PI.toExponential() //"3.141592653589793e+0"
    Math.PI.toExponential(2) //"3.14e+0"
    ```

-   toFixed(fractionDigits):把number转换成一个整数形式的字符串.参数(0-20)控制小数点后的数字位数.

    ```javascript
    Math.PI.toFixed() //"3"
    Math.PI.toFixed(2) //"3.14"
    Math.PI.toFixed(0) //"3"
    ```

-   toPrecision(precision):和toFixed类似,参数为精度.

    ```javascript
    Math.PI.toPrecision() //"3.141592653589793"
    Math.PI.toPrecision(2) //"3.1"
    ```

-   toString(radix):将number转换成为一个字符串,参数(2-36,默认10)为控制转换进制的基数.

    ```javascript
    Math.PI.toString() //"3.141592653589793"
    Math.PI.toString(2) //"11.001001000011111101101010100010001000010110100011"
    ```

## Object

-   hasOwnProperty(name):查看object是否包含该属性,原型链上不检查.

    ```javascript
    var a = {member: 1};
    var b = Object.create(a);
    var t = a.hasOwnProperty('member'); // t is true
    var u = b.hasOwnProperty('member'); // u is false
    var v = b.member; // v is 1
    ```

## String

-   charAt(pos): 返回string中pos位置的字符.

    ```javascript
    var name = 'LZ';
    var initial = name.charAt(0); // initial is 'L'
    ```

    实现

    ```javascript
    String.method('charAt', function (pos) {
        return this.slice(pos, pos + 1);
    });
    ```

-   charCodeAt(pos): 返回pos位置的字符的字符码位.

    ```javascript
    var name = 'LZ';
    var initial = name.charCodeAt(0); // 76
    ```

-   indexOf(searchString,position): 在string内查找从position开始的字符串searchString,并返回起始位.

-   和一些Regexp相关的方法:’match’,’replace’,’search’
-   slice,toLowerCase,toUpperCase

# 代码风格

-   空格:缩进为4个空格,除了`.`和`[`后均跟一个空格
-   K&R风格,把`{`放在一行的结尾

# 毒瘤

## 全局变量

JS的全局变量降低了程序的可靠性,全局变量的三种方式:

-   ```
    - 直接给全局变量添加一个属性 ```window.foo = value
    ```

-   隐式全局变量 `foo = value`

## 作用域

Javascript的语法来自C,一个代码块会创造一个作用域.代码块中声明的变量在其外部是不可见的.JS采用这样的块语法,却没有提供块级作用域:代码块中声明的变量在包含此代码块的函数的任何位置都是可见的.

## 保留字

保留字过多,而大部分并不是经常使用.

## Unicode

JS的Unicode是16位

# 糟粕

请避免使用以下几个方法,使javascript的代码更加的简洁和高效.

-   \==和!=
-   with
-   eval
-   continue
-   switch穿越
-   缺少块语句.判断语句用`{}`分隔.
-   `++` `--`:递增和递减避免使用++,–的方式,使代码更为简洁
-   位运算符:Javascript没有整数类型,它只有双精度的浮点数,执行位运算的效率较低,要避免使用.
-   void.
-   new
