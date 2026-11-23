import{readFileSync as read,writeFileSync as write,readdirSync as list,mkdirSync as mkdir}from'node:fs';
const spec=new Map();
for(const row of '0,0,0,0;1,1,0,1;2,4,0,1;3,0,1,0;4,0,1,2;5,0,2,2;6,0,2,3;7,0,3,3;16,0,2,1;17,0,2,1;18,0,2,1;19,0,2,1;20,0,2,1;21,0,2,1;22,0,2,1;23,0,1,1;24,0,2,1;25,0,2,1;26,0,2,1;27,0,1,1;28,0,2,1;29,0,2,1;30,0,2,1;32,0,2,1;33,0,2,1;34,0,2,1;48,2,0,0;49,2,1,0;50,2,1,0;51,2,0,0;52,0,0,0;64,0,1,1;65,0,2,0;80,0,1,0;81,0,1,0;82,0,0,1;83,0,1,0'.split(';')){
 const[o,...s]=row.split(',').map(Number);spec.set(o,s);
}
function execute(p,input){
 const s=[],calls=[],mem=new Int32Array(256),out=Buffer.alloc(65536);
 let pc=0,ip=0,len=0,code=10;
 const stop=n=>{throw n};
 try{for(let steps=0;steps<1000000;steps++){
  if(pc<0||pc>=p.length)stop(9);
  const op=p[pc],rule=spec.get(op);
  if(!rule)stop(5);
  const[imm,pop,push]=rule;
  if(pc+imm>=p.length)stop(9);
  if(s.length<pop)stop(2);
  if(s.length-pop+push>256)stop(3);
  const at=pc+1;pc+=1+imm;
  if(op===0)stop(0);
  if(op===1){s.push(p.readInt8(at));continue}
  if(op===2){s.push(p.readInt32LE(at));continue}
  if(op===3){s.pop();continue}
  if(op===4){s.push(s.at(-1));continue}
  if(op===5){const b=s.pop(),a=s.pop();s.push(b,a);continue}
  if(op===6){s.push(s.at(-2));continue}
  if(op===7){s.push(s.splice(s.length-3,1)[0]);continue}
  if(op===23||op===27){const a=s.pop();s.push(op===23?-a|0:~a);continue}
  if(op>=16&&op<=34){
   const b=s.pop(),a=s.pop();let r=0;
   if(op>=19&&op<=22&&b===0)stop(4);
   switch(op){
    case 16:r=a+b;break;case 17:r=a-b;break;case 18:r=Math.imul(a,b);break;
    case 19:r=a/b;break;case 20:r=a%b;break;
    case 21:r=(a>>>0)/(b>>>0);break;case 22:r=(a>>>0)%(b>>>0);break;
    case 24:r=a&b;break;case 25:r=a|b;break;case 26:r=a^b;break;
    case 28:r=a<<b;break;case 29:r=a>>b;break;case 30:r=a>>>b;break;
    case 32:r=+(a===b);break;case 33:r=+(a<b);break;case 34:r=+((a>>>0)<(b>>>0));break;
   }s.push(r|0);continue;
  }
  if(op>=48&&op<=50){
   const take=op===48||(s.pop()===0)===(op===49);
   if(take)pc+=p.readInt16LE(at);continue;
  }
  if(op===51){if(calls.length===64)stop(7);calls.push(pc);pc=p.readUInt16LE(at);continue}
  if(op===52){if(!calls.length)stop(8);pc=calls.pop();continue}
  if(op===64||op===65){
   const addr=s.pop();if(addr<0||addr>255)stop(6);
   if(op===64)s.push(mem[addr]);else mem[addr]=s.pop();continue;
  }
  if(op===80||op===81){
   const v=s.pop(),bytes=op===80?Buffer.from(String(v)):Buffer.from([v&255]);
   if(len+bytes.length>out.length)stop(11);
   bytes.copy(out,len);len+=bytes.length;continue;
  }
  if(op===82){s.push(ip<input.length?input[ip++]:-1);continue}
  if(op===83)stop(s.pop()&255);
 }
 }catch(e){if(typeof e!=='number')throw e;code=e}
 return[out.subarray(0,len),String(code)+'\n'];
}
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const id of list(I).sort()){
 const base=I+'/'+id+'/',dest=O+'/'+id+'/';
 const[out,code]=execute(read(base+'program.bin'),read(base+'input.bin'));
 mkdir(dest,{recursive:true});write(dest+'stdout.bin',out);write(dest+'exit.txt',code);
}
