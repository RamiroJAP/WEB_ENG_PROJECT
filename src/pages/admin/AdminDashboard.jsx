import React, { useEffect, useRef, useState } from 'react'
import '../../styles/admin/AdminDashboard.css'
import { useProducts } from '../../context/ProductsContext'
import { uploadImageToCloudinary } from '../../lib/cloudinary'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../firebase'

export default function AdminDashboard(){
  const { products, addProduct, removeProduct } = useProducts()

  const colorOptions = [
    { name: 'Red', value: '#FF0000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Purple', value: '#9B59B6' },
    { name: 'Black', value: '#000000' },
    { name: 'Brown', value: '#8B4513' },
    { name: 'Yellow', value: '#FFD700' },
    { name: 'Blue', value: '#007BFF' },
    { name: 'Green', value: '#28A745' },
    { name: 'Pink', value: '#FF69B4' }
  ]

  const [selectedAudience, setSelectedAudience] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Running',
    audience: 'Men',
    stock: '',
    price: '',
    color: '#FF0000',
    size: '',
    imageFile: null,
    imagePreviewUrl: null,
    imageUrl: null
  })
  const [dragActive, setDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    return () => {
      if (newProduct.imagePreviewUrl) {
        URL.revokeObjectURL(newProduct.imagePreviewUrl)
      }
    }
  }, [newProduct.imagePreviewUrl])

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
    if (newProduct.imagePreviewUrl) {
      URL.revokeObjectURL(newProduct.imagePreviewUrl)
    }
    setNewProduct({
      name: '',
      category: 'Running',
      audience: 'Men',
      stock: '',
      price: '',
      color: '#FF0000',
      size: '',
      imageFile: null,
      imagePreviewUrl: null,
      imageUrl: null
    })
    setDragActive(false)
    setIsUploading(false)
    setUploadError(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewProduct({ ...newProduct, [name]: value })
  }

  const handleColorChange = (color) => {
    setNewProduct({ ...newProduct, color })
  }

  const setSelectedImageFile = (file) => {
    if (!file) return

    if (newProduct.imagePreviewUrl) {
      URL.revokeObjectURL(newProduct.imagePreviewUrl)
    }

    const previewUrl = URL.createObjectURL(file)
    setNewProduct({
      ...newProduct,
      imageFile: file,
      imagePreviewUrl: previewUrl,
      imageUrl: null
    })
  }

  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      setSelectedImageFile(files[0])
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
      setSelectedImageFile(files[0])
    }
  }

  const handleUpload = async () => {
    if (!newProduct.imageFile) {
      setUploadError('Please select an image first')
      return
    }

    try {
      setIsUploading(true)
      setUploadError(null)

      if (import.meta.env.DEV) {
        console.log('[AdminDashboard] Starting upload...')
      }

      const imageUrl = await uploadImageToCloudinary(newProduct.imageFile, {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      })

      setNewProduct({
        ...newProduct,
        imageUrl
      })

      try {
        await addDoc(collection(db, 'assignments'), {
          imageUrl,
          createdAt: new Date()
        })
        alert('✓ Image uploaded successfully!')
      } catch (firestoreErr) {
        alert(
          `✓ Image uploaded, but saving to Firestore failed. You can still use the image: ${
            firestoreErr?.message || 'unknown error'
          }`
        )
      }
    } catch (err) {
      const errorMsg = err?.message || 'Upload failed. Please try again.'
      setUploadError(errorMsg)
      
      if (import.meta.env.DEV) {
        console.error('[AdminDashboard] Upload failed:', err)
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handlePictureBoxClick = () => {
    fileInputRef.current?.click()
  }

  const handleSaveProduct = async () => {
    const parsedPrice = Number(newProduct.price)
    const parsedStock = Number(newProduct.stock)
    const isValidStock = Number.isInteger(parsedStock) && parsedStock >= 0

    if (newProduct.imageFile && !newProduct.imageUrl) {
      alert('Please upload the image first')
      return
    }

    if (newProduct.name && newProduct.size && newProduct.category && newProduct.audience && newProduct.stock !== '' && isValidStock && parsedPrice > 0) {
      try {
        await addProduct({
          name: newProduct.name,
          image: newProduct.imageUrl || 'https://via.placeholder.com/300x300?text=New+Product',
          category: newProduct.category,
          audience: newProduct.audience,
          stock: parsedStock,
          color: newProduct.color,
          size: newProduct.size,
          price: parsedPrice,
          rating: 4.0
        })
        handleCloseModal()
      } catch (err) {
        alert(err?.message || 'Failed to save product')
      }
    } else {
      alert('Please fill in all fields and enter valid stock and price values')
    }
  }

  const handleDeleteProduct = async (productId) => {
    try {
      await removeProduct(productId)
    } catch (err) {
      alert(err?.message || 'Failed to delete product')
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
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
                {newProduct.imageUrl || newProduct.imagePreviewUrl ? (
                  <img
                    src={newProduct.imageUrl || newProduct.imagePreviewUrl}
                    alt="Product preview"
                    className="picture-preview"
                  />
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

              <div className="modal-footer" style={{ justifyContent: 'flex-start', marginTop: 12 }}>
                <button
                  className="btn-save"
                  onClick={handleUpload}
                  disabled={!newProduct.imageFile || isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
                {uploadError && (
                  <div style={{
                    marginLeft: '12px',
                    color: '#d32f2f',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    ✗ {uploadError}
                  </div>
                )}
                {newProduct.imageUrl && !isUploading && (
                  <div style={{
                    marginLeft: '12px',
                    color: '#4CAF50',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    ✓ Image uploaded successfully
                  </div>
                )}
              </div>
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
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`color-btn ${newProduct.color === option.value ? 'active' : ''}`}
                      onClick={() => handleColorChange(option.value)}
                      style={{ backgroundColor: option.value }}
                      title={option.name}
                      aria-label={option.name}
                    >
                      <span className="sr-only">{option.name}</span>
                    </button>
                  ))}
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
                <label>ADD STOCKS:</label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  step="1"
                  placeholder="Enter stock quantity"
                  value={newProduct.stock}
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

