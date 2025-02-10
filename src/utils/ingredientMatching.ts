interface IngredientRule {
  ingredients: string[]
  matches: string[]
}

export const ingredientRules: IngredientRule[] = [
  {
    ingredients: ['vegetable oil', 'olive oil'],
    matches: ['oil']
  },
  {
    ingredients: ['chicken stock', 'chicken broth'],
    matches: ['chicken stock', 'stock']
  },
  {
    ingredients: ['onion'],
    matches: ['onion', 'onions', 'white onion', 'red onion']
  },
  {
    ingredients: ['garlic'],
    matches: ['garlic', 'garlic clove', 'garlic cloves']
  },
  {
    ingredients: ['tomatoes'],
    matches: ['tomato', 'tomatoes', 'chopped tomatoes']
  },
  {
    ingredients: ['pepper'],
    matches: ['pepper', 'bell pepper', 'peppers', 'red pepper', 'green pepper']
  }
]

export function ingredientMatches(userIngredient: string, recipeIngredient: string): boolean {
  // Convert to lowercase for comparison
  const userIng = userIngredient.toLowerCase()
  const recipeIng = recipeIngredient.toLowerCase()

  // Check special rules
  const matchingRule = ingredientRules.find(rule => 
    rule.ingredients.includes(userIng)
  )

  if (matchingRule && matchingRule.matches.includes(recipeIng)) {
    return true
  }

  // Default matching
  return recipeIng.includes(userIng) || userIng.includes(recipeIng)
} 