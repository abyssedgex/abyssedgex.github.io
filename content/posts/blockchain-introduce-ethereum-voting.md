---
title: "区块链导论:以太坊DAPP（投票应用）"
date: 2018-05-22T15:33:00+08:00
aliases: ["/2018/05/22/blockchain-introduce-ethereum-voting/"]
tags: ["区块链", "blockchain", "Ethereum", "以太坊"]
categories: ["开发者手册"]
draft: false
---
# 投票DAPP

## 投票智能合约

-   contracts/Voting.sol

```
pragma solidity ^0.4.18;
// We have to specify what version of compiler this code will compile with

contract Voting {
  /* mapping field below is equivalent to an associative array or hash.
  The key of the mapping is candidate name stored as type bytes32 and value is
  an unsigned integer to store the vote count
  */

  mapping (bytes32 => uint8) public votesReceived;

  /* Solidity doesn't let you pass in an array of strings in the constructor (yet).
  We will use an array of bytes32 instead to store the list of candidates
  */

  bytes32[] public candidateList;

  /* This is the constructor which will be called once when you
  deploy the contract to the blockchain. When we deploy the contract,
  we will pass an array of candidates who will be contesting in the election
  */
  function Voting(bytes32[] candidateNames) public {
    candidateList = candidateNames;
  }

  // This function returns the total votes a candidate has received so far
  function totalVotesFor(bytes32 candidate) view public returns (uint8) {
    require(validCandidate(candidate));
    return votesReceived[candidate];
  }

  // This function increments the vote count for the specified candidate. This
  // is equivalent to casting a vote
  function voteForCandidate(bytes32 candidate) public {
    require(validCandidate(candidate));
    votesReceived[candidate] += 1;
  }

  function validCandidate(bytes32 candidate) view public returns (bool) {
    for(uint i = 0; i < candidateList.length; i++) {
      if (candidateList[i] == candidate) {
        return true;
      }
    }
    return false;
  }
}
```

## 使用node console调试合约

打开`ganche`，使用`web3`交互。

```
➜  chapter1 git:(master) ✗ node
> Web3 = require('web3')
{ [Function: Web3]
  providers:
   { HttpProvider: [Function: HttpProvider],
     IpcProvider: [Function: IpcProvider] } }
> web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
```

查看区块账号

```
> web3.eth.accounts
[ '0x2fa9da84494be487126a2d96794a69c904acdf17',
  '0xfbdb68208934c62e78f7e88089f47d0074298a58',
  '0x7fbc15bdc47cae7a6f23f854480053b3f63e8783',
  '0x2606d31e26b07f7077971810c8f16ed242969f9d',
  '0x90b1320cca7320d914a8cf7a04648ac7ebfcfe66',
  '0xd5a5a2f92f88f9ec4e3329200fa2f355e83af553',
  '0xb7765e9be2577c73ffe6e87843a3290781b87298',
  '0xda22e32e230554fbd33541b0187a9071430dbbf6',
  '0x8761a81d0e30ab8117e33e741f1b0ddfdb1b000a',
  '0x00448bbe603ab4ceb215b9169f7c4f0118aa7896' ]
```

读取并编译智能合约

```
> code = fs.readFileSync('Voting.sol').toString()
> solc = require('solc')
> compiledCode = solc.compile(code)
```

部署智能合约

```
> abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface)
> VotingContract = web3.eth.contract(abiDefinition)
> byteCode = compiledCode.contracts[':Voting'].bytecode
> deployedContract = VotingContract.new(['Rama','Nick','Jose'],{data: byteCode, from: web3.eth.accounts[0], gas: 4700000})
> contractInstance = VotingContract.at(deployedContract.address)
```

```
- compiledCode.contracts[‘:Voting’].bytecode: 合约二进制代码，用于部署到区块链中.
- compiledCode.contracts[‘:Voting’].interface: 智能合约接口模板(abi)，告诉合约用户可使用的接口.
```

调用合约方法

```
> contractInstance.totalVotesFor.call('Rama')
BigNumber { s: 1, e: 0, c: [ 0 ] }
>
> contractInstance.voteForCandidate('Rama', {from: web3.eth.accounts[0]})
'0xb78beb95dce55f946fe9d3bbe06f3ed588749e2714fa2834e4f0a59f6a2d55d6'
> contractInstance.voteForCandidate('Rama', {from: web3.eth.accounts[0]})
'0xf0b6291f6eca6e6d314e0c246ec863e74506656c5da70a88f583f80be9dc119b'
> contractInstance.totalVotesFor.call('Rama').toLocaleString()
'2'
```

