import React, { useState, useRef } from 'react'
import '../../styles/admin/AdminDashboard.css'

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

  const [selectedAudience, setSelectedAudience] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [openDropdown, setOpenDropdown] = useState(null)
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    audience: 'Men',
    type: 'Shoes',
    color: '#FF0000',
    size: '',
    image: null
  })
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const getProductAudience = (product) => product.audience || product.category || 'Men'

  const getProductType = (product) => {
    if (product.type) return product.type

    const productName = (product.name || '').toLowerCase()
    if (productName.includes('slipper') || productName.includes('slide')) return 'Slippers'
    if (productName.includes('sandal')) return 'Sandals'
    return 'Shoes'
  }

  const filteredProducts = products.filter(product => {
    const audienceMatch = selectedAudience === 'All' || getProductAudience(product) === selectedAudience
    const typeMatch = selectedType === 'All' || getProductType(product) === selectedType
    return audienceMatch && typeMatch
  })

  const handleAddProductClick = () => {
    setShowAddProductModal(true)
  }

  const handleCloseModal = () => {
    setShowAddProductModal(false)
    setNewProduct({ name: '', audience: 'Men', type: 'Shoes', color: '#FF0000', size: '', image: null })
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
      const product = {
        id: products.length + 1,
        name: newProduct.name,
        audience: newProduct.audience,
        type: newProduct.type,
        color: newProduct.color,
        size: newProduct.size,
        category: newProduct.audience,
        image: newProduct.image || '👟'
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
        <button 
          className={`category-btn ${selectedAudience === 'All' ? 'active' : ''}`}
          onClick={() => {
            setSelectedAudience('All')
            setSelectedType('All')
          }}
        >
          All
        </button>

        {/* Kids Dropdown */}
        <div className="dropdown-menu-admin">
          <button 
            className={`category-btn ${selectedAudience === 'Kids' ? 'active' : ''}`}
            onClick={() => setOpenDropdown(openDropdown === 'kids' ? null : 'kids')}
          >
            Kids ▼
          </button>
          {openDropdown === 'kids' && (
            <div className="dropdown-content-admin">
              <button onClick={() => { setSelectedAudience('Kids'); setSelectedType('Shoes'); setOpenDropdown(null); }}>Shoes</button>
              <button onClick={() => { setSelectedAudience('Kids'); setSelectedType('Slippers'); setOpenDropdown(null); }}>Slippers</button>
              <button onClick={() => { setSelectedAudience('Kids'); setSelectedType('Sandals'); setOpenDropdown(null); }}>Sandals</button>
            </div>
          )}
        </div>

        {/* Men Dropdown */}
        <div className="dropdown-menu-admin">
          <button 
            className={`category-btn ${selectedAudience === 'Men' ? 'active' : ''}`}
            onClick={() => setOpenDropdown(openDropdown === 'men' ? null : 'men')}
          >
            Men ▼
          </button>
          {openDropdown === 'men' && (
            <div className="dropdown-content-admin">
              <button onClick={() => { setSelectedAudience('Men'); setSelectedType('Shoes'); setOpenDropdown(null); }}>Shoes</button>
              <button onClick={() => { setSelectedAudience('Men'); setSelectedType('Slippers'); setOpenDropdown(null); }}>Slippers</button>
              <button onClick={() => { setSelectedAudience('Men'); setSelectedType('Sandals'); setOpenDropdown(null); }}>Sandals</button>
            </div>
          )}
        </div>

        {/* Women Dropdown */}
        <div className="dropdown-menu-admin">
          <button 
            className={`category-btn ${selectedAudience === 'Women' ? 'active' : ''}`}
            onClick={() => setOpenDropdown(openDropdown === 'women' ? null : 'women')}
          >
            Women ▼
          </button>
          {openDropdown === 'women' && (
            <div className="dropdown-content-admin">
              <button onClick={() => { setSelectedAudience('Women'); setSelectedType('Shoes'); setOpenDropdown(null); }}>Shoes</button>
              <button onClick={() => { setSelectedAudience('Women'); setSelectedType('Slippers'); setOpenDropdown(null); }}>Slippers</button>
              <button onClick={() => { setSelectedAudience('Women'); setSelectedType('Sandals'); setOpenDropdown(null); }}>Sandals</button>
            </div>
          )}
        </div>

        <button 
          className={`category-btn ${selectedAudience === 'Best Seller' ? 'active' : ''}`}
          onClick={() => {
            setSelectedAudience('Best Seller')
            setSelectedType('All')
          }}
        >
          Best Seller
        </button>

        <button 
          className={`category-btn ${selectedAudience === 'About' ? 'active' : ''}`}
          onClick={() => {
            setSelectedAudience('About')
            setSelectedType('All')
          }}
        >
          About
        </button>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.image}
            </div>
            <div className="product-name">{product.name}</div>
            <div className="product-meta">{getProductAudience(product)} • {getProductType(product)}</div>
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
                <label>ADD CATEGORY:</label>
                <select
                  name="type"
                  value={newProduct.type}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="Shoes">Shoes</option>
                  <option value="Slippers">Slippers</option>
                  <option value="Sandals">Sandals</option>
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

