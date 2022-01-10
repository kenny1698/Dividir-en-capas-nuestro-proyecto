const autocannon = require('autocannon')
const { PassThrough } = require('stream')

function run(url) {
  const buf = []
  const outputStream = new PassThrough()

  const inst = autocannon({
    url,
    connections: 100,
    duration: 20
  })

  autocannon.track(inst, { outputStream })

  outputStream.on('data', data => buf.push(data))
  inst.on('done', () => {
    process.stdout.write(Buffer.concat(buf))
  })
}

console.log('Running all benchmarks in parallel ...')

run('http://localhost:8081/api/randomsnoBloq?cant=5')
run('http://localhost:8081/api/randomsBloq?cant=5')

/*
node benchmark.js
Running all benchmarks in parallel ...
Running 20s test @ http://localhost:8080/api/randomsnoBloq?cant=5    
100 connections

┌─────────┬─────────┬─────────┬─────────┬─────────┬────────────┬────────────┬─────────┐
│ Stat    │ 2.5%    │ 50%     │ 97.5%   │ 99%     │ Avg        │ Stdev      │ Max     │
├─────────┼─────────┼─────────┼─────────┼─────────┼────────────┼────────────┼─────────┤
│ Latency │ 7484 ms │ 7528 ms │ 9974 ms │ 9975 ms │ 8613.65 ms │ 1228.29 ms │ 9975 ms │
└─────────┴─────────┴─────────┴─────────┴─────────┴────────────┴────────────┴─────────┘
┌───────────┬─────┬──────┬─────┬─────────┬─────────┬─────────┬─────────┐
│ Stat      │ 1%  │ 2.5% │ 50% │ 97.5%   │ Avg     │ Stdev   │ Min   
  │
├───────────┼─────┼──────┼─────┼─────────┼─────────┼─────────┼─────────┤
│ Req/Sec   │ 0   │ 0    │ 0   │ 33      │ 3       │ 9.05    │ 27    
  │
├───────────┼─────┼──────┼─────┼─────────┼─────────┼─────────┼─────────┤
│ Bytes/Sec │ 0 B │ 0 B  │ 0 B │ 12.9 kB │ 1.17 kB │ 3.53 kB │ 10.5 kB │
└───────────┴─────┴──────┴─────┴─────────┴─────────┴─────────┴─────────┘

Req/Bytes counts sampled once per second.

300 requests in 20.28s, 23.4 kB read
140 errors (140 timeouts)
Running 20s test @ http://localhost:8080/api/randomsBloq?cant=5
100 connections

┌─────────┬────────┬─────────┬─────────┬─────────┬────────────┬────────────┬─────────┐
│ Stat    │ 2.5%   │ 50%     │ 97.5%   │ 99%     │ Avg        │ Stdev      │ Max     │
├─────────┼────────┼─────────┼─────────┼─────────┼────────────┼────────────┼─────────┤
│ Latency │ 101 ms │ 3201 ms │ 9873 ms │ 9881 ms │ 3974.69 ms │ 3649.83 ms │ 9885 ms │
└─────────┴────────┴─────────┴─────────┴─────────┴────────────┴────────────┴─────────┘
┌───────────┬─────┬──────┬─────┬─────────┬─────────┬─────────┬───────┐
│ Stat      │ 1%  │ 2.5% │ 50% │ 97.5%   │ Avg     │ Stdev   │ Min   
│
├───────────┼─────┼──────┼─────┼─────────┼─────────┼─────────┼───────┤
│ Req/Sec   │ 0   │ 0    │ 0   │ 189     │ 20.7    │ 44.15   │ 1     
│
├───────────┼─────┼──────┼─────┼─────────┼─────────┼─────────┼───────┤
│ Bytes/Sec │ 0 B │ 0 B  │ 0 B │ 73.9 kB │ 8.08 kB │ 17.2 kB │ 391 B 
│
└───────────┴─────┴──────┴─────┴─────────┴─────────┴─────────┴───────┘

Req/Bytes counts sampled once per second.

514 requests in 20.74s, 162 kB read
*/