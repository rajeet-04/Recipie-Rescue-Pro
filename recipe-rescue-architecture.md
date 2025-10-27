# Recipe Rescue Pro - Enhanced Architecture Specification

## 🏗️ System Overview

**Tech Stack:**
- **Frontend:** Next.js 14 + Tailwind CSS + TypeScript
- **Backend:** Python FastAPI with async support
- **Database:** Supabase PostgreSQL with real-time subscriptions
- **AI Vision:** Gemini Vision API with object detection
- **Recipe API:** Supercook API with advanced filtering
- **Development:** AI-assisted with Copilot/Cursor (6-8 week timeline)

## 📁 Project Structure

### Frontend (Next.js 14)

```
frontend/
├── app/
│   ├── layout.js                 # Root layout with Supabase auth
│   ├── page.js                   # Dashboard/home page
│   ├── upload/
│   │   └── page.js               # Photo upload and ingredient detection
│   ├── pantry/
│   │   └── page.js               # Pantry management interface
│   ├── recipes/
│   │   └── page.js               # Recipe search and browsing
│   └── profile/
│       └── page.js               # User settings and preferences
├── components/
│   ├── PhotoUpload.jsx           # Camera/file upload with preview
│   ├── IngredientConfirm.jsx     # Ingredient selection with confidence scores
│   ├── PantryGrid.jsx            # Visual pantry inventory with expiration
│   ├── RecipeCard.jsx            # Recipe display with confidence scoring
│   ├── FilterPanel.jsx           # Advanced recipe filtering (cuisine, time, etc.)
│   └── Layout/
│       ├── Navbar.jsx            # Navigation with user menu
│       └── Sidebar.jsx           # Mobile-friendly sidebar
├── lib/
│   ├── supabase.js               # Supabase client configuration
│   ├── api.js                    # Backend API calls
│   └── utils.js                  # Helper functions and constants
└── public/
    └── ingredients/              # Sample ingredient images for testing
```

**Key Frontend Features:**
- Photo capture/upload with camera integration
- Real-time ingredient confidence scoring display
- Drag-and-drop pantry management
- Advanced recipe filtering with multiple categories
- Mobile-first responsive design
- Real-time pantry updates via Supabase subscriptions

### Backend (Python FastAPI)

```
backend/
├── app/
│   ├── main.py                   # FastAPI app with CORS and middleware
│   ├── config.py                 # Environment variables and settings
│   ├── models/
│   │   ├── ingredient.py         # Ingredient data models
│   │   ├── recipe.py             # Recipe and search models
│   │   ├── user.py               # User and pantry models
│   │   └── api_models.py         # Request/response Pydantic models
│   ├── services/
│   │   ├── gemini_service.py     # Object detection and ingredient recognition
│   │   ├── supercook_service.py  # Recipe search with catname filtering
│   │   ├── pantry_service.py     # Pantry management and expiration logic
│   │   └── recommendation_service.py  # Recipe scoring and recommendations
│   ├── api/
│   │   ├── ingredients.py        # Ingredient detection endpoints
│   │   ├── pantry.py             # Pantry management endpoints
│   │   ├── recipes.py            # Recipe search endpoints
│   │   └── users.py              # User management endpoints
│   ├── db/
│   │   ├── connection.py         # Supabase connection
│   │   └── queries.py            # Database query functions
│   └── utils/
│       ├── image_processing.py   # Image optimization and validation
│       ├── confidence_scoring.py # Ingredient confidence algorithms
│       └── cache.py              # Redis-like caching for API responses
├── requirements.txt              # Python dependencies
└── .env.example                  # Environment variables template
```

**Key Backend Services:**

1. **Gemini Service** (`gemini_service.py`)
   - Object detection with bounding boxes
   - Ingredient confidence scoring
   - Image preprocessing and optimization
   - Batch processing for multiple ingredients

2. **Supercook Service** (`supercook_service.py`)
   - Advanced catname parameter construction
   - Recipe result processing and enhancement
   - Caching for API efficiency
   - Error handling and fallbacks

3. **Pantry Service** (`pantry_service.py`)
   - Expiration date tracking and alerts
   - Ingredient quantity management
   - Smart suggestions based on usage patterns
   - Integration with recipe recommendations

4. **Recommendation Service** (`recommendation_service.py`)
   - Recipe confidence scoring based on available ingredients
   - Dietary preference filtering
   - Cuisine preference learning
   - Cooking time and skill level matching

### Database (Supabase PostgreSQL)

