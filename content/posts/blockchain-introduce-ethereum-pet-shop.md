---
title: "区块链导论:以太坊DAPP（宠物店应用）"
date: 2018-05-22T15:33:00+08:00
tags: ["区块链", "blockchain", "Ethereum", "以太坊"]
categories: ["开发者手册"]
draft: false
---
宠物领养应用是Truffle自带的一个教程应用，通过本教程你将学到以下内容：

1.  使用`Truffle Box`来创建`Truffle工程`
2.  编写智能合约
3.  编译部署智能合约
4.  测试智能合约
5.  创建一个可与智能合约交互的用户接口
6.  浏览器内访问`DAPP`

# 使用`Truffle Box`来创建`Truffle工程`

```
mkdir pet-shop
```

# 编写和测试智能合约

1.  创建文件`contracts/Adoption.sol`

    ```
    pragma solidity ^0.4.17;

    contract Adoption {
      address[16] public adopters;
      // 领养宠物
      function adopt(uint petId) public returns (uint) {
        require(petId >= 0 && petId <= 15);

        adopters[petId] = msg.sender;

        return petId;
      }
      // Retireving the adopters
      function getAdopters() public view returns (address[16]) {
        return adopters;
      }
    }
    ```

2.  编写测试代码,’test/TestAdoption.sol’

```
pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
  Adoption adoption = Adoption(DeployedAddresses.Adoption());
  // Testing the adopt() function
  function testUserCanAdoptPet() public {
    uint returnedId = adoption.adopt(8);

    uint expected = 8;

    Assert.equal(returnedId, expected, "Adoption of pet ID 8 should be recorded.");
  }
  // Testing retrieval of all pet owners
  function testGetAdopterAddressByPetIdInArray() public {
    // Expected owner is this contract
    address expected = this;

    // Store adopters in memory rather than contract's storage
    address[16] memory adopters = adoption.getAdopters();

    Assert.equal(adopters[8], expected, "Owner of pet ID 8 should be recorded.");
  }
}
```

-   `Assert.sol`：单元测试的assert方法,具体[查看](https://github.com/trufflesuite/truffle-core/blob/master/lib/testing/Assert.sol)
-   `DeployedAddresses.sol`: 执行`truffle`测试用例，truffle会部署一个新的合约用力到区块链中，这个合约用户获得`被部署的合约`

执行测试。

```
➜  pet-shop-tutorial truffle test
Using network 'development'.

Compiling ./contracts/Adoption.sol...
Compiling ./test/TestAdoption.sol...
Compiling truffle/Assert.sol...
Compiling truffle/DeployedAddresses.sol...

  TestAdoption
    ✓ testUserCanAdoptPet (197ms)
    ✓ testGetAdopterAddressByPetId (165ms)
    ✓ testGetAdopterAddressByPetIdInArray (333ms)

  3 passing (2s)
```

# 构建前端应用页面

1.  打开`/src/js/app.js`，替换`replace me`代码段。

    -   initWeb3

        ```
        // Is there an injected web3 instance?
        if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider;
        } else {
          // If no injected web3 instance is detected, fall back to Ganache
          App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);
        ```

        判断web3实例是否存在(`Mist`或者`MentaMask`)，如果存在则返回实例，不存在就新建。

    -   initContract

        ```
        $.getJSON('Adoption.json', function(data) {
         // 获取合约文件并使用truffle-contract方法实例化
         var AdoptionArtifact = data;
         App.contracts.Adoption = TruffleContract(AdoptionArtifact);

         // 将智能合约实例加载到服务容器中，此处是web3Providers
         App.contracts.Adoption.setProvider(App.web3Provider);

         // 使用合约来获取和标记被领养的宠物
         return App.markAdopted();
        });
        ```

    -   markAdopted

        ```
        var adoptionInstance;

        App.contracts.Adoption.deployed().then(function(instance) {
          adoptionInstance = instance;

          return adoptionInstance.getAdopters.call();
        }).then(function(adopters) {
          for (i = 0; i < adopters.length; i++) {
            if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
              $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
            }
          }
        }).catch(function(err) {
          console.log(err.message);
        });
        ```

        使用getAdopters方法获得所有被领养的宠物，并将对应领养按钮设为`disable`。

    -   handleAdopt

        ```
        var adoptionInstance;
        web3.eth.getAccounts(function(error, accounts) {
          if (error) {
            console.log(error);
          }
        // 获取当前账户
        var account = accounts[0];

        App.contracts.Adoption.deployed().then(function(instance) {
          adoptionInstance = instance;
          // Execute adopt as a transaction by sending account
          return adoptionInstance.adopt(petId, {from: account});
          }).then(function(result) {
            return App.markAdopted();
          }).catch(function(err) {
            console.log(err.message);
          });
        });
        ```

# 运行web server

```
npm run dev
```

# 完整代码

[pet-shop](https://github.com/LiZoRN/BlockChain/tree/master/ethereum/pet-shop-tutorial)

# issue

1.  修改DAPP的index.html，将`<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>`替换为`https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js`
