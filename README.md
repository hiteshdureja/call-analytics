# Call Analytics Dashboard

A modern React + TypeScript web application for visualizing and analyzing voice agent call data. This dashboard provides interactive charts and data visualization tools to help understand call patterns, identify failure reasons, and track performance metrics over time.

## Overview

This application was built to help analyze voice agent interactions, specifically focusing on call durations and "sad path" scenarios - situations where calls don't complete successfully. The dashboard features a clean, dark-themed interface with interactive multi-ring donut charts and area charts that make it easy to understand complex data at a glance.

## Features

### 📊 Call Duration Analysis
Visualize call duration patterns over time with a smooth area chart. This helps identify peak calling hours, average call lengths, and trends in call duration data.

### 🎯 Sad Path Analysis
Interactive multi-ring concentric donut chart that breaks down failure reasons hierarchically. The inner ring shows high-level categories (like Language Issues and Hostility Issues), while the outer ring provides detailed breakdowns of specific failure types. This visualization makes it easy to understand both the big picture and the specific details.

### 💾 User Data Persistence
Save and load your custom chart data using Supabase. Each user's data is stored securely and can be retrieved by email address. This allows you to maintain your custom analytics configurations across sessions.

### ✅ Smart Confirmation Dialogs
Before overwriting existing data, the app shows you a clear comparison between your previous values and the new values you're trying to save. This prevents accidental data loss and gives you full control over your analytics.

### 🎨 Modern Dark Theme UI
Clean, modern interface with glassmorphism effects and a carefully crafted dark color scheme. The UI is designed to be easy on the eyes during long analytics sessions.

## Tech Stack

- **React 19** with TypeScript - Modern React with full type safety
- **Vite** - Lightning-fast development server and build tool
- **ECharts** - Powerful charting library for the multi-ring donut charts
- **Recharts** - React-friendly charting library for area charts
- **Supabase** - Backend-as-a-service for data storage and management
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development

## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** version 20.19+ or 22.12+ (check with `node --version`)
- **npm** or **yarn** package manager
- A **Supabase account** and project (free tier works fine)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hiteshdureja/call-analytics.git
   cd call-analytics
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This will install all required packages including React, TypeScript, Vite, and the charting libraries.

3. **Set up environment variables:**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
   
   You can find these values in your Supabase project settings under API.

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173)

5. **Open in your browser:**
   Navigate to the localhost URL shown in your terminal. Hot module replacement is enabled, so changes you make to the code will automatically refresh in the browser.

## Environment Variables

The application requires two environment variables to function properly:

- **VITE_SUPABASE_URL** - Your Supabase project URL (found in Project Settings → API)
- **VITE_SUPABASE_ANON_KEY** - Your Supabase anonymous/public key (also in Project Settings → API)

**Note:** The app will still load and display charts without these variables, but data persistence (saving/loading user data) will not work. This is useful for development and testing the UI.

## Database Setup

To enable data persistence, you'll need to create a table in your Supabase database. Here's the SQL to create the required table:

```sql
CREATE TABLE user_data (
  email TEXT PRIMARY KEY,
  chart_data JSONB NOT NULL
);
```

This table stores user-specific chart data. The `email` field serves as the unique identifier for each user, and `chart_data` stores the hierarchical chart structure as JSON.

### Data Structure

The `chart_data` field stores data in the following format:

```json
{
  "innerRing": [
    { "name": "Language Issues", "value": 75 },
    { "name": "Hostility Issues", "value": 25 }
  ],
  "outerRing": [
    { "name": "Assistant did not speak French", "value": 20 },
    { "name": "Unsupported Language", "value": 35 },
    { "name": "Assistant did not speak Spanish", "value": 20 },
    { "name": "Verbal Aggression", "value": 15 },
    { "name": "Customer Hostility", "value": 10 },
    { "name": "User refused to confirm identity", "value": 12 },
    { "name": "Caller Identification", "value": 10 },
    { "name": "Incorrect caller identity", "value": 8 }
  ]
}
```

The inner ring represents high-level categories, while the outer ring contains detailed breakdowns. This hierarchical structure allows for both high-level overview and detailed analysis.

## Available Scripts

- **`npm run dev`** - Start the development server with hot reload enabled
- **`npm run build`** - Build the application for production (outputs to `dist/` directory)
- **`npm run preview`** - Preview the production build locally before deploying
- **`npm run lint`** - Run ESLint to check code quality and find potential issues

## Deployment

This project is deployed on Vercel and is publicly accessible:

**Live URL:** https://call-analytics-beta.vercel.app/

The build output is in the `dist` directory and can be deployed to any static hosting service that supports single-page applications (Netlify, GitHub Pages, AWS S3, etc.).

### Vercel Deployment Notes

If you're deploying to Vercel:

1. Connect your GitHub repository to Vercel
2. Make sure to add the environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in the Vercel project settings
3. Vercel will automatically detect Vite and use the correct build settings
4. Each push to the main branch will trigger a new deployment

**Important:** To enable full functionality (data persistence), make sure to set the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables in your Vercel project settings under Settings → Environment Variables.

## Project Structure

```
call-analytics/
├── src/
│   ├── components/          # React components
│   │   ├── CallDurationChart.tsx
│   │   ├── EmailPrompt.tsx
│   │   └── SadPathChart.tsx
│   ├── pages/              # Page components
│   │   └── Dashboard.tsx
│   ├── lib/                # Utility libraries
│   │   └── supabaseClient.ts
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
└── tailwind.config.js      # Tailwind CSS configuration
```

## Usage

1. **View Call Duration Chart:** The area chart at the top shows call duration patterns (currently using sample data).

2. **Load Your Data:** 
   - Enter your email address in the input field
   - Click "Load" to retrieve your saved chart data
   - If no data exists, default sample data will be displayed

3. **Customize Chart Data:**
   - Enter comma-separated values in the input field
   - First 2 values are for the inner ring (Language Issues, Hostility Issues)
   - Next 8 values are for the outer ring breakdown
   - Click "Save Values" to store your data

4. **Confirm Overwrites:** If you have existing data and try to save new values, you'll see a confirmation dialog comparing old and new values before overwriting.

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements you'd like to suggest.


