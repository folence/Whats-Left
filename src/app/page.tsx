'use client'

import { IngredientInput } from '@/components/IngredientInput'
import { RecipeList } from '@/components/RecipeList'
import { useState } from 'react'

// Add the Ingredient interface
interface Ingredient {
  id: string
  name: string
}

export default function Home() {
  // Change the state type to Ingredient[]
  const [ingredients, setIngredients] = useState<Ingredient[]>([])

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        What can I cook?
      </h1>
      <IngredientInput onIngredientsChange={setIngredients} />
      <div className="mt-8">
        <RecipeList ingredients={ingredients.map(ing => ing.name)} />
      </div>
    </main>
  )
} 