# Counter Dashboard Vite

A modern, responsive dashboard application built with React and TypeScript that displays dynamic numerical data with animated counters. The application is designed to work with data sourced from Google Spreadsheets via Google Apps Script.

## Features

- **Real-time Data Display**: Automatically fetches and updates dashboard data every 10 seconds
- **Animated Counters**: Smooth animations when numerical values change
- **Theme Support**: Built-in light and dark mode with system preference detection
- **Responsive Design**: Adapts to different screen sizes and devices
- **Loading States**: Elegant loading animation and skeleton UI when data is being fetched
- **Error Handling**: Graceful error state display when API requests fail

## Tech Stack

- **React 19**: Modern front-end library for building user interfaces
- **TypeScript**: Type-safe JavaScript for better developer experience
- **Vite**: Next-generation frontend tooling for faster development
- **CSS Variables**: Dynamic theming with CSS custom properties

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/effmuhammad/counter-dashboard.git
cd counter-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Create a `.env` file in the root directory with your API URL:
```
VITE_API_URL=your_api_endpoint_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173/`

## API Data Format

The application expects data from the API in the following format:

```typescript
type DashboardDataItem = [string, number | string, string?];
```

Where:
- First element is the title of the card
- Second element is the numerical value to display
- Third (optional) element is a custom color for the value

The first item in the array is special and used as the dashboard title.

Example API response:
```json
[
  ["title", "Dashboard Title"],
  ["Users", 1250, "#4287f5"],
  ["Revenue", 45600, "#42f587"],
  ["Conversion", 12.5, "#f54242"],
  ["Growth", 7.2]
]
```

## Google Spreadsheet Integration

This dashboard is designed to work with Google Spreadsheets as a data source:

### Spreadsheet Structure
1. The spreadsheet should have at least 2 columns:
   - First column: Card titles (with the first row typically containing "title")
   - Second column: Values to be displayed
   - Third column (optional): Custom color codes in hexadecimal format

### Google Apps Script Setup

1. Create a Google Apps Script project associated with your spreadsheet
2. Set up a web app endpoint with the following script:

```javascript
function doGet(e) {
  var action = e.parameter.action;
  
  if (action === "read") {
    return getData();
  }
  
  return ContentService.createTextOutput(
    JSON.stringify({status: "error", message: "Invalid action"})
  ).setMimeType(ContentService.MimeType.JSON);
}

function getData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  return ContentService.createTextOutput(
    JSON.stringify(data)
  ).setMimeType(ContentService.MimeType.JSON);
}
```

3. Deploy as a web app:
   - Execute as: Me (your account)
   - Who has access: Anyone (recommended for testing) or Anyone with Google account
   - Copy the web app URL for use in your .env file (VITE_API_URL)

4. Enable CORS by adding the following to your Apps Script:

```javascript
function doGet(e) {
  var action = e.parameter.action;
  var output;
  
  if (action === "read") {
    output = getData();
  } else {
    output = ContentService.createTextOutput(
      JSON.stringify({status: "error", message: "Invalid action"})
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  // Add CORS headers
  var headers = output.getHeaders();
  headers['Access-Control-Allow-Origin'] = '*';
  return output;
}
```

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` folder.

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
counter-dashboard/
├── public/             # Static assets
├── src/                # Source files
│   ├── assets/         # Images and other assets
│   ├── App.css         # Main styles
│   ├── App.tsx         # Main application component
│   ├── LoadingAnimation.tsx  # Loading spinner component
│   ├── ThemeContext.tsx      # Theme context provider
│   ├── ThemeToggle.tsx       # Theme toggle component
│   ├── main.tsx        # Application entry point
│   └── ...
├── index.html          # HTML entry point
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Component Overview

### CountUp Component

Animated counter that smoothly transitions between numerical values.

### DashboardCard Component

Card display with title and animated numerical value.

### ThemeToggle Component

Toggle switch for changing between light and dark themes.

### LoadingAnimation Component

Displays a loading spinner and skeleton UI while data is being fetched.

## License

[MIT](LICENSE)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Developed with ❤️ using React and TypeScript