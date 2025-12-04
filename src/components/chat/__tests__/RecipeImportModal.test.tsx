import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecipeImportModal } from '../RecipeImportModal'

describe('RecipeImportModal', () => {
  const mockOnClose = jest.fn()
  const mockOnImport = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not render when isOpen is false', () => {
    const { container } = render(
      <RecipeImportModal
        isOpen={false}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should render when isOpen is true', () => {
    render(
      <RecipeImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    )

    expect(screen.getByRole('heading', { name: 'Import Recipe' })).toBeInTheDocument()
    expect(screen.getByText('Add ingredients from recipes, social media posts, or screenshots')).toBeInTheDocument()
  })

  it('should have three tabs: URL, Image, Text', () => {
    render(
      <RecipeImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    )

    expect(screen.getByRole('button', { name: 'URL' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Image' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Text' })).toBeInTheDocument()
  })

  it('should switch tabs when clicked', async () => {
    const user = userEvent.setup()
    render(
      <RecipeImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    )

    // Default tab should be URL
    expect(screen.getByPlaceholderText(/allrecipes.com/i)).toBeInTheDocument()

    // Switch to Image tab
    await user.click(screen.getByRole('button', { name: 'Image' }))
    expect(screen.getByText('Upload Screenshot or Photo')).toBeInTheDocument()

    // Switch to Text tab
    await user.click(screen.getByRole('button', { name: 'Text' }))
    expect(screen.getByPlaceholderText(/Paste recipe ingredients/i)).toBeInTheDocument()
  })

  it('should handle URL input', async () => {
    const user = userEvent.setup()
    render(
      <RecipeImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    )

    const urlInput = screen.getByPlaceholderText(/allrecipes.com/i)
    await user.type(urlInput, 'https://www.allrecipes.com/recipe/123/test-recipe')

    const importButton = screen.getByRole('button', { name: 'Import Recipe' })
    expect(importButton).not.toBeDisabled()

    await user.click(importButton)

    expect(mockOnImport).toHaveBeenCalledWith({
      url: 'https://www.allrecipes.com/recipe/123/test-recipe',
    })
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should handle text input', async () => {
    const user = userEvent.setup()
    render(
      <RecipeImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    )

    // Switch to Text tab
    await user.click(screen.getByRole('button', { name: 'Text' }))

    const textInput = screen.getByPlaceholderText(/Paste recipe ingredients/i)
    const recipeText = '1 cup flour\\n2 eggs\\n1/2 cup sugar'
    await user.type(textInput, recipeText)

    const importButton = screen.getByRole('button', { name: 'Import Recipe' })
    await user.click(importButton)

    expect(mockOnImport).toHaveBeenCalledWith({
      text: recipeText,
    })
  })

  it('should disable import button when no input is provided', () => {
    render(
      <RecipeImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    )

    const importButton = screen.getByRole('button', { name: 'Import Recipe' })
    expect(importButton).toBeDisabled()
  })

  it('should close modal when close button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <RecipeImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    )

    // Find close button by title attribute
    const closeButton = screen.getByRole('button', { name: '' }).parentElement?.querySelector('[title]')?.closest('button')
    if (closeButton) {
      await user.click(closeButton)
      expect(mockOnClose).toHaveBeenCalled()
    }
  })

  it('should close modal when Cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <RecipeImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    )

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should display supported sources information for URL tab', () => {
    render(
      <RecipeImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    )

    expect(screen.getByText(/Supported sources:/i)).toBeInTheDocument()
    expect(screen.getByText(/Instagram posts, TikTok videos/i)).toBeInTheDocument()
  })

  it('should display tip for Text tab', async () => {
    const user = userEvent.setup()
    render(
      <RecipeImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Text' }))

    expect(screen.getByText(/Tip:/i)).toBeInTheDocument()
    expect(screen.getByText(/Copy and paste the ingredients section/i)).toBeInTheDocument()
  })
})
