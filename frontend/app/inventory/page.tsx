'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Ingredient {
  name: string
  quantity: number
  unit: string
}

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [newIngredient, setNewIngredient] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unit, setUnit] = useState('pieces')

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([
        ...ingredients,
        { 
          name: newIngredient.trim(), 
          quantity: parseFloat(quantity) || 1,
          unit 
        }
      ])
      setNewIngredient('')
      setQuantity('1')
    }
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
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
              <Link href="/inventory" className="text-primary-500 font-semibold">
                My Pantry
              </Link>
              <Link href="/recipes" className="text-gray-600 dark:text-gray-300 hover:text-primary-500">
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
            My Pantry
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add ingredients you have to find recipes
          </p>
        </div>

        {/* Add Ingredient Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Add Ingredient</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
              placeholder="e.g., chicken breast, tomato, milk"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
              className="w-24 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              min="0"
              step="0.1"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="pieces">pieces</option>
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="lb">lb</option>
              <option value="oz">oz</option>
              <option value="L">L</option>
              <option value="ml">ml</option>
              <option value="cup">cup</option>
              <option value="tbsp">tbsp</option>
              <option value="tsp">tsp</option>
            </select>
            <button
              onClick={addIngredient}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Ingredients List */}
        {ingredients.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold dark:text-white">
                Your Ingredients ({ingredients.length})
              </h2>
              <Link
                href={`/recipes?ingredients=${ingredients.map(i => i.name).join(',')}`}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
              >
                Find Recipes →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <div className="font-medium dark:text-white capitalize">
                      {ingredient.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {ingredient.quantity} {ingredient.unit}
                    </div>
                  </div>
                  <button
                    onClick={() => removeIngredient(index)}
                    className="text-red-500 hover:text-red-700 font-bold text-xl"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🥘</div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              Your pantry is empty
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start adding ingredients to find delicious recipes
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
