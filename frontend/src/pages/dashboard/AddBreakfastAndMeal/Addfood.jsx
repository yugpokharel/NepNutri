"use client"

import { useState, useEffect, useCallback } from "react"
import foods from "./foods.json"
import { Search, ArrowUp, Plus, X, ChevronDown, Star, AArrowUpIcon as SortAscending } from "lucide-react"
import "./addfood.css"

const AddFoodToBreakfast = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("Default")
  const [searchResults, setSearchResults] = useState([])
  const [selectedFoods, setSelectedFoods] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)

  useEffect(() => {
    console.log("Foods data from JSON:", foods.food_items)
    setSearchResults(foods.food_items || [])
    const savedFoods = JSON.parse(localStorage.getItem("breakfastFoods")) || []
    setSelectedFoods(savedFoods)

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleScroll = () => {
    setIsVisible(window.scrollY > 200)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleSearch = useCallback(
    (term) => {
      setIsLoading(true)
      try {
        console.log("Searching with term:", term)
        const results = foods.food_items.filter((food) => food.name.toLowerCase().includes(term.toLowerCase()))
        console.log("Search results:", results)
        setSearchResults(sortResults(results, sortOption))
      } catch (err) {
        console.error("Search error:", err)
        setError("Error searching foods")
      } finally {
        setIsLoading(false)
      }
    },
    [sortOption],
  )

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    handleSearch(searchTerm)
  }

  const handleSearchChange = (e) => {
    const term = e.target.value
    setSearchTerm(term)
    if (term.length === 0) {
      console.log("Clearing search, setting all foods")
      setSearchResults(foods.food_items || [])
    }
  }

  const sortResults = (results, option) => {
    const sorted = [...results]
    console.log("Sorting results with option:", option)
    switch (option) {
      case "Calories":
        return sorted.sort((a, b) => (a.macros?.calories || 0) - (b.macros?.calories || 0))
      case "Name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case "Category":
        return sorted.sort((a, b) => a.category.localeCompare(b.category))
      default:
        return sorted
    }
  }

  const handleSortChange = (e) => {
    const newSortOption = e.target.value
    console.log("Changing sort to:", newSortOption)
    setSortOption(newSortOption)
    setSearchResults((prevResults) => sortResults(prevResults, newSortOption))
  }

  const handleAddFood = (food) => {
    if (!selectedFoods.some((selected) => selected.name === food.name)) {
      const updatedFoods = [...selectedFoods, { ...food, addedAt: Date.now() }]
      console.log("Adding food, new selectedFoods:", updatedFoods)
      setSelectedFoods(updatedFoods)
      localStorage.setItem("breakfastFoods", JSON.stringify(updatedFoods))
    }
  }

  const handleRemoveFood = (foodName) => {
    const updatedFoods = selectedFoods.filter((food) => food.name !== foodName)
    console.log("Removing food, new selectedFoods:", updatedFoods)
    setSelectedFoods(updatedFoods)
    localStorage.setItem("breakfastFoods", JSON.stringify(updatedFoods))
  }

  const calculateTotals = () => {
    return selectedFoods.reduce(
      (totals, food) => ({
        calories: totals.calories + (food.macros?.calories || 0),
        protein: totals.protein + (food.macros?.protein || 0),
        fat: totals.fat + (food.macros?.fat || 0),
        carbs: totals.carbs + (food.macros?.carbs || 0),
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 },
    )
  }

  const handleSubmit = () => {
    const totals = calculateTotals()
    console.log("Submitting totals to localStorage 'todayFood':", totals)
    localStorage.setItem(
      "todayFood",
      JSON.stringify({
        calories: totals.calories,
        macros: {
          protein: totals.protein,
          fat: totals.fat,
          carbs: totals.carbs,
        },
      }),
    )
    window.location.href = "/dash"
  }

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites)
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>Add Food To Breakfast</h1>
          <div className="header-actions">
            <button className="back-button" onClick={() => (window.location.href = "/dash")}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="main-layout">
        {/* Main Content (Left Side) */}
        <div className="food-search-section">
          <div className="search-container">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-input-container">
                <Search className="search-icon" size={18} />
                <input
                  type="text"
                  id="foodSearch"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search foods by name..."
                  className="search-input"
                  aria-describedby="search-hint"
                />
              </div>
              <button type="submit" disabled={isLoading} className="search-button">
                {isLoading ? "Searching..." : "Search"}
              </button>
            </form>
            <small id="search-hint" className="search-hint">
              Type to search our food database
            </small>
          </div>

          <div className="filter-options">
            <button onClick={toggleFavorites} className="favorites-button">
              <Star size={16} className="favorites-icon" />
              <span>Favorites for Breakfast</span>
              <ChevronDown size={16} className={`chevron-icon ${showFavorites ? "rotate" : ""}`} />
            </button>

            <div className="sort-container">
              <SortAscending size={16} className="sort-icon" />
              <select id="sort" value={sortOption} onChange={handleSortChange} className="sort-select">
                <option value="Default">Sort: Default</option>
                <option value="Calories">Sort: Calories</option>
                <option value="Name">Sort: Name</option>
                <option value="Category">Sort: Category</option>
              </select>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {showFavorites && (
            <div className="favorites-panel">
              <h3>Your Breakfast Favorites</h3>
              <p className="favorites-empty">
                You don't have any favorites yet. Add foods to favorites to see them here.
              </p>
            </div>
          )}

          <div className="search-results">
            <h2 className="results-title">
              {searchTerm ? `Results for "${searchTerm}"` : "All Foods"}
              <span className="results-count">{searchResults.length} items</span>
            </h2>

            {searchResults.length > 0 ? (
              <div className="food-grid">
                {searchResults.map((food) => (
                  <div key={food.name} className="food-card">
                    <div className="food-card-header">
                      <h3 className="food-name">{food.name}</h3>
                      <span className="food-category">{food.category}</span>
                    </div>

                    <div className="food-macros">
                      <div className="macro-item calories">
                        <span className="macro-value">{food.macros?.calories || 0}</span>
                        <span className="macro-label">calories</span>
                      </div>
                      <div className="macro-item protein">
                        <span className="macro-value">{food.macros?.protein || 0}g</span>
                        <span className="macro-label">protein</span>
                      </div>
                      <div className="macro-item fat">
                        <span className="macro-value">{food.macros?.fat || 0}g</span>
                        <span className="macro-label">fat</span>
                      </div>
                      <div className="macro-item carbs">
                        <span className="macro-value">{food.macros?.carbs || 0}g</span>
                        <span className="macro-label">carbs</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddFood(food)}
                      className={`add-food-button ${selectedFoods.some((f) => f.name === food.name) ? "added" : ""}`}
                      disabled={selectedFoods.some((f) => f.name === food.name)}
                    >
                      {selectedFoods.some((f) => f.name === food.name) ? (
                        <>
                          Added <span className="checkmark">✓</span>
                        </>
                      ) : (
                        <>
                          Add <Plus size={16} />
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : searchTerm.length > 0 && !isLoading ? (
              <div className="empty-results">
                <div className="empty-icon">🔍</div>
                <p>No foods found matching "{searchTerm}"</p>
                <p className="empty-suggestion">Try a different search term or browse all foods</p>
              </div>
            ) : isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Searching for foods...</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Breakfast Summary (Right Side) */}
        <div className={`breakfast-summary ${selectedFoods.length > 0 ? "has-items" : ""}`}>
          <div className="summary-header">
            <h2>Your Breakfast</h2>
            <span className="item-count">{selectedFoods.length} items</span>
          </div>

          {selectedFoods.length > 0 ? (
            <>
              <div className="selected-foods">
                {selectedFoods.map((food) => (
                  <div key={food.addedAt} className="selected-food-item">
                    <div className="selected-food-info">
                      <h3 className="selected-food-name">{food.name}</h3>
                      <div className="selected-food-macros">
                        <span className="selected-calories">{food.macros?.calories || 0} kcal</span>
                        <span className="macro-pill">P: {food.macros?.protein || 0}g</span>
                        <span className="macro-pill">F: {food.macros?.fat || 0}g</span>
                        <span className="macro-pill">C: {food.macros?.carbs || 0}g</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFood(food.name)}
                      className="remove-food-button"
                      aria-label={`Remove ${food.name}`}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="nutrition-summary">
                <div className="nutrition-total">
                  <div className="total-calories">
                    <span className="total-value">{calculateTotals().calories}</span>
                    <span className="total-label">calories</span>
                  </div>
                  <div className="total-macros">
                    <div className="total-macro protein">
                      <span className="total-macro-value">{calculateTotals().protein}g</span>
                      <span className="total-macro-label">protein</span>
                    </div>
                    <div className="total-macro fat">
                      <span className="total-macro-value">{calculateTotals().fat}g</span>
                      <span className="total-macro-label">fat</span>
                    </div>
                    <div className="total-macro carbs">
                      <span className="total-macro-value">{calculateTotals().carbs}g</span>
                      <span className="total-macro-label">carbs</span>
                    </div>
                  </div>
                </div>

                <button onClick={handleSubmit} className="submit-button">
                  Save Breakfast & Return to Dashboard
                </button>
              </div>
            </>
          ) : (
            <div className="empty-breakfast">
              <div className="empty-icon">🍳</div>
              <p>Your breakfast is empty</p>
              <p className="empty-suggestion">Search and add foods from the list on the left</p>
            </div>
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {isVisible && (
        <button onClick={scrollToTop} className="scroll-top-button" aria-label="Scroll to top">
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  )
}

export default AddFoodToBreakfast

