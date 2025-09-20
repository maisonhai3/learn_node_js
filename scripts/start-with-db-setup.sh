#!/bin/sh

echo "🔧 Auto Database Setup for Mini-Trello"
echo "====================================="

# Function to wait for database
wait_for_db() {
    echo "⏳ Waiting for database to be ready..."
    while ! npx prisma db ping --silent; do
        echo "   Database not ready, retrying in 2 seconds..."
        sleep 2
    done
    echo "✅ Database is ready!"
}

# Function to setup database
setup_database() {
    echo "📊 Setting up database schema..."
    
    # Check if we need to create migration or just apply
    if [ "$NODE_ENV" = "production" ]; then
        echo "🏭 Production mode: Applying existing migrations..."
        npx prisma migrate deploy
    else
        echo "🛠️  Development mode: Creating/applying migrations..."
        # Try to create initial migration if none exists
        if [ ! -d "prisma/migrations" ] || [ -z "$(ls -A prisma/migrations 2>/dev/null)" ]; then
            echo "📝 Creating initial migration..."
            npx prisma migrate dev --name init --skip-seed
        else
            echo "📦 Applying existing migrations..."
            npx prisma migrate dev --skip-seed
        fi
    fi
    
    # Generate Prisma client
    echo "🔧 Generating Prisma client..."
    npx prisma generate
    
    echo "✅ Database setup completed!"
}

# Main execution
wait_for_db
setup_database

echo "🚀 Starting Mini-Trello API server..."
exec node dist/app.js