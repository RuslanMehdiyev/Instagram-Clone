import * as yup from "yup";

export const loginValidation = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(3).max(30).required(),
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerValidation = yup.object({
  fullName: yup.string().min(4).max(30).required(),
  userName: yup.string().min(3).max(20).required(),
  email: yup.string().matches(emailRegex, "Invalid email").required(),
  password: yup.string().min(3).max(30).required(),
  confirmPassword: yup.string().min(3).max(20).required(),
});
