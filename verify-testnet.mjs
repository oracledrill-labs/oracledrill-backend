import {sdk} from './stellar.mjs';import {readFile} from 'node:fs/promises';import assert from 'node:assert/strict';
const e=JSON.parse(await readFile(new URL('./testnet-evidence.json',import.meta.url)));const server=new sdk.rpc.Server('https://soroban-testnet.stellar.org');assert.equal((await server.getNetwork()).passphrase,sdk.Networks.TESTNET);
const instance=await server.getContractInstance(e.contractId);assert.equal(instance.executable.type,'contractExecutableWasm');assert.equal(Buffer.from(instance.executable.wasmHash.value).toString('hex'),e.wasmHash);
for(const t of e.transactions){const r=await server.getTransaction(t.hash);assert.equal(r.status,'SUCCESS',t.hash)}
console.log(JSON.stringify({contractId:e.contractId,wasmHashMatches:true,confirmedTransactions:e.transactions.length,warning:'Recorded rejected calls are RPC simulations, not included transactions. Synthetic reports; no provider authentication.'},null,2));
