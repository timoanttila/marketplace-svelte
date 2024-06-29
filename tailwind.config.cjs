/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      screens: {
        xs: '540px'
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        tuspe: {
          primary: '#0077c8',
          secondary: '#fbd914',
          accent: '#D12BEC',
          neutral: '#6bf5c0',
          'base-100': '#f2f2f2',
          info: '#d12bec',
          success: '#2bd4bd',
          warning: '#f4c152',
          error: '#fb6f84'
        }
      }
    ],
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
    prefix: '', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: false
  }
}
