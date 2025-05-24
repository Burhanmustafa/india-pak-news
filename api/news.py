from http.server import BaseHTTPRequestHandler
import json
import sys
import os

# Add the backend directory to the path so we can import our Flask app
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

try:
    from app import fetch_news_articles, generate_summary, fetch_youtube_videos, extract_conflict_statistics, extract_trending_keywords, extract_geographic_hotspots
except ImportError as e:
    print(f"Import error: {e}")
    
    def fetch_news_articles():
        return []
    def generate_summary(articles):
        return "Service temporarily unavailable"
    def fetch_youtube_videos():
        return []
    def extract_conflict_statistics(articles):
        return {}
    def extract_trending_keywords(articles):
        return []
    def extract_geographic_hotspots(articles):
        return []

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # CORS headers
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            # Get news data
            articles = fetch_news_articles()
            
            if not articles:
                response_data = {
                    'error': 'No recent news articles found',
                    'articles': [],
                    'images': [],
                    'youtube_videos': [],
                    'statistics': {},
                    'trending_keywords': [],
                    'geographic_hotspots': []
                }
            else:
                summary = generate_summary(articles)
                youtube_videos = fetch_youtube_videos()
                statistics = extract_conflict_statistics(articles)
                trending_keywords = extract_trending_keywords(articles)
                geographic_hotspots = extract_geographic_hotspots(articles)
                
                response_data = {
                    'summary': summary,
                    'articles': articles[:5],
                    'images': [article['image'] for article in articles if article.get('image')][:5],
                    'youtube_videos': youtube_videos,
                    'statistics': statistics,
                    'trending_keywords': trending_keywords,
                    'geographic_hotspots': geographic_hotspots
                }
            
            self.wfile.write(json.dumps(response_data).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_response = {'error': str(e)}
            self.wfile.write(json.dumps(error_response).encode())
    
    def do_OPTIONS(self):
        # Handle CORS preflight
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers() 