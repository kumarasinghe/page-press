const fs=require("fs"),path=require("path");let cache={};function pagePress(e,n,r){n.render=function(e,r,c){return null==c&&(c=""),new Promise((s,a)=>{try{let t;if(cache[e+c])t=cache[e+c]+"";else{t=fs.readFileSync(e,{encoding:"utf8"});let n=e+".lang";if(fs.existsSync(n)){let e=JSON.parse(fs.readFileSync(n))[c];if(e)for(key in e)t=t.replace(new RegExp("{"+key+"}","g"),e[key])}cache[e+c]=t+""}for(key in r)t=t.replace(new RegExp("{"+key+"}","g"),r[key]);n.end(t),s()}catch(e){a(e)}})},r()}module.exports=pagePress;