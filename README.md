# Khoroch AI - Smart Expense Wallet

Khoroch AI is a smart, responsive expense tracking application designed for managing real-time event and daily expenses. It features a built-in AI assistant powered by Google Gemini to help you analyze your spending.

## Features

- **Expense Management**: Add, edit, and delete expenses with real-time updates.
- **Smart Dashboard**: View daily totals, buyer summaries, and spending trends.
- **AI Assistant**: Chat with Khoroch AI to get insights about your spending (e.g., "How much did we spend on food?").
- **Calendar View**: Track expenses by date.
- **Analytics**: Visual charts for daily trends and category distribution.
- **Responsive Design**: Works seamlessly on desktop and mobile.
- **Data Persistence**: Data is saved locally in your browser.
- **Export**: Download your expense history as CSV.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand (with Local Storage persistence)
- **AI**: Google Generative AI (Gemini)
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

1.  **Clone the repository** (if applicable) or navigate to the project folder.

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env.local` file in the root directory and add your Google Gemini API key:
    ```env
    GOOGLE_AI_API_KEY=your_api_key_here
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Open the app**:
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Add Expense**: Click the "+" button on the dashboard or "Add Expense" in the sidebar.
- **Edit/Delete**: Use the action buttons in the expense list.
- **Chat**: Click the floating robot icon in the bottom-right to ask questions about your data.
- **Settings**: Toggle Dark Mode or export your data.

## License

MIT
