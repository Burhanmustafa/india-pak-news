# India-Pakistan Conflict News Dashboard

A full-stack web application that provides real-time updates and analysis of the ongoing India-Pakistan conflict. The application fetches news from multiple sources, uses OpenAI to generate comprehensive summaries, and displays relevant images and articles.

## Features

- Real-time news aggregation from multiple sources
- AI-powered 350-word summary of recent developments
- Image gallery from news sources
- Responsive Material-UI design
- Recent articles with links to full coverage

## Setup

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
FLASK_ENV=development
```

5. Run the backend server:
```bash
python app.py
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Architecture

- Backend: Flask (Python)
- Frontend: React with TypeScript
- UI Framework: Material-UI
- News Processing: newspaper3k
- Summary Generation: OpenAI GPT-4

## Contributing

Feel free to submit issues and enhancement requests!