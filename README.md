# Collaborative Todo-List App

A collaborative to-do list application built with Next.js, Tailwind CSS, and Supabase. This app allows users to create, edit, and share tasks with others in real time. Powered by Zustand for global state management and TanStack Query for efficient data fetching, this app is designed to be fast, responsive, and easy to use.

## Demo

Check out the live demo here: [Collaborative Todo-List App Demo](https://todo-list-app-pi-pink.vercel.app/)

## Features

- Real-time task updates with Supabase
- Collaborative task sharing
- Simple and clean UI with Tailwind CSS
- Optimized data fetching and caching with TanStack Query
- Easy state management using Zustand

## Tech Stack

- **Supabase** – For backend database and real-time updates
- **Next.js** – Framework for server-rendered React applications
- **Typescript** - To add type safety.
- **Tailwind CSS** – For styling the app
- **Zustand** – For global state management
- **TanStack Query** – For fetching, caching, and syncing server state

## Getting Started

Follow these steps to set up the Collaborative Todo-List App on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Supabase account](https://supabase.io/) and a new project created
- Environment variables for Supabase setup

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Zeyad-Sayed-70/Todo-List-App.git
   cd todo-list-app

2. **Install dependencies:**

   ```bash
   npm install

3. **Set up environment variables:**
Create a .env.local file in the root of your project with the following variables:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>

  Replace <your-supabase-url> and <your-supabase-anon-key> with the values from your Supabase project.


4. **Set up Supabase:**

- Log into your Supabase dashboard.
- Create a new table for tasks and set up the necessary fields (id, task, completed, etc.).
- Enable real-time updates on the table.

### Running the App Locally
1. **Start the development server:**

    ```bash
    npm run dev

2. **Open the app:**

  Navigate to http://localhost:3000 in your browser.

### Scripts
- <code>npm run dev</code> – Starts the development server.
- <code>npm run build</code> – Builds the app for production.
- <code>npm start</code> – Runs the app in production mode.
  
### Usage
1. Sign up or log in to the app using your Supabase account.
2. Create a new task by entering a task and clicking "Add"
3. Add connections to your room by selecting a user and clicking "Add"
4. Watch as updates happen in real-time as collaborators add or modify tasks with your connections.


### Acknowledgments
Thanks to the open-source projects that made this app possible:

- [Supabase](https://supabase.com/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://www.npmjs.com/package/zustand)
- [TanStack Query](https://tanstack.com/)
