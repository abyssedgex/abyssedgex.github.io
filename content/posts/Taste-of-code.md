---
title: "代码的味道"
date: 2016-10-25T20:44:06+08:00
aliases: ["/2016/10/25/Taste-of-code/"]
tags: ["新知类", "编码规则", "代码的味道"]
categories: ["开发者手册"]
draft: false
---
![](/res/img/tasteofcode/codereview.png)

# 代码的味道

## 你的代码臭不可闻，为什么？

-   工期太赶
-   前任的坑
-   还是…水平未到？

很多程序员会给自己的代码找很多借口，我认为糟糕代码的产生除了上述原因外，主要是思想问题，要摒弃糟糕的代码，让代码变得整洁，必须要先弄明白一件事情：大家写程序，你的客户是谁?

## 代码的表现力

> “程序写出来是给人看的,附带能在机器上运行. “

代码的表现力主要体现在两个方面:

-   软件的部分功能就是解释自身,为了写出优秀的软件,你必须假定用户对你的软件基本上一无所知.
-   源代码也应该可以自己解释自己,你需要保证源代码自身的可观赏性.

说白了，编程不是简单的完成一次功能交付，代码的表现形式不仅仅是产品本身，还包括代码自己。也就是说在你充分的实现‘功能客户’的需求的同时，你还需要满足‘code reviewer’的胃口。

我们就需要让代码变的整洁。

### 什么是整洁的代码?

> 我喜欢优雅和高效的代码.代码逻辑应当直截了当,叫缺陷难以隐藏;尽量减少依赖关系,使之便于维护;依据某种分层战略完善错误处理代码;性能调至最优,省得引诱别人做没规矩的优化,搞出一堆换乱来.整洁的代码只做好一件事.
>
> **Bjarne Shroustrup**C++程序设计语言

C++之父Bjarne认为代码应该是优雅而高效的.

> 整洁的代码简单直接;整洁的代码如同优美的散文;整洁的代码从不隐藏设计者的意图,充满了干净利落的抽象和直截了当的控制语句.
>
> **rady Booch**面向对象分析与设计

编程是一门技艺，代码是一种艺术，很难有语言表达。我摘录了《clean code》书中‘味道与启发’这一章节部分清单，进行了修整和梳理，清单里的代码会让你非常不舒服，清单的内容需要持续维护和更新。

# 命名问题

## 命名要具备描述性,避免歧义

-   名副其实, 好的命名不需要额外的注释

```java
int d; // 消逝的时间,以日计  ----bad
int elapsedTimeInDays; //  ----good
```

-   避免误导

必须避免留下隐藏代码本意的错误线索,避免使用与本意相悖的词,如系统预留字段要尽量避免,歧义的缩写也应当避免.
比如用`accountList`表示一组账号，会有歧义，这是是List类型? 用`accountGroup`则能更好的表示。

-   命名要有明显的区别

以下的方法很难区分具体含义：

```java
getActiveCustomer();
getActiveCustomers();
getActiveCustomerInfo()
```

-   命名要具备可读性

命名通常要用于交流和沟通，需要具备基本的口语习惯。

```java
private Date modymdhms; //bad
private Date modificationTimestamp; /good
```

-   类名使用名词,方法名使用动词.

## 名称应与抽象层级相符.

```java
public interface Modem {
  boolean dial(String phoneNumber);//应修改为 boolean connect(String phoneNumber);
  boolean disconnect();
  boolean send(char c);
  char recv();
  String getConnectedPhoneNumber();
}
```

## 尽可能使用标准命名法.

-   如果名称基于现有的约定或用法,命名就比较容易理解
-   命名要遵循专业领域的命名
-   命名要遵循团队的编码规范

## 名称的长度应与作用范围的广泛度相关.

-   对于较小的作用范围,可以用很短的名称,而对于较大作用范围就该用较长的名称.
-   作用范围在5行之内,i和j之类的变量名没有问题,如果范围变大,需要加长命名长度,用更有意义的命名.

## 避免编码.

不应该在名称中包括类型或者作用范围信息，以下命名方法均可以考虑废弃：

-   匈牙利标记法: `cClass`, `init`,`intNUmber`;
-   成员前缀: `private String m_member;`
-   接口: 接口已I开头，`IInterface`

## 名称应说明附加功能和副作用

-   命名应该说明函数,变量或类的一切信息,不要用名称掩蔽副作用
-   不使用简单的动词来描述不止做了一个简单动作的函数.

```java
public ObjectOutputStream getOos() throws IOException {
     if (m_oos == null) {
         m_oos = new ObjectOutputStream(m_socket.getOutputStream());
     }
     return m_oos;
}
```

`getOos`应改为`createOrReturnOos`

# 注释问题

## 不恰当的注释.

注释只应该描述相关代码和设计的技术信息.
如描述一些修改记录,问题追踪等是不恰当的注释,这些注释过时且无实际意义，会扰乱和降低阅读体验.
这些工作需要交给版本能控制工具。

