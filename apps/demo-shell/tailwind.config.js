/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,vue}'],
  safelist: [
    // AppCard headerColor values — applied via dynamic :class binding
    'bg-amber-600',
    'bg-teal-600',
    'bg-orange-600',
  ],
  theme: { extend: {} },
  plugins: [],
}
