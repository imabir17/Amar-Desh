/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    50: '#f8fafc',
                    100: '#0f172a',
                    200: '#1e293b',
                    300: '#334155',
                    400: '#475569',
                    500: '#64748b',
                    600: '#94a3b8',
                    700: '#cbd5e1',
                    800: '#0a0f1e',
                    900: '#020617',
                },
                accent: {
                    cyan: '#06b6d4',
                    purple: '#a855f7',
                    pink: '#ec4899',
                    emerald: '#10b981',
                    amber: '#f59e0b',
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
                'float': 'float 3s ease-in-out infinite',
                'slide-up': 'slideUp 0.5s ease-out',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)' },
                    '100%': { boxShadow: '0 0 30px rgba(168, 85, 247, 0.8)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
        },
    },
    plugins: [],
}