## 废弃的注释.

注释也需要维护,过时,无关或不正确的注释会引起歧义并影响代码的可读性,需第一时间删除或更新.

## 冗余注释.

代码已经充分自我描述了,那么注释就是冗余的. 注释应该是代码未能涉及信息的补充.

```java
i++;  // increment i
```

## 坏注释.

注释也是代码的一部分,要保持简洁和语句通顺,别在里面闲扯.

```java
/*
I fear that I will always be A lonely number like root three
A three is all that's good and right
Why must my three keep out of sight Beneath a vicious square-root sign?
I wish instead I were a nine
For nine could thwart this evil trick With just some quick arithmetic
I know I'll never see the sun
As 1.7321...
Such is my reality A sad irrationality
When,hark, just what is this I see?
Another square root of a three
Has quietly come waltzing by
Together now we multiply
To form a number we prefer
Rejoicing as an integer
We break free from our mortal bonds
And with a wave of magic wands
Our square-root signs become unglued
And love for me has been renewed
 */
double number = Math.sqrt(3)*Math.sqrt(3);
```

## 废弃的代码.

不应该出现注释的代码, 注释掉的代码需要及时删除,版本控制系统会记录没一次的修改,不需要通过注释的形式.

# 一般性问题

## 理所当然的行为未被实现.

根据”最小惊异原则”,函数或类应该实现用户或程序员有理由期待的行为.

```java
Day day = DayDate.StringToDay(String dayName);
```

我们期望字符串Monday转化为Day类型的`Day.MONDAY`，也期望可以转化为常用缩写的`Day.MON`,还期望可以忽略大小写,`Day.mon`，这个再正常不过了.
还比如，一个EXCEL的字段解析,一次web页面的字符串输入，至少要保证忽略两边的空格.

## 不正确的边界行为.

单元测试需要追索每种边界条件,并编写测试.

## 忽略安全.

不要关闭编译器的告警,不要忽略编译告警,甚至可以引入\*\*Lint等语法静态编译校验工具来提高代码质量.

## 重复.

牢记*DRY*原则(Don’t Repeat Yourself). 发现重复代码就表示遗漏了抽象.`复制粘贴`式的编码会造成大量的重复,你需要不断的重构，将重复的代码叠放成抽象对象.

## 代码出现在错误的抽象层级上.

良好的软件设计要求将代码,文件,组件和模块，根据层级分离,将它们放到不同的位置.

## 基类依赖于派生类.

基类不应该依赖派生类,抽象类不依赖于实体类，这是面向对象设计的基本准则，篇幅有限，具体详细查看设计模式.

## 信息过多

-   设计良好的模块有非常小的接口,耦合度低.
-   限制类或模块中暴露的接口数量.类中的方法越少越好.函数知道的变量越少越好.
-   隐藏模块和类中的数据和工具函数,隐藏常量和你的临时变量,不要创建有大量方法或大量实体变量的类,保持接口紧凑.

## 混淆视听

未被执行的代码,没有用到的变量,没有信息量的注释等需要尽早删除,保持源文件整洁和良好.

## 垂直分割.

-   变量和函数应该在靠近被使用的地方定义.
-   本地变量应该正好在其首次被使用的位置上面声明,垂直距离要短.
-   私有函数应该刚好在其首次被使用的位置下面定义.

## 前后不一致.

命名要保持一致性.如果在特定函数中用名为response的变量来持有HttpServletResponse对象,则在其他用到该对象的地方也使用response变量名.

## 设计耦合

-   不相互依赖的东西不该耦合.例如,普通的enum不应该包含在特殊类里,否则使用这些enum就需要了解这个特殊类.
-   花点时间设计代码结构,研究应该在什么地方声明函数,常量和变量.不要为了方便而随手放置,放置后又置之不理.

## 隐晦的意图.

-   代码尽可能具有表达力.
-   短小紧凑的代码不一定是最好的代码,魔法数字应该拆分到具备解释性的变量里.如下代码你能明白什么意思吗？

```java
public init m_otCalc() {
     return iThsWkd * iThsRte + (int) Math.round(0.5 * iThsRte * Math.max(0, iThsWkd - 400));
}
```

## 代码位置错误.

开发人员做出的最重要决定之一就是在哪里放代码. 比如做一个考勤模块的功能,可以在打印报表的代码中做工作时间统计,或者在刷卡代码中保留一份工作时间记录.
这个时候最小惊异原则就起了作用.代码应该放在读者自然而然的地方，期待它所在的地方，就和老婆一样，每天早上醒来就在边上.

所以说编程其实是一种艺术行为. PI应该出现在声明三角函数的地方，而不是和一只老虎困在大海里.

## 不恰当的静态方法.

-   通常应该倾向于选用非静态方法,如果需要静态函数,确保不会让它有多态行为.
-   `Math.max(double a, double)`是个良好的静态方法,因为它并不在需要在的那个实体上运作.

