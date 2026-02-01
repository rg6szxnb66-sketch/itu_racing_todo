"use client"; // Bu satır şart, çünkü tıklama olayı (useState) var.

import { useState } from "react";

interface InputProps {
  label: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  label,
  type,
  value,
  placeholder,
  onChange,
}: InputProps) {
  // Şifrenin görünüp görünmediğini takip eden değişken
  const [showPassword, setShowPassword] = useState(false);

  // Eğer bu kutu "password" kutusuysa ve kullanıcı "göster" dediyse tipi "text" yap.
  // Değilse, orijinal tipi (password veya text) koru.
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  // Göz ikonuna basınca çalışacak fonksiyon
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-400 mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
  /* 1. TEMEL BOYUT VE YERLEŞİM */
  w-full p-3 pr-12 

  /* 2. RENK VE KENARLIKLAR */
  bg-gray-800 border border-gray-700 rounded text-white 

  /* 3. SENİN EKLEYECEĞİN FONT KISMI (BURAYA YAZ!) */
  font-mono text-l font-medium tracking-tighter text-green-400

  /* 4. EFEKTLER VE GEÇİŞLER */
  transition-all duration-300
  focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500
  hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]
  focus:shadow-[0_0_20px_rgba(34,197,94,0.6)]
"
        />

        {/* Sadece şifre kutularında GÖZ ikonunu göster */}
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
          >
            {showPassword ? (
              // GÖZ AÇIK İKONU (Şifre Görünüyor)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            ) : (
              // GÖZ KAPALI İKONU (Şifre Gizli)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
