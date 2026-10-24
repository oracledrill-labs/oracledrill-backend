import http from 'node:http';import {randomUUID} from 'node:crypto';import {run} from '../oracledrill-scenario-engine/index.mjs';import {sample} from '../oracledrill-fixtures/index.mjs';
export function createServer(){const runs=new Map();return http.createServer(async(req,res)=>{
 const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data))};
 if(!/^localhost(?::\d+)?$|^127\.0\.0\.1(?::\d+)?$/.test(req.headers.host??''))return send(403,{error:'Loopback Host required'});
 if(req.headers.origin&&!['http://localhost:4370','http://127.0.0.1:4370','http://localhost:4371','http://127.0.0.1:4371'].includes(req.headers.origin))return send(403,{error:'Origin rejected'});
 try{
 if(req.method==='GET'&&req.url==='/health')return send(200,{ok:true,project:'OracleDrill',signing:false});
 if(req.method==='GET'&&req.url==='/sample')return send(200,sample);
 if(req.method==='GET'&&req.url==='/runs')return send(200,[...runs.values()].map(x=>({id:x.id,idHash:x.idHash,summary:x.summary})));
 if(req.method==='GET'&&req.url?.startsWith('/runs/'))return send(runs.has(req.url.slice(6))?200:404,runs.get(req.url.slice(6))??{error:'Not found'});
 if(req.method==='POST'&&req.url==='/review'){
  if(!req.headers['content-type']?.startsWith('application/json'))return send(415,{error:'JSON required'});
  let bytes=0,chunks=[];for await(const chunk of req){bytes+=chunk.length;if(bytes>1048576)return send(413,{error:'1 MiB limit'});chunks.push(chunk)}
  const report=run(JSON.parse(Buffer.concat(chunks).toString())),result={...report,id:randomUUID()};
  if(runs.size>=100)runs.delete(runs.keys().next().value);runs.set(result.id,result);return send(201,result);
 }
 send(404,{error:'Not found'});
 }catch(e){send(400,{error:e.message})}
})}
