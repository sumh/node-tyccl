/*
* @Author: SumH
* @Date:   2017-07-05 19:56:18
* @Last Modified by:   SumH
* @Last Modified time: 2017-10-20 22:54:00
*/
//引入依赖库
const _ = require('lodash');
const jsonfile = require('jsonfile');
const path = require('path');
const algorithm = require('./algorithm');
const createDict = require('./create-dict');

//《同义词词林相似度计算》中定义的一些计算常量
const a = 0.65;
const b = 0.8;
const c = 0.9;
const d = 0.96;
const e = 0.5;
const f = 0.1;
const degree = 180;

//获取相似度的函数
exports.getSimilarity = function(word1,word2){

  //读取词为key,编码为值的数据库
  let wordsEncode = jsonfile.readFileSync(path.join(__dirname,'dict/words-encode.json'));

  //获取两个值的编码(数组)
  let encode1 = wordsEncode[word1];
  let encode2 = wordsEncode[word2];

  //如果该词不在词林中
  if(encode1 === undefined || encode2 === undefined){

    return 0;

  //如果两个词都在词林中，继续匹配
  }else{

    let maxValue = 0;
    let result = 0;

    for (let i in encode1){
      for(let j in encode2){

        let e1 = encode1[i];
        let e2 = encode2[j];

        let matches = algorithm.getMatches(e1,e2);
        let k = algorithm.getK(e1,e2);
        let n = algorithm.getN(matches);


        //如果该编码为自封闭或者两个词的编码完全不一致，直接返回f
        if(e1.indexOf('@') !== -1 || e2.indexOf('@') !== -1 || matches.length === 0){


          maxValue = f;


        //进行逐级比较
        }else{

          //在第二层进行计算
          if(matches.length === 1){

            result = a*Math.cos(n*Math.PI/degree)*((n-k+1)/n);

          //在第三层上进行计算
          }else if(matches.length === 2){

            result = b*Math.cos(n*Math.PI/degree)*((n-k+1)/n);


          //在第四层上进行计算
          }else if(matches.length === 4){

            result = c*Math.cos(n*Math.PI/degree)*((n-k+1)/n);

          //在第五层上进行计算
          }else if(matches.length === 5){

            result = d*Math.cos(n*Math.PI/degree)*((n-k+1)/n);

          //完全相同
          }else{

            //如果以"="结尾
            if(e1[7] === '='){

              result = 1;

              //如果以"#"结尾
            }else{

              result = e;
            }
          }


        }

        //判断是不是最优值
        if(result > maxValue){

          maxValue = result;
        }

      }
    }

    return maxValue;

  }

};


//相似度为1的的两个词
exports.getSynonym = function(word,number=10){

  //读取词为key,编码为值的数据库
  let wordsEncode = jsonfile.readFileSync(path.join(__dirname,'dict/words-encode.json'));

  //读取编码为key,词为值的数据库
  let encodeWords = jsonfile.readFileSync(path.join(__dirname,'dict/encode-words.json'));

  let sameArray = [];
  let encodeArray = wordsEncode[word];

  //如果为该词没有定义或者所属类别最后一位不为=返回空
  if (!encodeArray) return sameArray;


  // 对该词的每个所属编码进行操作
  _.forEach(encodeArray,function(encode){

    if(encode.charAt(7) === '=') return sameArray.push(encodeWords[encode]);

  });


  let synonyms = [];

  _.forEach(sameArray,function(same){

    let n = Math.min(number,same.length);

    for(let i=0;i<n;i++){

      if (same[i] !== word){
        synonyms.push(same[i]);
      }

    }

  });


  return synonyms;

};

// 更新词典
exports.updateDict = function(file){

  //获取文件执行路径
  let filePath = path.join(process.cwd(),file);

  // 创建词典
  createDict(filePath);
};

