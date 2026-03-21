import React, { useState, useRef } from 'react'
import '../../styles/admin/AdminDashboard.css'
import { useProducts } from '../../context/ProductsContext'

export default function AdminDashboard(){
  const { products, addProduct, removeProduct } = useProducts()

  const [selectedAudience, setSelectedAudience] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Running',
    audience: 'Men',
    price: '',
    color: '#FF0000',
    size: '',
    image: null
  })
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const getAudienceCategory = (audience) => {
    const normalized = (audience || '').toLowerCase()
    if (normalized === 'kids' || normalized === 'men' || normalized === 'women') {
      return normalized
    }
    return 'men'
  }

  const getProductType = (category) => {
    const normalized = (category || '').toLowerCase()
    if (normalized === 'slippers') return 'slippers'
    if (normalized === 'sandals') return 'sandals'
    return 'shoes'
  }

  const filteredProducts = products.filter((product) => {
    const audienceMatch =
      selectedAudience === 'all' || getAudienceCategory(product.audience) === selectedAudience
    const typeMatch = selectedType === 'all' || getProductType(product.category) === selectedType
    return audienceMatch && typeMatch
  })

  const handleAddProductClick = () => {
    setShowAddProductModal(true)
  }

  const handleCloseModal = () => {
    setShowAddProductModal(false)
    setNewProduct({ name: '', category: 'Running', audience: 'Men', price: '', color: '#FF0000', size: '', image: null })
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
    const parsedPrice = Number(newProduct.price)

    if (newProduct.name && newProduct.size && newProduct.category && newProduct.audience && parsedPrice > 0) {
      addProduct({
        name: newProduct.name,
        image: newProduct.image || 'https://via.placeholder.com/300x300?text=New+Product',
        category: newProduct.category,
        audience: newProduct.audience,
        price: parsedPrice,
        rating: 4.0
      })
      handleCloseModal()
    } else {
      alert('Please fill in all fields and enter a valid price')
    }
  }

  const handleDeleteProduct = (productId) => {
    removeProduct(productId)
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <input type="text" placeholder="Name of Store" className="store-name-input" />
        <button className="add-product-btn" onClick={handleAddProductClick}>
          <span>➕</span> Add New Product
        </button>
      </div>

      <div className="admin-filters-top">
        <div className="admin-filter-group-inline">
          <h4 className="admin-filter-label">Category:</h4>
          <div className="admin-filter-buttons">
            <button
              className={`admin-filter-btn-small ${selectedAudience === 'all' ? 'active' : ''}`}
              onClick={() => {
                setSelectedAudience('all')
                setSelectedType('all')
              }}
            >
              All Products
            </button>
            <button
              className={`admin-filter-btn-small ${selectedAudience === 'kids' ? 'active' : ''}`}
              onClick={() => setSelectedAudience('kids')}
            >
              Kids
            </button>
            <button
              className={`admin-filter-btn-small ${selectedAudience === 'men' ? 'active' : ''}`}
              onClick={() => setSelectedAudience('men')}
            >
              Men
            </button>
            <button
              className={`admin-filter-btn-small ${selectedAudience === 'women' ? 'active' : ''}`}
              onClick={() => setSelectedAudience('women')}
            >
              Women
            </button>
          </div>
        </div>

        <div className="admin-filter-group-inline">
          <h4 className="admin-filter-label">Type:</h4>
          <div className="admin-filter-buttons">
            <select
              className="admin-filter-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="shoes">Shoes</option>
              <option value="slippers">Slippers</option>
              <option value="sandals">Sandals</option>
            </select>
          </div>
        </div>
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
            <div className="product-category">{product.category || 'Uncategorized'}</div>
            <button
              className="delete-product-btn"
              onClick={() => handleDeleteProduct(product.id)}
            >
              Delete
            </button>
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
                <label>ADD CATEGORY:</label>
                <select
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="Running">Running</option>
                  <option value="Casual">Casual</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Slippers">Slippers</option>
                  <option value="Sandals">Sandals</option>
                </select>
              </div>

              <div className="form-group">
                <label>ADD TYPE:</label>
                <select
                  name="audience"
                  value={newProduct.audience}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="Kids">Kids</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                </select>
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
                    className={`color-btn ${newProduct.color === '#FFFFFF' ? 'active' : ''}`}
                    onClick={() => handleColorChange('#FFFFFF')}
                    style={{ backgroundColor: '#FFFFFF' }}
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

              <div className="form-group">
                <label>ADD PRICE:</label>
                <input
                  type="number"
                  name="price"
                  min="1"
                  step="1"
                  placeholder="Enter price"
                  value={newProduct.price}
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

