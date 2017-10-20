/*
* @Author: SumH
* @Date:   2017-10-20 09:34:41
* @Last Modified by:   SumH
* @Last Modified time: 2017-10-20 19:42:56
*/
const jsonfile = require('jsonfile');
const path = require('path');

//读取编码树状结构
let encodeTree = jsonfile.readFileSync(path.join(__dirname,'dict/encode-tree.json'));

//获取编码匹配度的函数
exports.getMatches = (e1,e2)=>{
  let matches = '';

  for(let i =0; i<e1.length ;i++){


    //逐位匹配e1和e2的相似程度，匹配不到为止
    if(e1.charAt(i) === e2.charAt(i)){
      matches += e1.charAt(i);
    }else{
      //如果匹配不到就停止
      break;
    }
  }

  //第三层和第五层均为2个字符，所以只匹配3和6位不算完全匹配上三和五层
  if(matches.length === 3 || matches.length === 6){
    matches = matches.slice(0,matches.length-1);
  }
  return matches;
};


//获取K值
exports.getK= (e1,e2) =>{

  //先获取第一分支的字幕
  let temp1 = e1.slice(0,1);
  let temp2 = e2.slice(0,1);

  if(temp1.toLowerCase() === temp2.toLowerCase()){

    //继续下一个分支比较
    temp1 = e1.slice(1,2);
    temp2 = e2.slice(1,2);

  }else{

    //返回K值
    return Math.abs(temp1.toLowerCase().charCodeAt(0) - temp2.toLowerCase().charCodeAt(0));

  }

  //比较第二分支
  if(temp1.toLowerCase() === temp2.toLowerCase()){

    //继续下一个分支比较
    temp1 = e1.slice(2,4);
    temp2 = e2.slice(2,4);

  }else{

    //返回K值
    return Math.abs(temp1.toLowerCase().charCodeAt(0) - temp2.toLowerCase().charCodeAt(0));

  }


  //比较第三分支
  if(parseInt(temp1) === parseInt(temp2)){

    //继续下一个分支比较
    temp1 = e1.slice(4,5);
    temp2 = e2.slice(4,5);


  }else{

    //返回K值
    return Math.abs(parseInt(temp1)-parseInt(temp2));

  }

  //比较第四分支
  if(temp1.toLowerCase() === temp2.toLowerCase()){

    //继续下一个分支比较
    temp1 = e1.slice(5,7);
    temp2 = e2.slice(5,7);

  }else{

    //返回K值
    return Math.abs(temp1.toLowerCase().charCodeAt(0) - temp2.toLowerCase().charCodeAt(0));

  }

  //比较第五分支
  return Math.abs(parseInt(temp1)-parseInt(temp2));


};


//获取N值
exports.getN = (head)=>{

  //如果没有相似部分，n为0
  if(head.length === 0){

    return 0;

  }else{

    //如果存在于编码数之中
    if(encodeTree[head] !== undefined){

      //返回该分支个数
      return encodeTree[head].length;

    }else{

      return 0;
    }
  }

};