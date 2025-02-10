/* eslint-disable @typescript-eslint/no-explicit-any */
import { commonIngredients } from '@/data/commonIngredients'

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

export interface Recipe {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strInstructions: string
  strCategory: string
  ingredients: string[] // We'll transform the API data to this format
}

// Add cache interfaces
interface CacheItem<T> {
  data: T
  timestamp: number
}

interface Cache {
  [key: string]: CacheItem<any>
}

// Cache configuration
const CACHE_DURATION = 1000 * 60 * 5 // 5 minutes
const CONCURRENT_LIMIT = 2
const REQUEST_DELAY = 1000 // 1 second between requests

// Initialize cache
const cache: Cache = {}

// Add semaphore for limiting concurrent requests
class Semaphore {
  private permits: number
  private queue: (() => void)[] = []

  constructor(permits: number) {
    this.permits = permits
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--
      return Promise.resolve()
    }
    return new Promise(resolve => this.queue.push(resolve))
  }

  release(): void {
    this.permits++
    const next = this.queue.shift()
    if (next) {
      this.permits--
      next()
    }
  }
}

const semaphore = new Semaphore(CONCURRENT_LIMIT)

// Add cache helper functions
function getCached<T>(key: string): T | null {
  const item = cache[key]
  if (!item) return null
  
  if (Date.now() - item.timestamp > CACHE_DURATION) {
    delete cache[key]
    return null
  }
  
  return item.data
}

function setCache<T>(key: string, data: T): void {
  cache[key] = {
    data,
    timestamp: Date.now()
  }
}

interface MealResponse {
  meals: {
    idMeal: string
    strMeal: string
    strMealThumb: string
    strInstructions: string
    strCategory: string
    [key: string]: string | null // for dynamic ingredient properties
  }[] | null
}

interface CategoryResponse {
  categories: {
    strCategory: string
  }[]
}

// Update fetch function with rate limiting
async function fetchWithRetry(url: string, retries = 3): Promise<MealResponse | CategoryResponse> {
  const cacheKey = url
  const cachedData = getCached<any>(cacheKey)
  if (cachedData) return cachedData

  await semaphore.acquire()
  try {
    for (let i = 0; i < retries; i++) {
      try {
        await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY))
        const response = await fetch(url)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        setCache(cacheKey, data)
        return data
      } catch (error) {
        if (i === retries - 1) throw error
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
    throw new Error('All retries failed')
  } finally {
    semaphore.release()
  }
}

// Update search function to be more efficient
export async function searchRecipesByIngredient(ingredient: string): Promise<Recipe[]> {
  try {
    const data = await fetchWithRetry(`${API_BASE_URL}/filter.php?i=${ingredient}`) as MealResponse
    
    if (!data.meals) return []
    
    // Get only first 5 recipes
    const recipesToFetch = data.meals.slice(0, 5)
    
    // Fetch details sequentially instead of all at once
    const recipes: Recipe[] = []
    for (const meal of recipesToFetch) {
      try {
        const recipe = await getRecipeDetails(meal.idMeal)
        if (recipe) recipes.push(recipe)
      } catch (error) {
        console.error(`Failed to fetch details for recipe ${meal.idMeal}:`, error)
      }
    }

    return recipes
  } catch (error) {
    console.error('Failed to search recipes:', error)
    return []
  }
}

async function getRecipeDetails(id: string): Promise<Recipe> {
  const response = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`)
  const data = await response.json()
  const meal = data.meals[0]

  // Extract ingredients from API response
  const ingredients: string[] = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    if (ingredient && ingredient.trim()) {
      ingredients.push(ingredient.trim())
    }
  }

  return {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
    strInstructions: meal.strInstructions,
    strCategory: meal.strCategory,
    ingredients
  }
}

// Add this function to fetch TheMealDB's ingredient list
export async function fetchApiIngredients(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/list.php?i=list`)
  const data = await response.json()
  return data.meals.map((meal: any) => meal.strIngredient)
}

// Add this helper function to check our ingredients against the API
export async function validateIngredients(): Promise<{
  missing: string[]
  different: { ours: string; theirs: string[] }[]
}> {
  const apiIngredients = await fetchApiIngredients()
  const ourIngredients = commonIngredients

  const missing: string[] = []
  const different: { ours: string; theirs: string[] }[] = []

  ourIngredients.forEach(ing => {
    const matches = apiIngredients.filter(apiIng => 
      apiIng.toLowerCase().includes(ing.toLowerCase()) ||
      ing.toLowerCase().includes(apiIng.toLowerCase())
    )

    if (matches.length === 0) {
      missing.push(ing)
    } else if (!apiIngredients.includes(ing)) {
      different.push({ ours: ing, theirs: matches })
    }
  })

  return { missing, different }
}

// Add this function to fetch categories
export async function fetchCategories(): Promise<string[]> {
  const data = await fetchWithRetry(`${API_BASE_URL}/categories.php`) as CategoryResponse
  return data.categories.map((cat: any) => cat.strCategory)
} 