```sql
-- Users table with authentication
CREATE TABLE users (
    id UUID REFERENCES auth.users PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    full_name VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferences JSONB DEFAULT '{}',
    subscription_tier VARCHAR DEFAULT 'free'
);

-- Pantry items with expiration tracking
CREATE TABLE pantry_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ingredient_name VARCHAR NOT NULL,
    category VARCHAR,
    quantity DECIMAL,
    unit VARCHAR,
    expiration_date DATE,
    confidence_score DECIMAL(3,2),
    image_url VARCHAR,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ingredient detection history for ML improvement
CREATE TABLE ingredient_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ingredient_name VARCHAR NOT NULL,
    detection_confidence DECIMAL(3,2),
    bounding_box JSONB,
    confirmed BOOLEAN DEFAULT FALSE,
    image_url VARCHAR,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipe cache for performance
CREATE TABLE recipe_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ingredient_hash VARCHAR UNIQUE NOT NULL,
    recipe_data JSONB NOT NULL,
    filters_applied JSONB,
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- User preferences for personalization
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    dietary_restrictions VARCHAR[],
    preferred_cuisines VARCHAR[],
    max_cook_time INTEGER,
    skill_level VARCHAR DEFAULT 'beginner',
    allergens VARCHAR[],
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security policies
ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies for user data isolation
CREATE POLICY "Users can only see their own pantry items" ON pantry_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only see their own ingredient history" ON ingredient_history FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only see their own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);
```

## 🤖 AI Integration Specifications

### Gemini Vision API Integration

**Object Detection Setup:**
```python
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

# Configure Gemini for object detection
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    generation_config={
        "temperature": 0.1,  # Low temperature for consistent detection
        "top_p": 0.95,
        "max_output_tokens": 8192,
    }
)

# Object detection prompt for ingredients
INGREDIENT_DETECTION_PROMPT = """
Detect all food ingredients in this image with high precision. 
For each ingredient, provide:
1. Ingredient name (use common cooking names)
2. Bounding box coordinates [ymin, xmin, ymax, xmax] normalized to 0-1000
3. Confidence score (0.0 to 1.0)

Return as JSON array with format:
[
  {
    "ingredient": "tomato",
    "box_2d": [100, 200, 300, 400],
    "confidence": 0.95
  }
]

Only include ingredients with confidence > 0.7.
Focus on identifiable whole ingredients, not prepared dishes.
"""
```

### Supercook API Advanced Integration

**Complex Catname Parameter Construction:**
```python
def build_catname_filter(user_preferences, recipe_requirements):
    """
    Build complex catname parameter for advanced recipe filtering
    
    Example catname: "schema_ready_in_under_15mins%2Cone_ingredient_away%2Cschema_10_ingredients_or_more%2Cdiet_vegetarian%2Cctag_asian%2Cschema_video%2Cschema_4plus_star_rating"
    """
    filters = []
    
    # Time-based filters
    if recipe_requirements.get('max_cook_time'):
        if recipe_requirements['max_cook_time'] <= 5:
            filters.append('schema_ready_in_under_5mins')
        elif recipe_requirements['max_cook_time'] <= 15:
            filters.append('schema_ready_in_under_15mins')
        elif recipe_requirements['max_cook_time'] <= 30:
            filters.append('schema_ready_in_under_30mins')
    
    # Ingredient availability filters
    missing_ingredients = recipe_requirements.get('missing_ingredients', 0)
    if missing_ingredients == 0:
        filters.append('zero_ingredients_away')
    elif missing_ingredients <= 1:
        filters.append('one_ingredient_away')
    elif missing_ingredients <= 2:
        filters.append('two_ingredients_away')
    
    # Dietary restrictions
    dietary = user_preferences.get('dietary_restrictions', [])
    for restriction in dietary:
        if restriction == 'vegetarian':
            filters.append('diet_vegetarian')
        elif restriction == 'vegan':
            filters.append('diet_vegan')
        elif restriction == 'gluten_free':
            filters.append('diet_gluten_free')
        elif restriction == 'lactose_free':
            filters.append('diet_lactose_free')
    
    # Cuisine preferences
    cuisines = user_preferences.get('preferred_cuisines', [])
    for cuisine in cuisines[:3]:  # Limit to top 3 preferences
        filters.append(f'ctag_{cuisine.lower()}')
    
    # Quality filters
    filters.append('schema_4plus_star_rating')  # Only high-rated recipes
    
    return '%2C'.join(filters)  # URL encode commas
```

## 🚀 Accelerated Development Plan (6-8 Weeks)

### Week 1-2: Infrastructure & Core Setup
**Focus:** Get the foundation working with AI assistance

**Frontend Tasks:**
- Next.js 14 project setup with TypeScript and Tailwind CSS
- Supabase authentication integration
- Basic photo upload component with camera support
- Initial component structure with AI-generated boilerplate

