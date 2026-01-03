# Call Analytics Dashboard

A React + TypeScript dashboard for visualizing voice agent call analytics with interactive multi-ring donut charts and call duration analysis.

## Features

- 📊 **Call Duration Analysis** - Area chart visualization of call durations over time
- 🎯 **Sad Path Analysis** - Multi-ring concentric donut chart showing hierarchical failure reasons
- 💾 **User Data Persistence** - Save and load user-specific data using Supabase
- ✅ **Confirmation Dialogs** - Preview previous values before overwriting
- 🎨 **Dark Theme UI** - Modern, clean interface with glassmorphism effects

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **ECharts** for multi-ring donut charts
- **Recharts** for area charts
- **Supabase** for backend data storage
- **Tailwind CSS** for styling

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd call-analytics
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Environment Variables

Create a `.env` file with the following variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

## Database Setup

The app uses a Supabase table called `user_data` with the following structure:

```sql
CREATE TABLE user_data (
  email TEXT PRIMARY KEY,
  chart_data JSONB NOT NULL
);
```

The `chart_data` field stores hierarchical chart data:
```json
{
  "innerRing": [
    { "name": "Language Issues", "value": 75 },
    { "name": "Hostility Issues", "value": 25 }
  ],
  "outerRing": [
    { "name": "Assistant did not speak French", "value": 20 },
    { "name": "Unsupported Language", "value": 35 },
    ...
  ]
}
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

This project is deployed on Vercel. The build output is in the `dist` directory and can be deployed to any static hosting service.

## License

MIT
