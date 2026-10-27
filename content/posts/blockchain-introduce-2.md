---
title: "区块链导论:以太坊（Ethereum）"
date: 2018-05-22T14:30:00+08:00
aliases: ["/2018/05/22/blockchain-introduce-2/"]
tags: ["区块链", "blockchain", "Ethereum", "以太坊"]
categories: ["开发者手册"]
draft: false
---
以太坊（Ethereum）是一个开源的有智能合约功能的公共区块链平台。通过其专用加密货币以太币（Ether）提供去中心化的虚拟机（“以太虚拟机” Ethereum Virtual Machine）来处理点对点合约。

关于以太坊（Ethereum）的概念网上有很多资料可以查询，本文只上干货，主要目的如下：

1.  搭建`Ethereum`的开发环境
2.  熟悉Ethereum DAPP开发框架:`Truffle`
3.  Truffle DAPP开发和调试

# 以太坊开发环境搭建

安装区块链仿真环境([ganache](http://truffleframework.com/ganache/))、`solidity编译器`、`web3`、`truffle`。

```
npm install -g ganache-cli solc web3 truffle
```

## IDE

-   Atom

安装`linter-solidity`插件。

```
$ apm install linter
$ apm install linter-solidity
```

-   ethereum客户端
    这里使用[Metamask](https://github.com/MetaMask/metamask-extension/releases),下载对应的浏览器版本，安装到浏览器的插件里。

选择`Custom RPC`加入本地`ganche私有链`\-“[http://127.0.0.1:7545"。](http://127.0.0.1:7545"。)

## 开启环境

-   开启仿真环境ganache

![](/res/img/blockchain/ganche.png)

-   metamask连接私有链
    `Customer Rpc` -> `http://127.0.0.1:7545`
    ![](/res/img/blockchain/mentamask.png)

# Truffle

Truffle是一个世界级的开发环境，测试框架，以太坊的资源管理通道，致力于让以太坊上的开发变得简单，Truffle有以下功能：

-   内置的智能合约编译，链接，部署和二进制文件的管理。
-   快速开发下的自动合约测试。
-   脚本化的，可扩展的部署与发布框架。
-   部署到不管多少的公网或私网的网络环境管理功能
-   使用EthPM&NPM提供的包管理，使用ERC190标准。
-   与合约直接通信的直接交互控制台（写完合约就可以命令行里验证了）。
-   可配的构建流程，支持紧密集成。
-   在Truffle环境里支持执行外部的脚本。

## Truffle 开发部署合约

1.  创建工程

```
mkdir fibonacci
cd fibonacci
truffle init
```

工程目录结构如下：
`app/` - 你的应用文件运行的默认目录。这里面包括推荐的javascript文件和css样式文件目录，但你可以完全决定如何使用这些目录。
`contract/` - Truffle默认的合约文件存放地址。
`migrations/` - 存放发布脚本文件
`test/` - 用来测试应用和合约的测试文件
`truffle.js` - Truffle的配置文件

1.  编写一个基础智能合约

创建一个合约`contracts/Fibonacci.sol`:

```javascript
pragma solidity ^0.4.22;

contract Fibonacci {

uint[] fibseries;
  // n = how many in the series to return
  function generateFib(uint n) public {
    // set 1st and 2nd entries
    fibseries.push(1);
    fibseries.push(1);
    // generate subsequent entries
    for (uint i=2; i < n ; i++) {
      fibseries.push(fibseries[i-1] + fibseries[i-2]);
    }
  }
}
```

`generateFib`:生成`Fibonacci（斐波纳契）`数列，公式`fib(n)=fib(n-1)+fib(n-2)`。

1.  创建一个新的部署文件`migrations/2_deploy_contracts.js`。

```javascript
var Fibonacci = artifacts.require("Fibonacci");

module.exports = function(deployer) {
  deployer.deploy(Fibonacci);
};
```

1.  启动`Ganache`

2.  修改工程目录下的`truffle.js`

```
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    }
  }
};
```

1.  编译并植入合约

    ```
    truffle compile
    truffle migrate

    Using network 'development'.

    Running migration: 1_initial_migration.js
      Deploying Migrations...
      ... 0x97f35c60501091e10315febe0d2f1d8a59cb413c38cc7c2b3538263a7c67d0bf
      Migrations: 0xf7f433a4a2f9bf3f364bb96abe6a07778a61e095
    Saving successful migration to network...
      ... 0x17b700e3a580ddd28d7bb7110c33f5a8c94b8875c99138d466f8625056a47cd9
    Saving artifacts...
    Running migration: 2_deploy_contracts.js
      Deploying Fibonacci...
      ... 0xd1f02be04a76df173456b48777d740f65248cd5870c4e22c058cc6f658dc2f9e
      Fibonacci: 0xc9554c5818dac7e79dc398d85c4789b90618c5b7
    Saving successful migration to network...
      ... 0xb987be952d829ca21a909e2f558abdae84cf6afe0c83c2070ab2ba8319f79672
    Saving artifacts...
    ```

## console debug

我们可以直接使用[remix ide](http://remix.ethereum.org)，调试非常的方便。
这里我们虐一下自己，使用`Truffle Console`来进行调试。

1.  进入console

    `truffle console`

2.  调用合约

    ```
    truffle(development)> Fibonacci.deployed().then(function(instance){return instance.generateFib(10);});
    { tx: '0x0d10a3f875548131fdad0a27f916af5575fcf6ee47085e9d625d695eb2c11583',
      receipt:
       { transactionHash: '0x0d10a3f875548131fdad0a27f916af5575fcf6ee47085e9d625d695eb2c11583',
         transactionIndex: 0,
         blockHash: '0x7596a7239811b8586a2c60a9fad19d41ea8bb3be46e8ed3b8ebbfaf4c477b707',
         blockNumber: 5,
         gasUsed: 298373,
         cumulativeGasUsed: 298373,
         contractAddress: null,
         logs: [],
         status: '0x01',
         logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' },
      logs: [] }
    ```

3.  调试`transaction`

    1.  先attache一条`transaction`，id为`transactionHash`值。

        ```
        truffle(development)> debug 0x0d10a3f875548131fdad0a27f916af5575fcf6ee47085e9d625d695eb2c11583
        Compiling ./contracts/Fibonacci.sol...
        Compiling ./contracts/Migrations.sol...

        Gathering transaction data...

        Addresses affected:
         0xc9554c5818dac7e79dc398d85c4789b90618c5b7 - Fibonacci

        Commands:
        (enter) last command entered (step next)
        (o) step over, (i) step into, (u) step out, (n) step next
        (;) step instruction, (p) print instruction, (h) print this help, (q) quit
        (b) toggle breakpoint, (c) continue until breakpoint
        (+) add watch expression (`+:<expr>`), (-) remove watch expression (-:<expr>)
        (?) list existing watch expressions
        (v) print variables and values, (:) evaluate expression - see `v`
        ```

        Commands即为调试命令行。

    2.  watch（`+:`）变量,按`n`逐行进行跟踪。

        ```
        debug(development:0x0d10a3f8...)> +:i
        8
        debug(development:0x0d10a3f8...)> +:fibseries
        [ 1, 1, 2, 3, 5, 8, 13, 21 ]
        debug(development:0x0d10a3f8...)> n

        Fibonacci.sol:

        14:     // generate subsequent entries
        15:     for (uint i=2; i < n ; i++) {
        16:       fibseries.push(fibseries[i-1] + fibseries[i-2]);
                                             ^

        :i
          8

        :fibseries
          [ 1, 1, 2, 3, 5, 8, 13, 21 ]
        ```

4.  异常信息调试

    1.  修改以下合约代码

        ```
        ...
        for (uint i=1; i < n ; i++) {
        ...
        ```

    2.  重新编译部署合约

        ```
        debug(development:0x65bb45af...)> compile --all

        Transaction completed successfully.
        truffle(development)> migrate --reset
        Compiling ./contracts/Fibonacci.sol...
        Writing artifacts to ./build/contracts

        Using network 'development'.

        Running migration: 1_initial_migration.js
          Replacing Migrations...
          ... 0x26fdc5c20b9f44e96e537e0b8474f867d7bd7d27ad7172b004c858d2dceb6f99
          Migrations: 0xd0ea55247c6035375c6e284a60946cd35550ced2
        Saving successful migration to network...
          ... 0x0ad76d3073b05161327fc1f7dbd1c521360c305af872ff12b7f59befb73dfbd2
        Saving artifacts...
        Running migration: 2_deploy_contracts.js
          Replacing Fibonacci...
          ... 0x93ee91146a3a5fd23dad1e77249870c0edeb5cf6cd78cb7c9db6aab24f538634
          Fibonacci: 0x090b1fd13ee19ec7f8f3175ca54d5165a443c694
        Saving successful migration to network...
          ... 0xbeb0d613fa72c67ecf720833a4985244a91b0d0dea1c36fc23195e00e7fd8c18
        Saving artifacts...
        truffle(development)> Fibonacci.deployed().then(function(instance){return instance.generateFib(10);});
        Error: VM Exception while processing transaction: invalid opcode
            at XMLHttpRequest._onHttpResponseEnd (/home/lizorn/.nvm/versions/node/v10.0.0/lib/node_modules/truffle/build/webpack:/~/xhr2/lib/xhr2.js:509:1)
            at XMLHttpRequest._setReadyState (/home/lizorn/.nvm/versions/node/v10.0.0/lib/node_modules/truffle/build/webpack:/~/xhr2/lib/xhr2.js:354:1)
            at XMLHttpRequestEventTarget.dispatchEvent (/home/lizorn/.nvm/versions/node/v10.0.0/lib/node_modules/truffle/build/webpack:/~/xhr2/lib/xhr2.js:64:1)
            at XMLHttpRequest.request.onreadystatechange (/home/lizorn/.nvm/versions/node/v10.0.0/lib/node_modules/truffle/build/webpack:/~/web3/lib/web3/httpprovider.js:128:1)
            at /home/lizorn/.nvm/versions/node/v10.0.0/lib/node_modules/truffle/build/webpack:/~/truffle-provider/wrapper.js:134:1
            at /home/lizorn/.nvm/versions/node/v10.0.0/lib/node_modules/truffle/build/webpack:/~/web3/lib/web3/requestmanager.js:86:1
            at Object.InvalidResponse (/home/lizorn/.nvm/versions/node/v10.0.0/lib/node_modules/truffle/build/webpack:/~/web3/lib/web3/errors.js:38:1)
        ```

    3.  此处由于数组越界，控制窗口并没有返回transaction的ID，我们可以通过查看`Ganache`的`Logs`，找到对应的`Transaction`，然后按之前的方式进行调试。