**Backend Tasks:**
- FastAPI project setup with proper CORS configuration
- Gemini Vision API integration and testing
- Basic ingredient detection endpoint
- Supabase connection and initial schema

**AI Assistant Usage:**
- Generate Next.js project structure
- Create Pydantic models for API responses
- Generate Tailwind CSS components
- Auto-generate database migration scripts

### Week 3-4: AI Integration & Pantry Management
**Focus:** Core functionality with intelligent ingredient detection

**Frontend Tasks:**
- Ingredient confirmation interface with confidence scores
- Real-time pantry management with drag-and-drop
- Expiration date tracking UI
- Mobile-responsive design implementation

**Backend Tasks:**
- Advanced object detection processing
- Ingredient confidence scoring algorithms
- Pantry CRUD operations with expiration logic
- Real-time updates via Supabase subscriptions

**AI Assistant Usage:**
- Generate complex React components for ingredient management
- Create image processing utilities
- Auto-generate API endpoint documentation
- Generate test cases for ingredient detection

### Week 5-6: Recipe Integration & Recommendations
**Focus:** Recipe search with advanced filtering and recommendations

**Frontend Tasks:**
- Recipe browser with advanced filtering UI
- Recipe confidence scoring display
- Cuisine and dietary preference interfaces
- Recipe favoriting and history

**Backend Tasks:**
- Supercook API wrapper with complex catname filtering
- Recipe recommendation engine with confidence scoring
- Caching system for improved performance
- User preference learning algorithms

**AI Assistant Usage:**
- Generate complex filtering UI components
- Create recommendation algorithm implementations
- Auto-generate API documentation
- Generate performance optimization code

### Week 7-8: Polish & Production Deployment
**Focus:** Production readiness and optimization

**Frontend Tasks:**
- Performance optimization and lazy loading
- Error handling and user feedback
- Advanced animations and micro-interactions
- Comprehensive mobile testing

**Backend Tasks:**
- API rate limiting and monitoring
- Error handling and logging
- Performance monitoring and alerts
- Security hardening and testing

**AI Assistant Usage:**
- Generate production deployment scripts
- Create monitoring and logging code
- Auto-generate comprehensive documentation
- Generate security testing scripts

## 🎯 Success Metrics & Portfolio Value

### Technical Achievements
- ✅ **95%+ ingredient detection accuracy** with Gemini object detection
- ✅ **Sub-2 second recipe search responses** with intelligent caching
- ✅ **Real-time pantry updates** across multiple devices
- ✅ **Advanced recipe filtering** with 15+ category combinations
- ✅ **Mobile-first responsive design** with offline capabilities
- ✅ **Production deployment** with monitoring and analytics

### Portfolio Highlights
- **AI/ML Integration:** Advanced computer vision with Google's latest Gemini model
- **Full-Stack Architecture:** Modern tech stack with Next.js, Python, and PostgreSQL
- **API Orchestration:** Complex multi-API integration with intelligent caching
- **Real-Time Features:** Live pantry updates using Supabase real-time subscriptions
- **Performance Optimization:** Sub-second response times with smart caching strategies
- **Mobile Excellence:** Native-like mobile experience with PWA capabilities

### Business Intelligence
- **Smart Recommendations:** ML-powered recipe suggestions based on user behavior
- **Waste Reduction Analytics:** Track food waste prevention and cost savings
- **Personalization Engine:** Learning user preferences for better recommendations
- **Usage Analytics:** Comprehensive tracking of user interactions and success rates

## 🛠️ Development Optimization Tips

### AI Assistant Best Practices
1. **Use Copilot for:** Component boilerplate, API route generation, utility functions
2. **Use Cursor for:** Complex business logic, algorithm implementation, optimization
3. **Use AI for CSS:** Tailwind class suggestions, responsive design patterns
4. **Generate with AI:** Pydantic models, TypeScript interfaces, test cases
5. **Auto-document:** API endpoints, component props, database schemas

### Performance Optimization
- **Frontend:** Next.js 14 App Router with streaming, image optimization, lazy loading
- **Backend:** FastAPI async endpoints, connection pooling, intelligent caching
- **Database:** Proper indexing, RLS policies, real-time subscription optimization
- **APIs:** Request batching, response caching, graceful degradation

### Security Considerations
- **Authentication:** Supabase RLS for data isolation
- **API Security:** Rate limiting, input validation, CORS configuration
- **Image Processing:** File type validation, size limits, malware scanning
- **Environment:** Secure environment variable management

This enhanced architecture provides a robust foundation for a professional-grade Recipe Rescue Pro application that showcases advanced technical skills while remaining achievable within a 6-8 week timeline with AI assistance.