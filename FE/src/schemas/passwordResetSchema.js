import * as yup from "yup";

export const forgotPasswordSchema = yup.object({
  email: yup.string().required("Email là bắt buộc").email("Email không hợp lệ"),
});

export const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .required("Mật khẩu mới là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  confirmPassword: yup
    .string()
    .required("Xác nhận mật khẩu là bắt buộc")
    .oneOf([yup.ref("newPassword")], "Mật khẩu xác nhận không khớp"),
});
