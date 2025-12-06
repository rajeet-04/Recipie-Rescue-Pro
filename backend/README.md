# Recipe Rescue Pro - Backend API

Python FastAPI backend for Recipe Rescue Pro.

## Features

- 🚀 **FastAPI Framework**: Modern, fast, async Python API
- 🍳 **Recipe Search**: Integration with Supercook API (11M+ recipes)
- 📋 **Ingredient Management**: Search and autocomplete from 2000+ ingredients
- 🔍 **Advanced Filtering**: Cuisine, dietary restrictions, cooking time
- 📚 **API Documentation**: Auto-generated OpenAPI docs
- 🔒 **CORS Support**: Configured for frontend integration
- ⚡ **Async Operations**: Non-blocking I/O for better performance

## Getting Started

### Prerequisites

- Python 3.10+
- pip

### Installation

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Run the server:

```bash
python run.py
```

Or using uvicorn directly:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs (Swagger UI)
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Recipes

#### Search Recipes (POST)
```http
POST /api/recipes/search
Content-Type: application/json

{
  "ingredients": ["chicken", "rice", "tomato"],
  "exclude": ["peanuts"],
  "cuisine": "italian",
  "dietary": ["vegetarian"],
  "max_time": 30
}
```

#### Search Recipes (GET)
```http
GET /api/recipes/search?ingredients=chicken,rice,tomato&max_time=30
```

### Ingredients

#### List All Ingredients
```http
GET /api/ingredients/list
```

#### Search Ingredients
```http
GET /api/ingredients/search?query=chicken&limit=20
```

#### Get Categories
```http
GET /api/ingredients/categories
```

### System

#### Health Check
```http
GET /health
```

#### API Info
```http
GET /
```

## Project Structure

```
backend/
├── app/
│   ├── api/                  # API route handlers
│   │   ├── __init__.py
│   │   ├── recipes.py        # Recipe endpoints
│   │   └── ingredients.py    # Ingredient endpoints
│   ├── models/               # Pydantic models
│   │   ├── __init__.py
│   │   ├── ingredient.py
│   │   └── recipe.py
│   ├── services/             # Business logic
│   │   ├── __init__.py
│   │   └── supercook_service.py
│   ├── config.py             # Configuration
│   └── main.py               # FastAPI app
├── tests/                    # Test files
├── requirements.txt          # Python dependencies
├── run.py                    # Application runner
└── README.md                # This file
```

## Configuration

Environment variables (in `.env` file):

```env
# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Future: API Keys
# GEMINI_API_KEY=your_key_here
# SUPABASE_URL=your_url_here
# SUPABASE_KEY=your_key_here
```

## Technologies

- **FastAPI**: Modern Python web framework
- **Pydantic**: Data validation using Python type annotations
- **HTTPX**: Async HTTP client for API calls
- **Uvicorn**: ASGI server implementation

## Development

### Running Tests

```bash
pytest
```

### Code Formatting

```bash
black app/
```

### Type Checking

```bash
mypy app/
```

## API Response Examples

### Recipe Search Response

```json
{
  "recipes": [
    {
      "title": "Chicken Rice Bowl",
      "url": "https://example.com/recipe",
      "img": "https://example.com/image.jpg",
      "ingredients": ["chicken", "rice", "soy sauce"],
      "match": 95
    }
  ],
  "total": 458635,
  "prompt": [
    {
      "ingredient": "garlic",
      "score": 1
    }
  ]
}
```

### Ingredient Search Response

```json
{
  "success": true,
  "query": "chicken",
  "results": [
    {
      "name": "chicken breast",
      "category": "Pantry Essentials"
    },
    {
      "name": "chicken thigh",
      "category": "Meats"
    }
  ],
  "count": 2
}
```

## Future Enhancements

- [ ] Database integration (PostgreSQL/Supabase)
- [ ] User authentication
- [ ] Pantry management endpoints
- [ ] AI photo recognition (Gemini Vision API)
- [ ] Expiration tracking
- [ ] Meal planning
- [ ] Shopping list generation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See LICENSE file in the root directory.
