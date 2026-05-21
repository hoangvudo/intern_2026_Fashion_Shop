import * as yup from 'yup'

export const registerSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('Họ tên là bắt buộc')
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(50, 'Họ tên không được quá 50 ký tự')
    .matches(
      /^[a-zA-ZÀ-ỹ\s]+$/,
      'Họ tên chỉ được chứa chữ cái và khoảng trắng'
    ),
  
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không hợp lệ')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email không đúng định dạng'
    ),
  
  phone: yup
    .string()
    .required('Số điện thoại là bắt buộc')
    .matches(
      /^(0|\+84)[0-9]{9,10}$/,
      'Số điện thoại không hợp lệ (VD: 0123456789)'
    ),
  
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  
  confirmPassword: yup
    .string()
    .required('Xác nhận mật khẩu là bắt buộc')
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
  
  agreeToTerms: yup
    .boolean()
    .oneOf([true], 'Bạn phải đồng ý với điều khoản và điều kiện')
})
