export const calculatePasswordStrength = (password) => {
  if (!password) {
    return { strength: 0, label: '', color: '' }
  }

  let strength = 0
  
  // Length check
  if (password.length >= 8) strength += 1
  if (password.length >= 12) strength += 1
  
  // Character variety checks
  if (/[a-z]/.test(password)) strength += 1 // lowercase
  if (/[A-Z]/.test(password)) strength += 1 // uppercase
  if (/\d/.test(password)) strength += 1 // numbers
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1 // special chars

  // Determine label and color
  let label = ''
  let color = ''
  let percentage = 0

  if (strength <= 2) {
    label = 'Yếu'
    color = 'bg-red-500'
    percentage = 33
  } else if (strength <= 4) {
    label = 'Trung bình'
    color = 'bg-yellow-500'
    percentage = 66
  } else {
    label = 'Mạnh'
    color = 'bg-green-500'
    percentage = 100
  }

  return { strength, label, color, percentage }
}
