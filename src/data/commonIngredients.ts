interface IngredientCategory {
  name: string
  ingredients: string[]
}

export const ingredientCategories: IngredientCategory[] = [
  {
    name: 'Proteins',
    ingredients: [
      'Chicken', 'Beef', 'Pork', 'Salmon', 'Tuna', 'Eggs', 'Tofu',
      'Ground Beef', 'Turkey Mince', 'Bacon'
    ]
  },
  {
    name: 'Vegetables',
    ingredients: [
      'Onion', 'Garlic', 'Tomatoes', 'Potatoes', 'Carrots', 'Pepper',
      'Broccoli', 'Spinach', 'Mushrooms', 'Celery', 'Lettuce', 'Cucumber',
      'Zucchini', 'Sweet Potatoes', 'Green Beans'
    ]
  },
  {
    name: 'Pantry Staples',
    ingredients: [
      'Salt', 'Black Pepper', 'Olive Oil', 'Vegetable Oil', 'Flour',
      'Sugar', 'Rice', 'Pasta', 'Bread', 'Soy Sauce', 'Vinegar',
      'Tomato Sauce', 'Chicken Stock', 'Onion', 'Water'
    ]
  },
  {
    name: 'Dairy',
    ingredients: [
      'Milk', 'Butter', 'Cheese', 'Heavy Cream', 'Yogurt',
      'Sour Cream', 'Parmesan Cheese', 'Cheddar Cheese'
    ]
  },
  {
    name: 'Herbs & Spices',
    ingredients: [
      'Basil', 'Oregano', 'Thyme', 'Rosemary', 'Cumin',
      'Paprika', 'Cinnamon', 'Chili Powder', 'Bay Leaves'
    ]
  }
]

// For backward compatibility
export const commonIngredients = ingredientCategories.flatMap(cat => cat.ingredients)

// Default pantry staples
export const defaultPantryStaples = [
  'Salt', 'Black Pepper', 'Olive Oil', 'Vegetable Oil', 'Flour',
  'Sugar', 'Onion'
] 