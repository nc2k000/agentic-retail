'use client'

interface Chip {
  label: string
  prompt: string
}

interface SuggestionChipsProps {
  chips: Chip[]
  onSelect: (prompt: string) => void
}

export function SuggestionChips({ chips, onSelect }: SuggestionChipsProps) {
  if (!chips || chips.length === 0) return null

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {chips.map((chip, i) => (
        <button
          key={i}
          onClick={() => onSelect(chip.prompt)}
          className="px-4 py-2 bg-white border border-stone-200 rounded-full text-sm font-medium text-stone-700 hover:border-amber-300 hover:bg-amber-50 transition-colors"
        >
          {chip.label}
        </button>
      ))}
    </div>
  )
}
