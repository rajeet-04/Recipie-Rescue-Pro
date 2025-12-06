"""Service for interacting with Supercook API."""
import httpx
from typing import List, Optional, Dict, Any
from ..models.recipe import Recipe, RecipeResponse


class SupercookService:
    """Service for Supercook recipe API."""
    
    BASE_URL = "https://d1.supercook.com/dyn/results"
    
    @staticmethod
    async def search_recipes(
        ingredients: List[str],
        exclude: Optional[List[str]] = None,
        cuisine: Optional[str] = None,
        dietary: Optional[List[str]] = None,
        max_time: Optional[int] = None,
    ) -> RecipeResponse:
        """
        Search for recipes using Supercook API.
        
        Args:
            ingredients: List of ingredient names
            exclude: List of ingredients to exclude
            cuisine: Cuisine filter (e.g., 'italian', 'mexican')
            dietary: Dietary restrictions (e.g., 'vegetarian', 'vegan')
            max_time: Maximum cooking time in minutes
            
        Returns:
            RecipeResponse with list of recipes
        """
        # Build the form data for Supercook API
        form_data = {
            "needsimage": "1",
            "app": "1",
            "kitchen": ",".join(ingredients),
            "focus": "",
            "exclude": ",".join(exclude) if exclude else "",
            "kw": "",
            "catname": SupercookService._build_catname(cuisine, dietary, max_time),
            "start": "0",
            "fave": "false",
            "lang": "en",
            "cv": "2",
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    SupercookService.BASE_URL,
                    data=form_data,
                    headers={
                        "Content-Type": "application/x-www-form-urlencoded",
                    }
                )
                response.raise_for_status()
                data = response.json()
                
                # Transform the response
                recipes = [
                    Recipe(
                        title=recipe.get("title", ""),
                        url=recipe.get("url", ""),
                        img=recipe.get("img", ""),
                        ingredients=recipe.get("ingredients", []),
                        match=recipe.get("score", 0),
                    )
                    for recipe in data.get("results", [])
                ]
                
                return RecipeResponse(
                    recipes=recipes,
                    total=data.get("possibilities", 0),
                    prompt=data.get("prompt", [])
                )
                
        except httpx.HTTPError as e:
            raise Exception(f"Failed to fetch recipes from Supercook: {str(e)}")
    
    @staticmethod
    def _build_catname(
        cuisine: Optional[str] = None,
        dietary: Optional[List[str]] = None,
        max_time: Optional[int] = None,
    ) -> str:
        """
        Build the catname parameter for advanced filtering.
        
        The catname parameter is used for filtering by:
        - Cuisine type (ctag_italian, ctag_mexican, etc.)
        - Dietary restrictions (diet_vegetarian, diet_vegan, etc.)
        - Cooking time (schema_ready_in_under_15mins, etc.)
        - Ingredient availability (zero_ingredients_away, etc.)
        """
        filters = []
        
        # Add cuisine filter
        if cuisine:
            filters.append(f"ctag_{cuisine.lower()}")
        
        # Add dietary filters
        if dietary:
            for diet in dietary:
                if diet.lower() == "vegetarian":
                    filters.append("diet_vegetarian")
                elif diet.lower() == "vegan":
                    filters.append("diet_vegan")
                elif diet.lower() == "gluten_free":
                    filters.append("diet_gluten_free")
                elif diet.lower() == "dairy_free":
                    filters.append("diet_lactose_free")
        
        # Add time filter
        if max_time:
            if max_time <= 5:
                filters.append("schema_ready_in_under_5mins")
            elif max_time <= 15:
                filters.append("schema_ready_in_under_15mins")
            elif max_time <= 30:
                filters.append("schema_ready_in_under_30mins")
        
        # Add quality filter
        filters.append("schema_4plus_star_rating")
        
        # Join with comma (URL encoded as %2C)
        return "%2C".join(filters) if filters else ""
