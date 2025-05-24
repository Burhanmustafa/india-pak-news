#!/usr/bin/env python3
import os
import sys

# Add backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Change to backend directory
os.chdir(os.path.join(os.path.dirname(__file__), 'backend'))

# Import and run the Flask app
from app import app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False) 