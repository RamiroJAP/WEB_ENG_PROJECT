import React, { useState, useRef } from 'react'
import '../../styles/admin/AdminDashboard.css'
import { useProducts } from '../../context/ProductsContext'

export default function AdminDashboard(){
  const { products, addProduct } = useProducts()

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [openDropdown, setOpenDropdown] = useState(null)
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    color: '#FF0000',
    size: '',
    image: null
  })
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(
        p => (p.category || '').toLowerCase() === selectedCategory.toLowerCase()
      )

  const handleAddProductClick = () => {
    setShowAddProductModal(true)
  }

  const handleCloseModal = () => {
    setShowAddProductModal(false)
    setNewProduct({ name: '', color: '#FF0000', size: '', image: null })
    setDragActive(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewProduct({ ...newProduct, [name]: value })
  }

  const handleColorChange = (color) => {
    setNewProduct({ ...newProduct, color })
  }

  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setNewProduct({ ...newProduct, image: event.target.result })
      }
      reader.readAsDataURL(files[0])
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setNewProduct({ ...newProduct, image: event.target.result })
      }
      reader.readAsDataURL(files[0])
    }
  }

  const handlePictureBoxClick = () => {
    fileInputRef.current?.click()
  }

  const handleSaveProduct = () => {
    if (newProduct.name && newProduct.size) {
      addProduct({
        name: newProduct.name,
        image: newProduct.image || 'https://via.placeholder.com/300x300?text=New+Product',
        category: 'casual',
        price: 2999,
        rating: 4.0
      })
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
        <button 
          className={`category-btn ${selectedCategory === 'All' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('All')}
        >
          All
        </button>

        {/* Kids Dropdown */}
        <div className="dropdown-menu-admin">
          <button 
            className={`category-btn ${openDropdown === 'kids' ? 'active' : ''}`}
            onClick={() => setOpenDropdown(openDropdown === 'kids' ? null : 'kids')}
          >
            Kids ▼
          </button>
          {openDropdown === 'kids' && (
            <div className="dropdown-content-admin">
              <button onClick={() => { setSelectedCategory('Kids'); setOpenDropdown(null); }}>Shoes</button>
              <button onClick={() => { setSelectedCategory('Kids'); setOpenDropdown(null); }}>Slippers</button>
            </div>
          )}
        </div>

        {/* Men Dropdown */}
        <div className="dropdown-menu-admin">
          <button 
            className={`category-btn ${openDropdown === 'men' ? 'active' : ''}`}
            onClick={() => setOpenDropdown(openDropdown === 'men' ? null : 'men')}
          >
            Men ▼
          </button>
          {openDropdown === 'men' && (
            <div className="dropdown-content-admin">
              <button onClick={() => { setSelectedCategory('Men'); setOpenDropdown(null); }}>Shoes</button>
              <button onClick={() => { setSelectedCategory('Men'); setOpenDropdown(null); }}>Slippers</button>
            </div>
          )}
        </div>

        {/* Women Dropdown */}
        <div className="dropdown-menu-admin">
          <button 
            className={`category-btn ${openDropdown === 'women' ? 'active' : ''}`}
            onClick={() => setOpenDropdown(openDropdown === 'women' ? null : 'women')}
          >
            Women ▼
          </button>
          {openDropdown === 'women' && (
            <div className="dropdown-content-admin">
              <button onClick={() => { setSelectedCategory('Women'); setOpenDropdown(null); }}>Shoes</button>
              <button onClick={() => { setSelectedCategory('Women'); setOpenDropdown(null); }}>Slippers</button>
            </div>
          )}
        </div>

        <button 
          className={`category-btn ${selectedCategory === 'Best Seller' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('Best Seller')}
        >
          Best Seller
        </button>

        <button 
          className={`category-btn ${selectedCategory === 'About' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('About')}
        >
          About
        </button>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {typeof product.image === 'string' && (product.image.startsWith('data:image') || product.image.startsWith('http')) ? (
                <img src={product.image} alt={product.name} className="picture-preview" />
              ) : (
                product.image
              )}
            </div>
            <div className="product-name">{product.name}</div>
          </div>
        ))}
      </div>

      {showAddProductModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="add-picture-section">
              <div 
                className={`add-picture-box ${dragActive ? 'drag-active' : ''}`}
                onClick={handlePictureBoxClick}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {newProduct.image ? (
                  <img src={newProduct.image} alt="Product preview" className="picture-preview" />
                ) : (
                  <>
                    <div className="upload-icon">🔸</div>
                    <div className="upload-text">Drag or Click to Add Picture</div>
                  </>
                )}
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>

            <div className="edit-section">
              <h3>EDIT:</h3>

              <div className="form-group">
                <label>EDIT NAME:</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder=""
                  value={newProduct.name}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>ADD COLOR:</label>
                <div className="color-picker">
                  <button 
                    className={`color-btn ${newProduct.color === '#FF0000' ? 'active' : ''}`}
                    onClick={() => handleColorChange('#FF0000')}
                    style={{ backgroundColor: '#FF0000' }}
                  />
                  <button 
                    className={`color-btn ${newProduct.color === '#9B59B6' ? 'active' : ''}`}
                    onClick={() => handleColorChange('#9B59B6')}
                    style={{ backgroundColor: '#9B59B6' }}
                  />
                  <button 
                    className={`color-btn ${newProduct.color === '#000000' ? 'active' : ''}`}
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
                  placeholder=""
                  value={newProduct.size}
                  onChange={handleInputChange}
                  className="form-input"
                />
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

