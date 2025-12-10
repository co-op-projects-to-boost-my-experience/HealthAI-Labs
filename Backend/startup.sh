#!/bin/bash
set -e

echo "🚀 Starting HealthAI Backend..."

# Wait for database
echo "⏳ Waiting for database..."
for i in {1..30}; do
    if python -c "
import sys
try:
    from db import check_db_connection
    if check_db_connection():
        print('✅ Database connected')
        sys.exit(0)
except Exception as e:
    print(f'Attempt {i}/30 failed: {e}')
    sys.exit(1)
" 2>/dev/null; then
        break
    fi
    sleep 2
done

# Initialize database
echo "📦 Initializing database..."
python -c "from db import init_db; init_db()"

# Start server
echo "🌐 Starting server..."
exec uvicorn app:app --host 0.0.0.0 --port 8000 --workers 1