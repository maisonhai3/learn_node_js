# Performance Comparison: Express.js vs Fastify

## Test Environment
- **Express.js**: Port 3000 (Node.js with TypeScript)
- **Fastify**: Port 4000 (Node.js with TypeScript)  
- **Database**: PostgreSQL (shared between both)
- **Infrastructure**: Docker containers
- **Test Tools**: Artillery (complex scenarios) + autocannon (raw performance)

## Test Scenarios

### 1. Baseline Test (10 connections, 10 seconds)
**Express.js Results:**
```
```
│ Latency │ 6 ms │ 10 ms │ 23 ms │ 27 ms │ 11.47 ms │ 10.24 ms │ 285 ms │
└─────────┴──────┴───────┴───────┴───────┴──────────┴──────────┴────────┘
┌───────────┬────────┬────────┬────────┬────────┬────────┬─────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%  │ Avg    │ Stdev   │ Min    │
├───────────┼────────┼────────┼────────┼────────┼────────┼─────────┼────────┤
│ Req/Sec   │ 519    │ 519    │ 847    │ 1,027  │ 834.8  │ 139.11  │ 519    │
├───────────┼────────┼────────┼────────┼────────┼────────┼─────────┼────────┤
│ Bytes/Sec │ 294 kB │ 294 kB │ 480 kB │ 583 kB │ 473 kB │ 78.9 kB │ 294 kB │
└───────────┴────────┴────────┴────────┴────────┴────────┴─────────┴────────┘

Req/Bytes counts sampled once per second.
# of samples: 10

8k requests in 10.03s, 4.73 MB read
```

**Fastify Results:**
```
│ Latency │ 6 ms │ 11 ms │ 25 ms │ 30 ms │ 12.55 ms │ 8.84 ms │ 228 ms │
└─────────┴──────┴───────┴───────┴───────┴──────────┴─────────┴────────┘
┌───────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%  │ Avg    │ Stdev  │ Min    │
├───────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┤
│ Req/Sec   │ 463    │ 463    │ 817    │ 925    │ 765.2  │ 139.52 │ 463    │
├───────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┤
│ Bytes/Sec │ 239 kB │ 239 kB │ 422 kB │ 477 kB │ 395 kB │ 72 kB  │ 239 kB │
└───────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┘

Req/Bytes counts sampled once per second.
# of samples: 10

8k requests in 10.03s, 3.95 MB read
```

### 2. Comprehensive Load Test (Artillery)
**Express.js Artillery Results:**
```
```
```

**Fastify Artillery Results:**
```
```

### 3. High Load Stress Test (100 connections, 30 seconds)
**Express.js Stress Results:**
```
```
│ Latency │ 807 ms │ 930 ms │ 1141 ms │ 1155 ms │ 941.66 ms │ 97.75 ms │ 1215 ms │
└─────────┴────────┴────────┴─────────┴─────────┴───────────┴──────────┴─────────┘
┌───────────┬────────┬────────┬────────┬────────┬──────────┬────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%  │ Avg      │ Stdev  │ Min    │
├───────────┼────────┼────────┼────────┼────────┼──────────┼────────┼────────┤
│ Req/Sec   │ 674    │ 674    │ 1,009  │ 1,355  │ 1,042.87 │ 141.02 │ 674    │
├───────────┼────────┼────────┼────────┼────────┼──────────┼────────┼────────┤
│ Bytes/Sec │ 382 kB │ 382 kB │ 572 kB │ 769 kB │ 591 kB   │ 80 kB  │ 382 kB │
└───────────┴────────┴────────┴────────┴────────┴──────────┴────────┴────────┘

Req/Bytes counts sampled once per second.
# of samples: 30

32k requests in 30.07s, 17.7 MB read
```

**Fastify Stress Results:**
```
│ Latency │ 925 ms │ 1030 ms │ 1356 ms │ 1438 ms │ 1048.62 ms │ 127.21 ms │ 1683 ms │
└─────────┴────────┴─────────┴─────────┴─────────┴────────────┴───────────┴─────────┘
┌───────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%  │ Avg    │ Stdev  │ Min    │
├───────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┤
│ Req/Sec   │ 405    │ 405    │ 971    │ 1,058  │ 937.27 │ 125.88 │ 405    │
├───────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┤
│ Bytes/Sec │ 209 kB │ 209 kB │ 501 kB │ 546 kB │ 484 kB │ 65 kB  │ 209 kB │
└───────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┘

Req/Bytes counts sampled once per second.
# of samples: 30

29k requests in 30.15s, 14.5 MB read
```

## Key Metrics Comparison

| Metric | Express.js | Fastify | Winner |
|--------|------------|---------|---------|
| Requests/sec | [Check results] | [Check results] | TBD |
| Average Latency | [Check results] | [Check results] | TBD |
| Memory Usage | [Check Docker stats] | [Check Docker stats] | TBD |

## Conclusion

[Analysis will be based on the actual test results]

