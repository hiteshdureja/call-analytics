export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#1C1C28",
                card: "#222230",
                input: "#0F0F1A",
                accent: "#855CF1",
                highlight: "#41E5E4",
                secondary: "#9ca3af"
            },
            borderRadius: {
                '4xl': '32px',
                '5xl': '48px'
            }
        }
    },
    plugins: [],
}
