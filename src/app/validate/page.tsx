'use client'

import { useState, useEffect } from 'react'
import { validateIngredients } from '@/services/mealDbService'

export default function ValidatePage() {
  const [results, setResults] = useState<{
    missing: string[]
    different: { ours: string; theirs: string[] }[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    validateIngredients()
      .then(setResults)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Ingredient Validation Results</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Missing Ingredients</h2>
          <ul className="list-disc pl-5">
            {results?.missing.map(ing => (
              <li key={ing} className="text-red-400">{ing}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Different Names</h2>
          <ul className="space-y-2">
            {results?.different.map(({ ours, theirs }) => (
              <li key={ours} className="text-yellow-400">
                Our &quot;{ours}&quot; matches their: {theirs.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
} 