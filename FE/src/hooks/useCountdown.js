import { useState, useEffect, useCallback } from 'react'

export const useCountdown = (initialSeconds = 60) => {
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval = null

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1)
      }, 1000)
    } else if (seconds === 0) {
      setIsActive(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, seconds])

  const start = useCallback((customSeconds = initialSeconds) => {
    setSeconds(customSeconds)
    setIsActive(true)
  }, [initialSeconds])

  const reset = useCallback(() => {
    setSeconds(0)
    setIsActive(false)
  }, [])

  return {
    seconds,
    isActive,
    start,
    reset
  }
}
