//引入依赖
const fs = require('fs');
const _ = require('lodash');
const jsonfile = require('jsonfile');
const path = require('path');

// 默认字典路径
let defaultPath = path.join(__dirname,'/dict/cilin.txt');

//创建“编码-词”字典
let createEncodeWords = function(synonymArray){

  //编码为key,词为value
  let encodeWords = {};

  //构建编码为key，词为value的对象
  for(let i = 0;i<synonymArray.length;i++){

    //把词转换为数组
    let value = synonymArray[i].slice(synonymArray[i].indexOf(' ')+1);
    let valueArray = value.split(' ');

    //构建对象
    let key = synonymArray[i].slice(0,synonymArray[i].indexOf(' '));
    encodeWords[key] = valueArray;

  }

  return encodeWords;
};


//创建“词-编码”字典
let createWrodsEncode = function(synonymArray){

  //词为key，编码为value
  let wordsEncode = {};

  //构建词为key，编码为value的对象
  for (let i = 0;i<synonymArray.length ;i++){

    //提取编码值
    let value = synonymArray[i].slice(0,synonymArray[i].indexOf(' '));

    //将词构建为数组
    let rawWords = synonymArray[i].slice(synonymArray[i].indexOf(' ')+1);
    let wordsArr = rawWords.split(' ');


    for(let i = 0; i<wordsArr.length;i++){

      //每个词为key，值为数组
      let key = wordsArr[i];


      //如果值的数组还不存在
      if(wordsEncode[key] === undefined ){

        wordsEncode[key] = [];
        wordsEncode[key].push(value);

        //如果有值说明数组已经存在了，增加新值并且去重
      }else{

        //增加新值
        wordsEncode[key].push(value);

      }

    }
  }

  return wordsEncode;

};


let createEncodeTree = function(encodeWords){

  //构建编码分支树
  let encodeTree = {};
  let encodeArray = _.keys(encodeWords);


  for(let i=0;i<encodeArray.length;i++){

    //将编码变为7位
    let encode = encodeArray[i].slice(0,7);


    //定义变换方式
    let level = [1,2,3,5];
    let exp = [1,2,4,5];
    let step = [1,2,2,2];


    for(let i=0; i<4 ;i++){

      //获取键及值
      let key = encode.slice(0,exp[i]);
      let value = encode.slice(exp[i],level[i]+step[i]);
      if(encodeTree[key] === undefined){

        encodeTree[key] = [];
        encodeTree[key].push(value);

      }else{
        encodeTree[key].push(value);
        encodeTree[key]= _.uniq(encodeTree[key]);

      }

    }

  }

  return encodeTree;

};

// 创建字典
let createDict = function(file=defaultPath){

    //读取词典文件
  let rawData = fs.readFileSync(file, 'utf-8');

  //构建同义词数组
  let synonymArray = rawData.split('\n');


  let encodeWords = createEncodeWords(synonymArray);
  let wordsEncode = createWrodsEncode(synonymArray);
  let encodeTree = createEncodeTree(encodeWords);

  //将wordsEncode写入文件
  jsonfile.writeFile(path.join(__dirname,'/dict/words-encode.json'),wordsEncode,function(err) {
    if(err) return console.log('创建 词-编码 字典失败');
    console.log('创建 词-编码 字典成功');
  });


  //将encodeWords写入文件
  jsonfile.writeFile(path.join(__dirname,'/dict/encode-words.json'),encodeWords,function(err) {
    if(err) return console.log('创建 编码-词 字典失败');
    console.log('创建 编码-词 字典成功');
  });


  //将encodeTree写入文件
  jsonfile.writeFile(path.join(__dirname,'/dict/encode-tree.json'),encodeTree,function(err) {
    if(err) return console.log('创建 编码树 字典失败');
    console.log('创建 编码树 字典成功');
  });


};

module.exports = createDict;

