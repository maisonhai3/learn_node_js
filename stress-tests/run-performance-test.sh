#!/bin/bash

echo "🚀 Mini-Trello Performance Comparison: Express.js vs Fastify"
echo "=============================================================="

# Create results directory
mkdir -p stress-tests/results
cd stress-tests

echo ""
echo "📊 Starting performance tests..."
echo "Express.js server: http://localhost:3000"  
echo "Fastify server: http://localhost:4000"
echo ""

# Wait for servers to be ready
echo "⏳ Waiting for servers to be ready..."
sleep 5

# Test 1: Quick autocannon test for baseline
echo "🔥 Test 1: Quick baseline test with autocannon"
echo "Testing Express.js..."
autocannon -c 10 -d 10 http://localhost:3000/boards > results/autocannon-express-baseline.txt 2>&1

echo "Testing Fastify..."
autocannon -c 10 -d 10 http://localhost:4000/boards > results/autocannon-fastify-baseline.txt 2>&1

# Test 2: Artillery comprehensive test
echo ""
echo "🎯 Test 2: Comprehensive load test with Artillery"
echo "Testing Express.js (this will take ~2 minutes)..."
artillery run artillery-express.yml -o results/artillery-express.json > results/artillery-express.txt 2>&1

echo "Testing Fastify (this will take ~2 minutes)..."  
artillery run artillery-fastify.yml -o results/artillery-fastify.json > results/artillery-fastify.txt 2>&1

# Test 3: High load test with autocannon
echo ""
echo "⚡ Test 3: High load stress test"
echo "Testing Express.js under high load..."
autocannon -c 100 -d 30 -p 10 http://localhost:3000/boards > results/autocannon-express-stress.txt 2>&1

echo "Testing Fastify under high load..."
autocannon -c 100 -d 30 -p 10 http://localhost:4000/boards > results/autocannon-fastify-stress.txt 2>&1

# Generate summary report
echo ""
echo "📈 Generating performance comparison report..."

cat > results/performance-summary.md << 'EOF'
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
EOF

echo '```' >> results/performance-summary.md
grep -A 10 "Req/Sec\|Latency" results/autocannon-express-baseline.txt >> results/performance-summary.md
echo '```' >> results/performance-summary.md

echo "" >> results/performance-summary.md
echo "**Fastify Results:**" >> results/performance-summary.md
echo '```' >> results/performance-summary.md
grep -A 10 "Req/Sec\|Latency" results/autocannon-fastify-baseline.txt >> results/performance-summary.md
echo '```' >> results/performance-summary.md

cat >> results/performance-summary.md << 'EOF'

### 2. Comprehensive Load Test (Artillery)
**Express.js Artillery Results:**
```
EOF

echo '```' >> results/performance-summary.md
grep -A 5 "Summary report\|All virtual users finished" results/artillery-express.txt >> results/performance-summary.md
echo '```' >> results/performance-summary.md

echo "" >> results/performance-summary.md
echo "**Fastify Artillery Results:**" >> results/performance-summary.md
echo '```' >> results/performance-summary.md
grep -A 5 "Summary report\|All virtual users finished" results/artillery-fastify.txt >> results/performance-summary.md
echo '```' >> results/performance-summary.md

cat >> results/performance-summary.md << 'EOF'

### 3. High Load Stress Test (100 connections, 30 seconds)
**Express.js Stress Results:**
```
EOF

echo '```' >> results/performance-summary.md
grep -A 10 "Req/Sec\|Latency" results/autocannon-express-stress.txt >> results/performance-summary.md
echo '```' >> results/performance-summary.md

echo "" >> results/performance-summary.md
echo "**Fastify Stress Results:**" >> results/performance-summary.md
echo '```' >> results/performance-summary.md
grep -A 10 "Req/Sec\|Latency" results/autocannon-fastify-stress.txt >> results/performance-summary.md
echo '```' >> results/performance-summary.md

cat >> results/performance-summary.md << 'EOF'

## Key Metrics Comparison

| Metric | Express.js | Fastify | Winner |
|--------|------------|---------|---------|
| Requests/sec | [Check results] | [Check results] | TBD |
| Average Latency | [Check results] | [Check results] | TBD |
| Memory Usage | [Check Docker stats] | [Check Docker stats] | TBD |

## Conclusion

[Analysis will be based on the actual test results]

EOF

echo ""
echo "✅ Performance tests completed!"
echo "📊 Results saved in stress-tests/results/"
echo "📈 Summary report: stress-tests/results/performance-summary.md"
echo ""
echo "🔍 Quick comparison:"
echo "Express.js baseline:"
grep "Req/Sec" results/autocannon-express-baseline.txt | head -1
echo "Fastify baseline:"  
grep "Req/Sec" results/autocannon-fastify-baseline.txt | head -1