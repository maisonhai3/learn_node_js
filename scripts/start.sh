#!/bin/sh

echo "🔍 Checking migration status..."

# Check if migrations directory exists and has files
if [ ! -d "prisma/migrations" ] || [ -z "$(ls -A prisma/migrations 2>/dev/null)" ]; then
    echo "📝 No migrations found, creating initial migration..."
    npx prisma migrate dev --name init --skip-seed
    if [ $? -eq 0 ]; then
        echo "✅ Initial migration created successfully"
    else
        echo "❌ Failed to create initial migration"
        exit 1
    fi
else
    echo "📦 Migrations found, applying to production database..."
    npx prisma migrate deploy
    if [ $? -eq 0 ]; then
        echo "✅ Migrations applied successfully"
    else
        echo "❌ Failed to apply migrations"
        exit 1
    fi
fi

echo "🔧 Generating Prisma client..."
npx prisma generate
if [ $? -eq 0 ]; then
    echo "✅ Prisma client generated"
else
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo "🚀 Starting Mini-Trello API server..."
node dist/app.js