> `0xb78beb95dce55f946fe9d3bbe06f3ed588749e2714fa2834e4f0a59f6a2d55d6`是每一次交易发生的`transaction id`

## 前端页面

-   index.html

    ```html
    <!DOCTYPE html>
    <html>
    <head>
      <title>Hello World DApp</title>
      <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css'>
      <link href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' rel='stylesheet' type='text/css'>
    </head>
    <body class="container">
      <h1>A Simple Hello World Voting Application</h1>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rama</td>
              <td id="candidate-1"></td>
            </tr>
            <tr>
              <td>Nick</td>
              <td id="candidate-2"></td>
            </tr>
            <tr>
              <td>Jose</td>
              <td id="candidate-3"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <input type="text" id="candidate" />
      <a href="#" onclick="voteForCandidate()" class="btn btn-primary">Vote</a>
    </body>
    <script src="https://cdn.rawgit.com/ethereum/web3.js/develop/dist/web3.js"></script>
    <script src="https://code.jquery.com/jquery-3.1.1.slim.min.js"></script>
    <script src="./index.js"></script>
    </html>
    ```

-   index.js

    ```javascript
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    abi = JSON.parse('[{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"x","type":"bytes32"}],"name":"bytes32ToString","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"contractOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"type":"constructor"}]')
    VotingContract = web3.eth.contract(abi);
    // nodejs console中contractInstance.address获得的地址
    contractInstance = VotingContract.at('0xf7f433a4a2f9bf3f364bb96abe6a07778a61e095');
    candidates = {"Rama": "candidate-1", "Nick": "candidate-2", "Jose": "candidate-3"}

    function voteForCandidate() {
      candidateName = $("#candidate").val();
      contractInstance.voteForCandidate(candidateName, {from: web3.eth.accounts[0]}, function() {
        let div_id = candidates[candidateName];
        $("#" + div_id).html(contractInstance.totalVotesFor.call(candidateName).toString());
      });
    }

    $(document).ready(function() {
      candidateNames = Object.keys(candidates);
      for (var i = 0; i < candidateNames.length; i++) {
        let name = candidateNames[i];
        let val = contractInstance.totalVotesFor.call(name).toString()
        $("#" + candidates[name]).html(val);
      }
    });
    ```

以上是不使用框架的智能合约的开发应用。

# voting优化

## 创建truffle工程

```
mkdir voting
cd voting
truffle unbox webpack
```

## 创建合约植入代码。

-   migrations/2\_deploy\_contracts.js

    ```
    var VotingContract = artifacts.require("./Voting.sol");

    module.exports = function(deployer) {
      deployer.deploy(VotingContract,['Rama', 'Nick', 'Jose'], {gas: 6700000});
    };
    ```

## DAPP前端代码

-   app/javasripts/app.js

    ```javascript
    // Import the page's CSS. Webpack will know what to do with it.
    import "../stylesheets/app.css";

    // Import libraries we need.
    import { default as Web3} from 'web3';
    import { default as contract } from 'truffle-contract'
    import voting_artifacts from '../../build/contracts/Voting.json'

    var Voting = contract(voting_artifacts);

    let candidates = {"Rama": "candidate-1", "Nick": "candidate-2", "Jose": "candidate-3"}

    window.voteForCandidate = function(candidate) {
      let candidateName = $("#candidate").val();
      try {
        $("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.")
        $("#candidate").val("");

        /* Voting.deployed() returns an instance of the contract. Every call
         * in Truffle returns a promise which is why we have used then()
         * everywhere we have a transaction call
         */
        Voting.deployed().then(function(contractInstance) {
          contractInstance.voteForCandidate(candidateName, {gas: 140000, from: web3.eth.accounts[0]}).then(function() {
            let div_id = candidates[candidateName];
            return contractInstance.totalVotesFor.call(candidateName).then(function(v) {
              $("#" + div_id).html(v.toString());
              $("#msg").html("");
            });
          });
        });
      } catch (err) {
        console.log(err);
      }
    }

    $( document ).ready(function() {
      if (typeof web3 !== 'undefined') {
        console.warn("Using web3 detected from external source like Metamask")
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
      } else {
        console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
      }

      Voting.setProvider(web3.currentProvider);
      let candidateNames = Object.keys(candidates);
      for (var i = 0; i < candidateNames.length; i++) {
        let name = candidateNames[i];
        Voting.deployed().then(function(contractInstance) {
          contractInstance.totalVotesFor.call(name).then(function(v) {
            $("#" + candidates[name]).html(v.toString());
          });
        })
      }
    });
    ```

