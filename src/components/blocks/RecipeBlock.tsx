'use client'

import { RecipeBlock as RecipeBlockType } from '@/types'

interface RecipeBlockProps {
  data: RecipeBlockType['data']
}

export function RecipeBlock({ data }: RecipeBlockProps) {
  return (
    <div className="mt-4 border border-stone-200 rounded-xl overflow-hidden bg-white max-w-full">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-stone-200">
        <h3 className="font-semibold text-stone-800">{data.title}</h3>
        <div className="flex gap-4 mt-1 text-sm text-stone-600">
          {data.servings && <span>🍽️ {data.servings} servings</span>}
          {data.prepTime && <span>⏱️ {data.prepTime} prep</span>}
          {data.cookTime && <span>🔥 {data.cookTime} cook</span>}
        </div>
      </div>

      {/* Ingredients */}
      <div className="p-4 border-b border-stone-200">
        <h4 className="font-medium text-stone-800 mb-2">Ingredients</h4>
        <ul className="space-y-1">
          {data.ingredients.map((ing, i) => (
            <li key={i} className="text-sm text-stone-700 flex items-start gap-2">
              <span className="text-stone-400 flex-shrink-0">•</span>
              <span className="break-words">
                {ing.amount && ing.unit ? `${ing.amount} ${ing.unit} ` : ''}
                {ing.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions */}
      {data.instructions && data.instructions.length > 0 && (
        <div className="p-4">
          <h4 className="font-medium text-stone-800 mb-2">Instructions</h4>
          <ol className="space-y-2">
            {data.instructions.map((step, i) => (
              <li key={i} className="text-sm text-stone-700 flex gap-3">
                <span className="font-medium text-orange-600 min-w-[1.5rem] flex-shrink-0">{i + 1}.</span>
                <span className="break-words">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Source URL */}
      {data.sourceUrl && (
        <div className="px-4 py-3 bg-stone-50 border-t border-stone-200">
          <a
            href={data.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-orange-600 hover:text-orange-700 underline"
          >
            View original recipe →
          </a>
        </div>
      )}
    </div>
  )
}
