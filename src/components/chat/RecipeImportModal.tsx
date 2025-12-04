'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface RecipeImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (data: { url?: string; image?: File; text?: string }) => void
}

export function RecipeImportModal({ isOpen, onClose, onImport }: RecipeImportModalProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'image' | 'text'>('url')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  if (!isOpen) return null

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (activeTab === 'url' && url) {
      onImport({ url })
    } else if (activeTab === 'image' && image) {
      onImport({ image })
    } else if (activeTab === 'text' && text) {
      onImport({ text })
    }
    handleClose()
  }

  const handleClose = () => {
    setUrl('')
    setText('')
    setImage(null)
    setImagePreview(null)
    onClose()
  }

  const canSubmit =
    (activeTab === 'url' && url.trim()) ||
    (activeTab === 'image' && image) ||
    (activeTab === 'text' && text.trim())

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <div>
            <h2 className="text-xl font-semibold text-stone-800">Import Recipe</h2>
            <p className="text-sm text-stone-500 mt-1">
              Add ingredients from recipes, social media posts, or screenshots
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'url'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            URL
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'image'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            Image
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'text'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            Text
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Recipe URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.allrecipes.com/recipe/..."
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Supported sources:</strong> Recipe websites (AllRecipes, Food Network, etc.),
                  Instagram posts, TikTok videos, and more!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'image' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Upload Screenshot or Photo
                </label>
                <div className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center hover:border-amber-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="recipe-image-upload"
                  />
                  <label htmlFor="recipe-image-upload" className="cursor-pointer">
                    {imagePreview ? (
                      <div className="space-y-2">
                        <img
                          src={imagePreview}
                          alt="Recipe preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <p className="text-sm text-stone-600">
                          Click to change image
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-4xl">📸</div>
                        <p className="text-stone-600 font-medium">
                          Click to upload image
                        </p>
                        <p className="text-sm text-stone-500">
                          Recipe card, social media post, or screenshot
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Paste Recipe Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste recipe ingredients list or full recipe text..."
                  rows={10}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono text-sm"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Copy and paste the ingredients section from any recipe source
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-stone-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import Recipe
          </button>
        </div>
      </div>
    </div>
  )
}
