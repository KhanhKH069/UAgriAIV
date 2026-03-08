/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './lib/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#edfff4',
                    100: '#d5ffe9',
                    200: '#aeffd3',
                    300: '#70ffb3',
                    400: '#2bef87',
                    500: '#00d66a',
                    600: '#00b054',
                    700: '#008a44',
                    800: '#006c37',
                    900: '#00582f',
                },
                dark: {
                    900: '#14221a',
                    800: '#192b21',
                    700: '#1e3327',
                    600: '#254031',
                    500: '#2c4d3b',
                    400: '#38634c',
                },
                surface: {
                    DEFAULT: '#1f3328',
                    card: '#243b2d',
                    border: '#2c4a39',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 3s ease-in-out infinite',
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
            },
            keyframes: {
                fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
                slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'grid-pattern': 'linear-gradient(rgba(0,214,106,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,214,106,0.03) 1px, transparent 1px)',
            },
            backgroundSize: {
                'grid': '40px 40px',
            },
        },
    },
    plugins: [],
}
