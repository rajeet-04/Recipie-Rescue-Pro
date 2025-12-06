import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ingredients } = body

    if (!ingredients || !Array.isArray(ingredients)) {
      return NextResponse.json(
        { error: 'Invalid ingredients' },
        { status: 400 }
      )
    }

    // Call Supercook API
    const formData = new URLSearchParams()
    formData.append('needsimage', '1')
    formData.append('app', '1')
    formData.append('kitchen', ingredients.join(','))
    formData.append('focus', '')
    formData.append('exclude', '')
    formData.append('kw', '')
    formData.append('catname', '')
    formData.append('start', '0')
    formData.append('fave', 'false')
    formData.append('lang', 'en')
    formData.append('cv', '2')

    const response = await fetch('https://d1.supercook.com/dyn/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    if (!response.ok) {
      throw new Error(`Supercook API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform the response to a simpler format
    const recipes = data.results?.map((recipe: any) => ({
      title: recipe.title || '',
      url: recipe.url || '',
      img: recipe.img || '',
      ingredients: recipe.ingredients || [],
      match: recipe.score || 0,
    })) || []

    return NextResponse.json({ 
      recipes,
      total: data.possibilities || 0,
      prompt: data.prompt || []
    })
  } catch (error) {
    console.error('Recipe API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}
