import { useState, useEffect } from 'react'

function useDeviceType() {
  const [deviceType, setDeviceType] = useState('unknown')

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(window.innerWidth <= 768 ? 'mobile' : 'desktop')
    }

    handleResize() // Set initial value
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return deviceType
}

export default useDeviceType
