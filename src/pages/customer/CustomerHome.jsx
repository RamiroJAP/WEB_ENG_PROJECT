import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/user/CustomerHome.css'

export default function CustomerHome() {
  const navigate = useNavigate()
  
  React.useEffect(() => {
    navigate('/')
  }, [navigate])

  return null
}
