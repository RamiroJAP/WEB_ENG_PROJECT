import React, { useState } from 'react'
import './AdminDashboard.css'

export default function AdminDashboard(){
  const [products, setProducts] = useState([
    { id: 1, name: 'Golden Runner', category: 'Men', image: '👟' },
    { id: 2, name: 'Black Max', category: 'Men', image: '👟' },
    { id: 3, name: 'Jordan Low', category: 'Men', image: '👟' },
    { id: 4, name: 'Purple Sneaker', category: 'Best Seller', image: '👟' },
    { id: 5, name: 'White Slides', category: 'Kids', image: '👟' },
    { id: 6, name: 'Beige Slides', category: 'Women', image: '👟' },
    { id: 7, name: 'Black Slides', category: 'Kids', image: '👟' },
    { id: 8, name: 'Cream Slides', category: 'Women', image: '👟' }
  ])

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    color: '#FF0000',
    size: ''
  })

  const categories = ['All', 'Kids', 'Men', 'Women', 'Best Seller', 'About']

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  const handleAddProductClick = () => {
    setShowAddProductModal(true)
  }

  const handleCloseModal = () => {
    setShowAddProductModal(false)
    setNewProduct({ name: '', color: '#FF0000', size: '' })
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
          <button 
            key={cat}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
            {cat !== 'All' && cat !== 'Best Seller' && cat !== 'About' && ' ▼'}
          </button>
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

