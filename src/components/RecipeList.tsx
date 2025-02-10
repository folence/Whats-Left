'use client'

import { useEffect, useState, useCallback } from 'react'
import { Recipe, searchRecipesByIngredient } from '@/services/mealDbService'
import { RecipeModal } from './RecipeModal'
import { ingredientMatches } from '@/utils/ingredientMatching'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import Image from 'next/image'

interface RecipeListProps {
  ingredients: string[]
}

type SortOption = 'completion' | 'alphabetical'
type FilterOption = 'all' | 'Beef' | 'Chicken' | 'Dessert' | 'Lamb' | 'Pasta' | 'Seafood' | 'Vegetarian'

function RecipeSkeleton() {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700 animate-pulse">
      <div className="h-48 bg-gray-700"/> {/* Image placeholder */}
      <div className="p-4">
        <div className="h-6 bg-gray-700 rounded mb-4"/> {/* Title placeholder */}
        <div className="mb-4">
          <div className="h-4 w-32 bg-gray-700 rounded mb-2"/> {/* Section title */}
          <div className="flex flex-wrap gap-1">
            {[1,2,3].map(i => (
              <div key={i} className="h-6 w-16 bg-gray-700 rounded-full"/>
            ))}
          </div>
        </div>
        <div>
          <div className="h-4 w-32 bg-gray-700 rounded mb-2"/>
          <div className="flex flex-wrap gap-1">
            {[1,2].map(i => (
              <div key={i} className="h-6 w-16 bg-gray-700 rounded-full"/>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function RecipeList({ ingredients }: RecipeListProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('completion')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [favorites, setFavorites] = useLocalStorage<string[]>('favoriteRecipes', [])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getMatchingIngredients = (recipeIngredients: string[]) => {
    return recipeIngredients.filter(ing => 
      ingredients.some(userIng => ingredientMatches(userIng, ing))
    )
  }

  const getMissingIngredients = (recipeIngredients: string[]) => {
    return recipeIngredients.filter(ing => 
      !ingredients.some(userIng => ingredientMatches(userIng, ing))
    )
  }

  const calculateCompletion = (matching: string[], total: number) => {
    return Math.round((matching.length / total) * 100)
  }

  // Wrap fetchRecipes with useCallback to prevent infinite loops
  const fetchRecipes = useCallback(async () => {
    if (ingredients.length === 0) {
      setRecipes([])
      return
    }

    setLoading(true)
    setError(null)
    try {
      const allResults = await Promise.all(
        ingredients.map(ing => searchRecipesByIngredient(ing))
      )
      
      const uniqueRecipes = Array.from(
        new Map(
          allResults.flat().map(recipe => [recipe.idMeal, recipe])
        ).values()
      )
      
      setRecipes(uniqueRecipes)
    } catch (error) {
      console.error('Failed to fetch recipes:', error)
      setError('Failed to fetch recipes. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [ingredients])

  useEffect(() => {
    fetchRecipes()
  }, [ingredients, fetchRecipes])

  const sortRecipes = (recipes: Recipe[]) => {
    return [...recipes].sort((a, b) => {
      if (sortBy === 'completion') {
        const aMatching = getMatchingIngredients(a.ingredients)
        const bMatching = getMatchingIngredients(b.ingredients)
        const aCompletion = calculateCompletion(aMatching, a.ingredients.length)
        const bCompletion = calculateCompletion(bMatching, b.ingredients.length)
        return bCompletion - aCompletion
      } else {
        return a.strMeal.localeCompare(b.strMeal)
      }
    })
  }

  const filterRecipes = (recipes: Recipe[]) => {
    let filtered = recipes

    if (showFavoritesOnly) {
      filtered = filtered.filter(recipe => favorites.includes(recipe.idMeal))
    }

    if (filterBy === 'all') return filtered
    
    return filtered.filter(recipe => recipe.strCategory === filterBy)
  }

  const filteredAndSortedRecipes = sortRecipes(filterRecipes(recipes))

  const toggleFavorite = (e: React.MouseEvent, recipeId: string) => {
    e.stopPropagation() // Prevent opening recipe modal
    setFavorites(prev => 
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    )
  }

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1,2,3,4,5,6].map(i => (
          <RecipeSkeleton key={i}/>
        ))}
      </div>
    )
  }

  if (recipes.length === 0) {
    return <div className="text-center py-4">No recipes found</div>
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 mb-4">{error}</p>
        <button 
          onClick={() => {
            setError(null)
            fetchRecipes()
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            className="rounded border-gray-600"
          />
          <span>Show Favorites Only</span>
        </label>

        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as FilterOption)}
            className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2"
          >
            <option value="all">All Recipes</option>
            <option value="Beef">Beef</option>
            <option value="Chicken">Chicken</option>
            <option value="Dessert">Dessert</option>
            <option value="Lamb">Lamb</option>
            <option value="Pasta">Pasta</option>
            <option value="Seafood">Seafood</option>
            <option value="Vegetarian">Vegetarian</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2"
          >
            <option value="completion">Sort by Completion</option>
            <option value="alphabetical">Sort Alphabetically</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedRecipes.map((recipe) => {
          const matchingIngredients = getMatchingIngredients(recipe.ingredients)
          const missingIngredients = getMissingIngredients(recipe.ingredients)
          const completionPercentage = calculateCompletion(matchingIngredients, recipe.ingredients.length)

          return (
            <div 
              key={recipe.idMeal} 
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700 cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="relative">
                <Image 
                  src={recipe.strMealThumb} 
                  alt={recipe.strMeal}
                  width={480}
                  height={360}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={(e) => toggleFavorite(e, recipe.idMeal)}
                  className={`absolute top-2 left-2 p-2 rounded-full bg-gray-900/50 backdrop-blur-sm
                    ${favorites.includes(recipe.idMeal) 
                      ? 'text-yellow-400 hover:text-yellow-300' 
                      : 'text-gray-300 hover:text-white'
                    } text-xl`}
                >
                  {favorites.includes(recipe.idMeal) ? '★' : '☆'}
                </button>
                <div className="absolute top-2 right-2 bg-gray-900 text-white px-2 py-1 rounded-full text-sm">
                  {completionPercentage}% complete
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-white">{recipe.strMeal}</h3>
                
                {/* Ingredients you have */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-1 text-green-400 flex items-center gap-1">
                    <span>✓</span> Available Ingredients ({matchingIngredients.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {matchingIngredients.map((ing, index) => (
                      <span 
                        key={`${ing}-${index}`}
                        className="px-2 py-1 bg-green-900 text-green-100 rounded-full text-sm"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing ingredients */}
                <div className="mb-2">
                  <h4 className="font-semibold mb-1 text-red-400 flex items-center gap-1">
                    <span>✗</span> Missing Ingredients ({missingIngredients.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {missingIngredients.map((ing, index) => (
                      <span 
                        key={`${ing}-${index}`}
                        className="px-2 py-1 bg-red-900 text-red-100 rounded-full text-sm"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {selectedRecipe && (
        <RecipeModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </>
  )
} 