#!/bin/bash

echo "🚀 Mini-Trello Performance Testing Suite"
echo "========================================"
echo ""

show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  quick     Run quick baseline tests (30 seconds)"
    echo "  full      Run comprehensive performance tests (5+ minutes)" 
    echo "  stress    Run stress tests only"
    echo "  compare   Show existing results comparison"
    echo "  clean     Clean up test results"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 quick      # Quick baseline comparison"
    echo "  $0 full       # Full performance suite"
    echo "  $0 compare    # View results from last test"
}

check_servers() {
    echo "🔍 Checking if servers are running..."
    
    if ! curl -s http://localhost:3000/health > /dev/null; then
        echo "❌ Express.js server not running on port 3000"
        echo "   Run: npm run docker:perf"
        exit 1
    fi
    
    if ! curl -s http://localhost:4000/health > /dev/null; then
        echo "❌ Fastify server not running on port 4000"  
        echo "   Run: npm run docker:perf"
        exit 1
    fi
    
    echo "✅ Both servers are running"
}

run_quick_test() {
    echo "⚡ Running quick baseline tests..."
    mkdir -p stress-tests/results
    cd stress-tests
    
    echo "Testing Express.js..."
    autocannon -c 10 -d 10 http://localhost:3000/boards > results/quick-express.txt 2>&1
    
    echo "Testing Fastify..."
    autocannon -c 10 -d 10 http://localhost:4000/boards > results/quick-fastify.txt 2>&1
    
    echo ""
    echo "📊 Quick Results:"
    echo "Express.js:"
    grep "Req/Sec" results/quick-express.txt | tail -1
    echo "Fastify:"
    grep "Req/Sec" results/quick-fastify.txt | tail -1
}

run_stress_test() {
    echo "🔥 Running stress tests..."
    mkdir -p stress-tests/results
    cd stress-tests
    
    echo "Testing Express.js under high load..."
    autocannon -c 100 -d 30 -p 10 http://localhost:3000/boards > results/stress-express.txt 2>&1
    
    echo "Testing Fastify under high load..."
    autocannon -c 100 -d 30 -p 10 http://localhost:4000/boards > results/stress-fastify.txt 2>&1
    
    echo ""
    echo "📊 Stress Test Results:"
    echo "Express.js:"
    grep "Req/Sec" results/stress-express.txt | tail -1
    echo "Fastify:" 
    grep "Req/Sec" results/stress-fastify.txt | tail -1
}

show_comparison() {
    if [ -f "stress-tests/results/performance-analysis.md" ]; then
        echo "📈 Performance Analysis Results:"
        echo "================================"
        head -20 stress-tests/results/performance-analysis.md
        echo ""
        echo "📄 Full report: stress-tests/results/performance-analysis.md"
    else
        echo "❌ No performance results found. Run tests first."
    fi
}

clean_results() {
    echo "🧹 Cleaning up test results..."
    rm -rf stress-tests/results
    echo "✅ Results cleaned"
}

# Main script logic
case "${1:-help}" in
    quick)
        check_servers
        run_quick_test
        ;;
    full)
        check_servers
        ./stress-tests/run-performance-test.sh
        ;;
    stress)
        check_servers
        run_stress_test
        ;;
    compare)
        show_comparison
        ;;
    clean)
        clean_results
        ;;
    help|*)
        show_help
        ;;
esac