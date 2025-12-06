"""Recipe API endpoints."""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..models.recipe import RecipeSearch, RecipeResponse
from ..services.supercook_service import SupercookService

router = APIRouter()


@router.post("/search", response_model=RecipeResponse)
async def search_recipes(search: RecipeSearch):
    """
    Search for recipes based on ingredients.
    
    This endpoint searches the Supercook database (11M+ recipes) for recipes
    that can be made with the provided ingredients.
    
    Args:
        search: RecipeSearch model containing ingredients and filters
        
    Returns:
        RecipeResponse with list of matching recipes
    """
    try:
        result = await SupercookService.search_recipes(
            ingredients=search.ingredients,
            exclude=search.exclude,
            cuisine=search.cuisine,
            dietary=search.dietary,
            max_time=search.max_time,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/search", response_model=RecipeResponse)
async def search_recipes_get(
    ingredients: str = Query(..., description="Comma-separated list of ingredients"),
    exclude: Optional[str] = Query(None, description="Comma-separated list of ingredients to exclude"),
    cuisine: Optional[str] = Query(None, description="Cuisine type (e.g., italian, mexican)"),
    dietary: Optional[str] = Query(None, description="Comma-separated dietary restrictions"),
    max_time: Optional[int] = Query(None, description="Maximum cooking time in minutes"),
):
    """
    Search for recipes (GET version for simple queries).
    
    This is a convenience endpoint for simple recipe searches using GET requests.
    For more complex searches, use the POST endpoint.
    """
    try:
        # Parse comma-separated values
        ingredient_list = [i.strip() for i in ingredients.split(",") if i.strip()]
        exclude_list = [i.strip() for i in exclude.split(",") if exclude and i.strip()] if exclude else None
        dietary_list = [d.strip() for d in dietary.split(",") if dietary and d.strip()] if dietary else None
        
        result = await SupercookService.search_recipes(
            ingredients=ingredient_list,
            exclude=exclude_list,
            cuisine=cuisine,
            dietary=dietary_list,
            max_time=max_time,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
