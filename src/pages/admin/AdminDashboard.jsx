import React, { useState } from 'react'
import '../../styles/admin/AdminDashboard.css'

export default function AdminDashboard(){
  const [products, setProducts] = useState([
    { id: 1, name: 'Golden Runner', category: 'Men', subcategory: 'SHOES', image: '👟' },
    { id: 2, name: 'Black Max', category: 'Men', subcategory: 'SHOES', image: '👟' },
    { id: 3, name: 'Jordan Low', category: 'Men', subcategory: 'SHOES', image: '👟' },
    { id: 4, name: 'Purple Sneaker', category: 'Best Seller', subcategory: 'SHOES', image: '👟' },
    { id: 5, name: 'White Slides', category: 'Kids', subcategory: 'SLIPPERS', image: '👟' },
    { id: 6, name: 'Beige Slides', category: 'Women', subcategory: 'SLIPPERS', image: '👟' },
    { id: 7, name: 'Black Slides', category: 'Kids', subcategory: 'SLIPPERS', image: '👟' },
    { id: 8, name: 'Cream Slides', category: 'Women', subcategory: 'SLIPPERS', image: '👟' }
  ])

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    color: '#FF0000',
    size: '',
    subcategory: 'SHOES'
  })

  const categories = ['All', 'Kids', 'Men', 'Women', 'Best Seller', 'About']
  const dropdownCategories = ['Kids', 'Men', 'Women']

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : selectedSubcategory 
      ? products.filter(p => p.category === selectedCategory && p.subcategory === selectedSubcategory)
      : products.filter(p => p.category === selectedCategory)

  const handleAddProductClick = () => {
    setShowAddProductModal(true)
  }

  const handleCategoryClick = (cat) => {
    if (dropdownCategories.includes(cat)) {
      setOpenDropdown(openDropdown === cat ? null : cat)
      setSelectedCategory(cat)
      setSelectedSubcategory(null)
    } else {
      setSelectedCategory(cat)
      setSelectedSubcategory(null)
      setOpenDropdown(null)
    }
  }

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory)
    setOpenDropdown(null)
  }

  const handleCloseModal = () => {
    setShowAddProductModal(false)
    setNewProduct({ name: '', color: '#FF0000', size: '', subcategory: 'SHOES' })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewProduct({ ...newProduct, [name]: value })
  }

  const handleColorChange = (color) => {
    setNewProduct({ ...newProduct, color })
  }

  const handleSaveProduct = () => {
    if (newProduct.name && newProduct.size) {
      const product = {
        id: products.length + 1,
        name: newProduct.name,
        color: newProduct.color,
        size: newProduct.size,
        category: 'Men',
        subcategory: newProduct.subcategory,
        image: '👟'
      }
      setProducts([...products, product])
      handleCloseModal()
    } else {
      alert('Please fill in all fields')
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <input type="text" placeholder="Name of Store" className="store-name-input" />
        <button className="add-product-btn" onClick={handleAddProductClick}>
          <span>➕</span> Add New Product
        </button>
      </div>

      <div className="categories">
        {categories.map(cat => (
          <div key={cat} className="category-wrapper">
            <button 
              className={`category-btn ${selectedCategory === cat && !openDropdown ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
              {dropdownCategories.includes(cat) && (
                <span className={`dropdown-arrow ${openDropdown === cat ? 'open' : ''}`}>▼</span>
              )}
            </button>
            {dropdownCategories.includes(cat) && openDropdown === cat && (
              <div className="dropdown-menu">
                <button 
                  className={`dropdown-item ${selectedSubcategory === 'SHOES' ? 'active' : ''}`}
                  onClick={() => handleSubcategoryClick('SHOES')}
                >
                  SHOES
                </button>
                <button 
                  className={`dropdown-item ${selectedSubcategory === 'SLIPPERS' ? 'active' : ''}`}
                  onClick={() => handleSubcategoryClick('SLIPPERS')}
                >
                  SLIPPERS
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.image}
            </div>
            <div className="product-name">{product.name}</div>
          </div>
        ))}
      </div>

      {showAddProductModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Product</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>

            <div className="modal-body">
              <div className="picture-section">
                <div className="add-picture-box">ADD PICTURE</div>
              </div>

              <div className="edit-section">
                <h3>EDIT:</h3>

                <div className="form-group">
                  <label>EDIT NAME:</label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Enter product name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>ADD COLOR:</label>
                  <div className="color-picker">
                    <button 
                      className={`color-btn red ${newProduct.color === '#FF0000' ? 'active' : ''}`}
                      onClick={() => handleColorChange('#FF0000')}
                      style={{ backgroundColor: '#FF0000' }}
                    />
                    <button 
                      className={`color-btn blue ${newProduct.color === '#0000FF' ? 'active' : ''}`}
                      onClick={() => handleColorChange('#0000FF')}
                      style={{ backgroundColor: '#0000FF' }}
                    />
                    <button 
                      className={`color-btn black ${newProduct.color === '#000000' ? 'active' : ''}`}
                      onClick={() => handleColorChange('#000000')}
                      style={{ backgroundColor: '#000000' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>ADD SIZE:</label>
                  <input 
                    type="text" 
                    name="size"
                    placeholder="Enter size (e.g., S, M, L, XL)"
                    value={newProduct.size}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>PRODUCT TYPE:</label>
                  <div className="subcategory-selector">
                    <button 
                      className={`subcategory-btn ${newProduct.subcategory === 'SHOES' ? 'active' : ''}`}
                      onClick={() => setNewProduct({ ...newProduct, subcategory: 'SHOES' })}
                    >
                      SHOES
                    </button>
                    <button 
                      className={`subcategory-btn ${newProduct.subcategory === 'SLIPPERS' ? 'active' : ''}`}
                      onClick={() => setNewProduct({ ...newProduct, subcategory: 'SLIPPERS' })}
                    >
                      SLIPPERS
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
              <button className="btn-save" onClick={handleSaveProduct}>Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

