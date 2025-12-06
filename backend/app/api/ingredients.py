"""Ingredient API endpoints."""
from fastapi import APIRouter, HTTPException
from typing import List
import json
import os
from pathlib import Path

router = APIRouter()

# Load ingredients from JSON file
INGREDIENTS_FILE = Path(__file__).parent.parent.parent.parent / "ingredients.json"


@router.get("/list")
async def list_ingredients():
    """
    Get the list of all available ingredients.
    
    Returns the comprehensive ingredient database with categories.
    Useful for autocomplete and ingredient suggestions.
    """
    try:
        if not INGREDIENTS_FILE.exists():
            raise HTTPException(status_code=404, detail="Ingredients database not found")
        
        with open(INGREDIENTS_FILE, "r") as f:
            ingredients_data = json.load(f)
        
        return {
            "success": True,
            "data": ingredients_data,
            "total_groups": len(ingredients_data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/search")
async def search_ingredients(query: str, limit: int = 20):
    """
    Search for ingredients by name.
    
    Args:
        query: Search query string
        limit: Maximum number of results to return
        
    Returns:
        List of matching ingredients
    """
    try:
        if not INGREDIENTS_FILE.exists():
            raise HTTPException(status_code=404, detail="Ingredients database not found")
        
        with open(INGREDIENTS_FILE, "r") as f:
            ingredients_data = json.load(f)
        
        query_lower = query.lower()
        results = []
        
        # Search through all ingredient groups
        for group in ingredients_data:
            group_name = group.get("group_name", "")
            for ingredient in group.get("ingredients", []):
                if query_lower in ingredient.lower():
                    results.append({
                        "name": ingredient,
                        "category": group_name
                    })
                    if len(results) >= limit:
                        break
            if len(results) >= limit:
                break
        
        return {
            "success": True,
            "query": query,
            "results": results,
            "count": len(results)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/categories")
async def get_categories():
    """
    Get all ingredient categories.
    
    Returns a list of all ingredient categories/groups.
    """
    try:
        if not INGREDIENTS_FILE.exists():
            raise HTTPException(status_code=404, detail="Ingredients database not found")
        
        with open(INGREDIENTS_FILE, "r") as f:
            ingredients_data = json.load(f)
        
        categories = [
            {
                "name": group.get("group_name", ""),
                "icon": group.get("icon", ""),
                "count": len(group.get("ingredients", []))
            }
            for group in ingredients_data
        ]
        
        return {
            "success": True,
            "categories": categories,
            "total": len(categories)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