-   app/index.html

    ```html
    <!DOCTYPE html>
    <html>
    <head>
      <title>Hello World DApp</title>
      <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css'>
      <link href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' rel='stylesheet' type='text/css'>
    </head>
    <body class="container">
      <h1>A Simple Hello World Voting Application</h1>
      <div id="address"></div>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rama</td>
              <td id="candidate-1"></td>
            </tr>
            <tr>
              <td>Nick</td>
              <td id="candidate-2"></td>
            </tr>
            <tr>
              <td>Jose</td>
              <td id="candidate-3"></td>
            </tr>
          </tbody>
        </table>
        <div id="msg"></div>
      </div>
      <input type="text" id="candidate" />
      <a href="#" onclick="voteForCandidate()" class="btn btn-primary">Vote</a>
    </body>
    <script src="https://code.jquery.com/jquery-3.1.1.slim.min.js"></script>
    <script src="app.js"></script>
    </html>
    ```

## 编译部署智能合约:

```
➜  voting git:(master) ✗ truffle compile
➜  voting git:(master) ✗ truffle migrate
➜  voting git:(master) ✗ truffle console
truffle(development)> Voting.deployed().then(function(contractInstance) {contractInstance.voteForCandidate('Rama').then(function(v) {console.log(v)})})
undefined
truffle(development)> { tx: '0xe2ef29e4a6d02ff1217148e3038ba3edcf815840d4400dd8895a5c2497a6e239',
  receipt:
   { transactionHash: '0xe2ef29e4a6d02ff1217148e3038ba3edcf815840d4400dd8895a5c2497a6e239',
     transactionIndex: 0,
     blockHash: '0x19066839d607b6a7f842c026a11fe130474dce2b62f5d0e9c9f2f2d48d286963',
     blockNumber: 5,
     gasUsed: 43411,
     cumulativeGasUsed: 43411,
     contractAddress: null,
     logs: [],
     status: '0x01',
     logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' },
  logs: [] }
```

## 运行应用

`npm run dev`

登录`metamask`进行应用访问：
![](/res/img/blockchain/voting-v1.png)

## 代码

```
git clone https://github.com/LiZoRN/BlockChain.git
git checkout v1.0
```

# 投票v2版本

一般在选举中，每一个选民只能投出一票给候选人。但假设你是一家公司的股东，你可能需要会有这样的要求：票数按拥有的股票数来定。

-   项目目标

1.  学习使用数据类型`Struct`用来组织和存储区块链上的数据
2.  学习票据(tokens)的概念并应用到本项目

## 功能说明

