/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Unilever + Tableau Corporate Colors
        tableau: {
          blue: '#0078D4',          // Primary Unilever
          'blue-dark': '#106EBE',   // Darker blue
          teal: '#00A4A6',          // Secondary Unilever
          navy: '#2c3e50',          // Corporate navy
          gray: {
            50: '#f8f9fa',
            100: '#e9ecef',
            200: '#dee2e6',
            300: '#ced4da',
            400: '#adb5bd',
            500: '#6c757d',
            600: '#495057',
            700: '#343a40',
            800: '#212529',
            900: '#1a1d20'
          }
        },
        status: {
          success: '#27AE60',       // Above target
          warning: '#F39C12',       // Near target  
          danger: '#E74C3C',        // Below target
          info: '#3498DB'           // Information
        },
        chart: {
          primary: '#5778a4',       // Tableau blue
          orange: '#e49444',        // Tableau orange
          red: '#d1615d',          // Tableau red
          teal: '#85b6b2',         // Tableau teal
          green: '#6a9f58',        // Tableau green
          yellow: '#e7ca60',       // Tableau yellow
          purple: '#a87c9f'        // Tableau purple
        }
      },
      fontFamily: {
        'tableau': ['Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        'data': ['Consolas', 'Monaco', 'monospace']
      },
      fontSize: {
        'kpi': ['2.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'metric': ['1.125rem', { lineHeight: '1.2', fontWeight: '600' }],
        'label': ['0.875rem', { lineHeight: '1.3', fontWeight: '500' }]
      },
      boxShadow: {
        'tableau': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'tableau-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      },
      borderRadius: {
        'tableau': '4px'
      },
      spacing: {
        'tableau': '8px'
      }
    },
  },
  plugins: [],
}