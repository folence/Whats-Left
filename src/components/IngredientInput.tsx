'use client'

import { useState, useEffect } from 'react'
import { ingredientCategories, defaultPantryStaples } from '@/data/commonIngredients'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface Ingredient {
  id: string
  name: string
}

interface Props {
  onIngredientsChange: (ingredients: Ingredient[]) => void
}

export function IngredientInput({ onIngredientsChange }: Props) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [pantryStaples, setPantryStaples] = useLocalStorage<Set<string>>(
    'pantryStaples',
    new Set(defaultPantryStaples)
  )
  const [showPantryModal, setShowPantryModal] = useState(false)

  useEffect(() => {
    if (inputValue.trim().length > 0) {
      const filtered = ingredientCategories.flatMap(cat => cat.ingredients).filter(ing => 
        ing.toLowerCase().includes(inputValue.toLowerCase()) &&
        !ingredients.some(existing => existing.name.toLowerCase() === ing.toLowerCase())
      ).slice(0, 5)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
    setSelectedIndex(-1) // Reset selection when input changes
  }, [inputValue, ingredients])

  useEffect(() => {
    const allIngredients = [
      ...ingredients.filter(ing => !pantryStaples.has(ing.name)),
      ...Array.from(pantryStaples).map(name => ({
        id: `pantry-${name}`,
        name,
      }))
    ]
    onIngredientsChange(allIngredients)
  }, [ingredients, pantryStaples, onIngredientsChange])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > -1 ? prev - 1 : prev)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleAddIngredient(suggestions[selectedIndex])
        } else {
          handleAddIngredient()
        }
        break
      case 'Escape':
        setSuggestions([])
        setSelectedIndex(-1)
        break
    }
  }

  const handleAddIngredient = (ingredientName: string = inputValue) => {
    if (!ingredientName.trim()) return
    
    // Prevent duplicates
    if (ingredients.some(ing => ing.name.toLowerCase() === ingredientName.toLowerCase())) {
      return
    }

    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: ingredientName.trim()
    }

    const newIngredients = [...ingredients, newIngredient]
    setIngredients(newIngredients)
    setInputValue('')
    setSuggestions([])
    onIngredientsChange(newIngredients)
  }

  const handleRemoveIngredient = (id: string) => {
    const newIngredients = ingredients.filter(ing => ing.id !== id)
    setIngredients(newIngredients)
    onIngredientsChange(newIngredients)
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Add Ingredients</h2>
        <button
          onClick={() => setShowPantryModal(true)}
          className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-200 transition-colors flex items-center gap-2"
        >
          <span>Pantry Staples</span>
          <span className="bg-gray-600 px-2 py-0.5 rounded-full text-xs">
            {pantryStaples.size}
          </span>
        </button>
      </div>

      <div className="relative">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter an ingredient"
            className="flex-1 p-2 border rounded bg-gray-800 text-white placeholder-gray-400 border-gray-700"
          />
          <button 
            onClick={() => handleAddIngredient()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
        
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg mt-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                className={`px-4 py-2 cursor-pointer text-gray-100 ${
                  index === selectedIndex ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
                onClick={() => handleAddIngredient(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ul className="space-y-2 mt-4">
        {ingredients.map((ingredient) => (
          <li 
            key={ingredient.id}
            className="flex justify-between items-center p-2 bg-gray-800 rounded text-gray-100"
          >
            {ingredient.name}
            <button
              onClick={() => handleRemoveIngredient(ingredient.id)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {/* Pantry Modal */}
      {showPantryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Pantry Staples</h3>
                <button 
                  onClick={() => setShowPantryModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              {ingredientCategories
                .find(cat => cat.name === 'Pantry Staples')
                ?.ingredients.map(ingredient => (
                  <label
                    key={ingredient}
                    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={pantryStaples.has(ingredient)}
                      onChange={(e) => {
                        const newPantryStaples = new Set(pantryStaples)
                        if (e.target.checked) {
                          newPantryStaples.add(ingredient)
                        } else {
                          newPantryStaples.delete(ingredient)
                        }
                        setPantryStaples(newPantryStaples)
                      }}
                      className="rounded border-gray-600"
                    />
                    {ingredient}
                  </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 