import { api } from "@/lib/api";

export interface RegisterInput {
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
  gender?: string;
  date_of_birth?: string;
  referral_code?: string;
}

export interface LoginInput {
  email?: string;
  phone?: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar: string | null;
  date_of_birth: string | null;
  gender: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  role: string;
  language: string;
  bonus_points: number;
  referral_code: string;
  created_at: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: UserResponse;
}

export interface Address {
  id: string;
  title: string;
  region: string;
  district: string;
  street: string;
  house_number: string;
  apartment: string;
  postal_code: string;
  is_default: boolean;
  latitude: number | null;
  longitude: number | null;
}

export async function register(data: RegisterInput) {
  const { data: response } = await api.post("/register/", data);
  return response;
}

export async function login(data: LoginInput) {
  const { data: response } = await api.post<LoginResponse>("/login/", data);
  return response;
}

export async function logout(refreshToken: string) {
  const { data } = await api.post("/logout/", { refresh: refreshToken });
  return data;
}

export async function refreshToken(refreshToken: string) {
  const { data } = await api.post<{ access: string }>("/token/refresh/", {
    refresh: refreshToken,
  });
  return data;
}

export async function verifyEmail(email: string, code: string) {
  const { data } = await api.post("/verify-email/", {
    email,
    code,
    purpose: "verify_email",
  });
  return data;
}

export async function sendOTP(data: { email?: string; phone?: string; purpose: string }) {
  const { data: response } = await api.post("/send-otp/", data);
  return response;
}

export async function verifyOTP(data: { email?: string; phone?: string; code: string; purpose: string }) {
  const { data: response } = await api.post("/verify-otp/", data);
  return response;
}

export async function forgotPassword(email: string) {
  const { data } = await api.post("/forgot-password/", { email });
  return data;
}

export async function resetPassword(data: { email: string; code: string; new_password: string; new_password_confirm: string }) {
  const { data: response } = await api.post("/reset-password/", data);
  return response;
}

export async function changePassword(data: { old_password: string; new_password: string; new_password_confirm: string }) {
  const { data: response } = await api.post("/change-password/", data);
  return response;
}

export async function getMe() {
  const { data } = await api.get<UserResponse>("/me/");
  return data;
}

export async function updateMe(data: {
  first_name?: string;
  last_name?: string;
  avatar?: File | null;
  date_of_birth?: string;
  gender?: string;
  language?: string;
}) {
  const { data: response } = await api.patch<UserResponse>("/users/me/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}

export async function getAddresses() {
  const { data } = await api.get<Address[]>("/me/addresses/");
  return data;
}

export async function addAddress(data: Omit<Address, "id">) {
  const { data: response } = await api.post<Address>("/me/addresses/", data);
  return response;
}

export async function updateAddress(id: string, data: Partial<Address>) {
  const { data: response } = await api.patch<Address>(`/me/addresses/${id}/`, data);
  return response;
}

export async function deleteAddress(id: string) {
  const { data } = await api.delete(`/me/addresses/${id}/`);
  return data;
}
