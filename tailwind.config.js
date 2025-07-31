/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#B51D2A',
                background: '#181818',
                foreground: '#f8fafc',
            },
        },
    },
    plugins: [],
}