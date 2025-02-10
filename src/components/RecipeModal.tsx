'use client'

import { Recipe } from '@/services/mealDbService'
import { useEffect } from 'react'
import Image from 'next/image'

interface RecipeModalProps {
  recipe: Recipe
  onClose: () => void
}

export function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  const handlePrint = () => {
    window.print()
  }

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      @media print {
        body > *:not(.recipe-print) { display: none; }
        .recipe-print {
          position: static !important;
          background: white !important;
          color: black !important;
          padding: 20px !important;
        }
        .recipe-print button { display: none !important; }
        .recipe-print img { max-height: 300px !important; }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose} // Close when clicking the backdrop
    >
      <div 
        className="recipe-print bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking the modal itself
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-white">{recipe.strMeal}</h2>
            <div className="flex gap-2">
              <a 
                href={`https://www.themealdb.com/meal/${recipe.idMeal}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
                onClick={e => e.stopPropagation()}
              >
                🌐
              </a>
              <button 
                onClick={handlePrint}
                className="text-gray-400 hover:text-white"
              >
                🖨️
              </button>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
          
          <Image 
            src={recipe.strMealThumb} 
            alt={recipe.strMeal}
            width={800}
            height={600}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-white">Instructions</h3>
            <div className="space-y-2 text-gray-300">
              {recipe.strInstructions.split('\n').map((step, index) => (
                <p key={index}>{step}</p>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">All Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients.map((ingredient, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-700 text-gray-100 rounded-full text-sm"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 