"""Ingredient data models."""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date


class IngredientBase(BaseModel):
    """Base ingredient model."""
    name: str = Field(..., min_length=1, max_length=200)
    quantity: float = Field(default=1.0, gt=0)
    unit: str = Field(default="pieces")
    category: Optional[str] = None


class IngredientCreate(IngredientBase):
    """Model for creating a new ingredient."""
    expiration_date: Optional[date] = None
    storage_location: Optional[str] = None
    notes: Optional[str] = None


class Ingredient(IngredientBase):
    """Complete ingredient model with metadata."""
    id: str
    expiration_date: Optional[date] = None
    storage_location: Optional[str] = None
    added_at: str
    days_until_expiry: Optional[int] = None
    urgency_level: Optional[str] = None  # good, soon, urgent, critical, expired
    
    class Config:
        from_attributes = True


class IngredientList(BaseModel):
    """List of ingredients."""
    ingredients: list[Ingredient]
    total: int
