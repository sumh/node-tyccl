# tyccl - 同义词词林（Node版）
根据《基于同义词词林的词语相似度计算方法_田久乐》论文中所提出的相似度计算方法的Node.js代码实现
使用《同义词词林扩展版》
## Install

```js
npm install node-tyccl
```
## Features
**获取同义词**

`getSynonym(word)`获取一个词的同义词，词典中未记录的词或无同义词的词返回空数组

```js
const tyccl = require('./node-tyccl');

let sim = tyccl.getSynonym('日记');

console.log(sim);//[ '日志' ]
```

**计算两个词的相似度**
`getSimilarity(word1,word2)`计算两个词之间的相似度

```js
const tyccl = require('./node-tyccl');

let sim = tyccl.getSimilarity('太阳','花朵');

console.log(sim);//0.6181867355918498
```


## Update
使用的同义词词林的词典位于`./dict/cilin.txt`，可以替换新词典文件，更新方式如下

```js
const createDict = require('./node-tyccl/create-dict');

createDict()

// 创建 词-编码 字典成功
// 创建 编码树 字典成功
// 创建 编码-词 字典成功
```

### 联系
sumh1985@gmail.com