![image](https://cdn-images-1.medium.com/max/1200/1*3cd64RjjJiVuAFTEkw5-sA.png)

1.  票据(tokens):表示可用于投票的总票数
2.  每一个选民使用货币（`eth`）来购买票据用于投票
3.  你可以查看投票信息：
    -   每个候选人拥有多少tokens
    -   自己所投的token情况
4.  候选人不再指定，从整条链上获取。

## 智能合约

```javascript
pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

contract Voting {

  // We use the struct datatype to store the voter information.
  struct voter {
    address voterAddress; // The address of the voter
    uint tokensBought;    // The total no. of tokens this voter owns
    uint[] tokensUsedPerCandidate; // Array to keep track of votes per candidate.
    /* We have an array of candidates initialized below.
     Every time this voter votes with her tokens, the value at that
     index is incremented. Example, if candidateList array declared
     below has ["Rama", "Nick", "Jose"] and this
     voter votes 10 tokens to Nick, the tokensUsedPerCandidate[1]
     will be incremented by 10.
     */
  }

  /* mapping is equivalent to an associate array or hash
   The key of the mapping is candidate name stored as type bytes32 and value is
   an unsigned integer which used to store the vote count
   */

  mapping (address => voter) public voterInfo;

  /* Solidity doesn't let you return an array of strings yet. We will use an array of bytes32
   instead to store the list of candidates
   */

  mapping (bytes32 => uint) public votesReceived;

  bytes32[] public candidateList;

  uint public totalTokens; // Total no. of tokens available for this election
  uint public balanceTokens; // Total no. of tokens still available for purchase
  uint public tokenPrice; // Price per token

  /* When the contract is deployed on the blockchain, we will initialize
   the total number of tokens for sale, cost per token and all the candidates
   */
  function Voting(uint tokens, uint pricePerToken, bytes32[] candidateNames) public {
    candidateList = candidateNames;
    totalTokens = tokens;
    balanceTokens = tokens;
    tokenPrice = pricePerToken;
  }

  function totalVotesFor(bytes32 candidate) view public returns (uint) {
    return votesReceived[candidate];
  }

  /* Instead of just taking the candidate name as an argument, we now also
   require the no. of tokens this voter wants to vote for the candidate
   */
  function voteForCandidate(bytes32 candidate, uint votesInTokens) public {
    uint index = indexOfCandidate(candidate);
    require(index != uint(-1));

    // msg.sender gives us the address of the account/voter who is trying
    // to call this function
    if (voterInfo[msg.sender].tokensUsedPerCandidate.length == 0) {
      for(uint i = 0; i < candidateList.length; i++) {
        voterInfo[msg.sender].tokensUsedPerCandidate.push(0);
      }
    }

    // Make sure this voter has enough tokens to cast the vote
    uint availableTokens = voterInfo[msg.sender].tokensBought - totalTokensUsed(voterInfo[msg.sender].tokensUsedPerCandidate);
    require(availableTokens >= votesInTokens);

    votesReceived[candidate] += votesInTokens;

    // Store how many tokens were used for this candidate
    voterInfo[msg.sender].tokensUsedPerCandidate[index] += votesInTokens;
  }

  // Return the sum of all the tokens used by this voter.
  function totalTokensUsed(uint[] _tokensUsedPerCandidate) private pure returns (uint) {
    uint totalUsedTokens = 0;
    for(uint i = 0; i < _tokensUsedPerCandidate.length; i++) {
      totalUsedTokens += _tokensUsedPerCandidate[i];
    }
    return totalUsedTokens;
  }

  function indexOfCandidate(bytes32 candidate) view public returns (uint) {
    for(uint i = 0; i < candidateList.length; i++) {
      if (candidateList[i] == candidate) {
        return i;
      }
    }
    return uint(-1);
  }

  /* This function is used to purchase the tokens. Note the keyword 'payable'
   below. By just adding that one keyword to a function, your contract can
   now accept Ether from anyone who calls this function. Accepting money can
   not get any easier than this!
   */

  function buy() payable public returns (uint) {
    uint tokensToBuy = msg.value / tokenPrice;
    require(tokensToBuy <= balanceTokens);
    voterInfo[msg.sender].voterAddress = msg.sender;
    voterInfo[msg.sender].tokensBought += tokensToBuy;
    balanceTokens -= tokensToBuy;
    return tokensToBuy;
  }

  function tokensSold() view public returns (uint) {
    return totalTokens - balanceTokens;
  }

  function voterDetails(address user) view public returns (uint, uint[]) {
    return (voterInfo[user].tokensBought, voterInfo[user].tokensUsedPerCandidate);
  }

  /* All the ether sent by voters who purchased the tokens is in this
   contract's account. This method will be used to transfer out all those ethers
   in to another account. *** The way this function is written currently, anyone can call
   this method and transfer the balance in to their account. In reality, you should add
   check to make sure only the owner of this contract can cash out.
   */

  function transferTo(address account) public {
    account.transfer(this.balance);
  }

  function allCandidates() view public returns (bytes32[]) {
    return candidateList;
  }

}
```

-   migrations/2\_deploy\_contracts.js

    ```
    deployer.deploy(Voting, 1000, web3.toWei('0.1', 'ether'), ['Rama', 'Nick', 'Jose']);
    ```

重新部署智能合约

```
truffle compile
truffle migrate --reset
```

启动工程:`npm run dev`

## 完成代码

```
git clone https://github.com/LiZoRN/BlockChain.git
git checkout v2.0
```
