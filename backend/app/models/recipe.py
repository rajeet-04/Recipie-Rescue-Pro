"""Recipe data models."""
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List


class RecipeSearch(BaseModel):
    """Model for recipe search request."""
    ingredients: List[str] = Field(..., min_length=1)
    exclude: Optional[List[str]] = None
    cuisine: Optional[str] = None
    dietary: Optional[List[str]] = None
    max_time: Optional[int] = None


class Recipe(BaseModel):
    """Recipe model."""
    title: str
    url: str
    img: Optional[str] = None
    ingredients: List[str] = []
    match: Optional[int] = None  # Percentage match
    prep_time: Optional[int] = None
    cook_time: Optional[int] = None
    servings: Optional[int] = None
    cuisine: Optional[str] = None


class RecipeResponse(BaseModel):
    """Response model for recipe search."""
    recipes: List[Recipe]
    total: int
    prompt: Optional[List[dict]] = None  # Suggested ingredients
