module.exports = {
    mode: 'jit',
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    theme: {
        extend: {
            backgroundImage: {
                'mv-logo': "url('/public/logo.png')",
                'watermark': "url('/public/watermark.png')",
            },
            colors: {
                "no-hands-day": "#FF4500",
            },
        },
    },
    plugins: [],
};