## 使用解释性变量.

和G16类同,使用解释性变量,只要把计算过程打散成一系列良好命名的中间值,就可以提高代码的可读性,

```java
Matcher match = headerPattern.matcher(line);
if(match.find()){
     String key = match.gourp(1);
     String value = match.group(2);
     headers.put(key.toLowerCase(), value);
}
```

## 函数名称应该表达其行为.

如果必须要通过查看函数的实现(或文档)才知道它是做什么的,那是时候该换个更好的函数名了.

```java
Date newDate = date.add(5);
```

从函数调用中看不出函数的行为,如果是添加5天并修改日期,那么命名需要调整为increaseByDays.

## 理解算法.

-   很多可笑代码的出现,是因为没花时间去理解公式和算法,硬塞进足够的if语句和标示,让系统勉强运作.
-   在完成某个函数之前,要确认自己完全理解了它是怎么工作的,只有理解了公式,才能更好的进行优化.

## 遵循标准约定.

每个团队都应遵循基于通用行业规范的一套编码标准.

## 魔法数.

用常量代替魔法数字.

## 封装条件语句.

如果没有if或while语句的上下文,布尔逻辑就难以理解,应该把解释了条件意图的函数抽离出来.

```java
if (timer.hasExpired() && !timer.isRecurrent()) //bad
```

换成

```java
if (shouldBeDeleted(timer)) //good
```

## 避免否定性条件.

人的逆向思维能力一般都比较差，否定式要比肯定式难明白一些.所以,尽可能将条件表示为肯定形式.

```java
if (!buffer.shouldNotompact())  //bad
```

```java
if (buffer.shouldCompact())  //good
```

## 函数只该做一件事.

遵循职责单一原则.以下的代码完成了太多的事情，我们需要拆分.

```java
public void pay() {
     for (Employee e : employees) {
         if (e.isPayday()) {
              Money pay = e.calculatePay();
               e.deliverPay(pay)
          }
     }
}
```

遍历雇员

```java
public void pay() {
     for (Employee e : employees) {
          payIfNecessary(e);
     }
}
```

检查是否该给雇员付工资

```java
private void payIfNecessary(Employee e) {
     if (e.isPayday()){
         calculateAndDeliverPay(e);
     }
}
```

给雇员付工资

```java
private void caculateAndDeliverPay(Employee e) {
     Money pay = e.calculatePay();
     e.deliverPay.pay()
}
```

## 掩藏时序耦合.

不要隐藏时序耦合.如下代码，三个函数存在时序,捕鱼之前先织网,织网之前先编绳.如果调用倒换,可能就导致抛出异常.

```java
public class MoogDiver {
     public void dive(String reson) {
          saturateGradient();
          reticulateSplines();
          diveForMoog(reason);
     }
}
```

我们需要做调整，该耦合的还是得耦合,要符合实际的业务逻辑.

```java
public class MoogDiver {
     public void dive(String reson) {
          Gradient gradient = saturateGradient();
          List<Spline> splines = reticulateSplines(gradient );
          diveForMoog(splines ,reason);
     }
}
```

## 函数应该只在一个抽象层级上.

## 避免传递浏览,

函数或者接口调用者不需要了解太多架构相关的东西.如果A与B协作,B与C协作,我们不想让使用A的模块了解C的信息

`bad: a.getB().getC().doSomething()`

`good: myCollaborator.doSomething()`

# 环境问题

## 需要多步才能实现的构建.

构建系统应到是单步的操作, 执行一条命令,就可以从版本控制系统里拉下源代码,并完成构建.

```bash
svn get myPorject
cd myProject
ant all
```

或者

```bash
git clone *******
cd **
npm intall
npm start
```

## 需要多步才能做到的测试

单个命令应该可以运行全部的单元测试，并输出结果和报告.

# 测试问题

## 测试不足,未使用覆盖率工具.

-   一套测试中应该有多少个测试?CMMI将单元测试作为QA考核项,单元测试需考虑测试用例的代码覆盖率.
-   使用覆盖率工具能更容易地找到测试不足的模块,类和函数.

## 测试边界条件.

特别需要注意测试边界条件.这是最基本的测试方法.

## 测试覆盖率都具备启发性,

查看未执行和已执行测试的代码,往往能发现线索,有效的定位问题.

## 测试应该快速

## 单元测试保障了代码的重构.

重构行为给代码带来更长的生命周期和更高的质量.

# 函数问题

## 过多的参数.

最理想的参数数量是零,其次是一,再次是三,此类推,应避免三个以上的参数,符合职责单一原则.

## 输出参数.

容易把输出参数误看做输入参数,应少用或不用输出参数.

## 标示参数.

不要向函数传入布尔值.这不符合职责单一原则.

## 不被调用的函数.

用不被调用的方法应该丢弃,直接删除,保留代码的整洁.

## 命名不明确.

使用动词与关键字给函数去个好名字,能较好的解释方法的意图,以及参数的顺序和意图.
