'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Recipe {
  title: string
  url: string
  img: string
  ingredients: string[]
  match: number
}

function RecipesContent() {
  const searchParams = useSearchParams()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchIngredients, setSearchIngredients] = useState('')

  useEffect(() => {
    const ingredients = searchParams.get('ingredients')
    if (ingredients) {
      setSearchIngredients(ingredients)
      searchRecipes(ingredients)
    }
  }, [searchParams])

  const searchRecipes = async (ingredients: string) => {
    if (!ingredients.trim()) return

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: ingredients.split(',').map(i => i.trim()) }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch recipes')
      }

      const data = await response.json()
      setRecipes(data.recipes || [])
    } catch (err) {
      setError('Failed to load recipes. Please try again.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchRecipes(searchIngredients)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary-500">
              🥗 Recipe Rescue Pro
            </Link>
            <div className="flex gap-4">
              <Link href="/inventory" className="text-gray-600 dark:text-gray-300 hover:text-primary-500">
                My Pantry
              </Link>
              <Link href="/recipes" className="text-primary-500 font-semibold">
                Find Recipes
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Find Recipes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search from 11M+ recipes using ingredients you have
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={searchIngredients}
              onChange={(e) => setSearchIngredients(e.target.value)}
              placeholder="Enter ingredients separated by commas (e.g., chicken, rice, tomato)"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Searching...' : 'Search Recipes'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Searching recipes...</p>
          </div>
        )}

        {/* Results */}
        {!loading && recipes.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">
              Found {recipes.length} recipes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {recipe.img && (
                    <img
                      src={recipe.img}
                      alt={recipe.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 dark:text-white line-clamp-2">
                      {recipe.title}
                    </h3>
                    {recipe.match && (
                      <div className="mb-2">
                        <span className="inline-block px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm rounded">
                          {recipe.match}% match
                        </span>
                      </div>
                    )}
                    <a
                      href={recipe.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-primary-500 hover:text-primary-600 font-medium"
                    >
                      View Recipe →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && recipes.length === 0 && searchIngredients && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              No recipes found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try different ingredients or add more ingredients
            </p>
          </div>
        )}

        {/* Initial State */}
        {!loading && !error && recipes.length === 0 && !searchIngredients && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              Start searching for recipes
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Enter ingredients above or add them from your pantry
            </p>
            <Link
              href="/inventory"
              className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
            >
              Go to My Pantry
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

export default function RecipesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <RecipesContent />
    </Suspense>
  )
}
