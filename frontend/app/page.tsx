import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl w-full space-y-8 text-center">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white">
            🥗 Recipe Rescue Pro
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Never waste food again. Smart inventory tracking + recipe suggestions using what you have.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-6 py-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">AI Photo Recognition</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Scan your fridge and pantry to instantly add ingredients
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🍳</div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">11M+ Recipes</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Find recipes using ingredients you already have
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Expiration Tracking</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get alerts before food expires and reduce waste
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/inventory"
            className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
          >
            Get Started Free
          </Link>
          <Link
            href="/recipes"
            className="px-8 py-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
          >
            Browse Recipes
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 pt-12 border-t border-gray-200 dark:border-gray-700">
          <div>
            <div className="text-3xl font-bold text-primary-500">11M+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Recipes</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-500">18K+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Recipe Sources</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-500">Zero</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Food Waste Goal</div>
          </div>
        </div>
      </div>
    </main>
  )
}
