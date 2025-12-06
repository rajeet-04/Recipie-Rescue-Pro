"""API routes."""
from fastapi import APIRouter
from .recipes import router as recipes_router
from .ingredients import router as ingredients_router

api_router = APIRouter()
api_router.include_router(recipes_router, prefix="/recipes", tags=["recipes"])
api_router.include_router(ingredients_router, prefix="/ingredients", tags=["ingredients"])

__all__ = ["api_router"]
