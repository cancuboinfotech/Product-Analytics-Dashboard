# Product Analytics Dashboard

A scalable frontend application built with Next.js, featuring a real-time updating virtualized product list, dynamic filtering, and analytics dashboard.

## 🚀 Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run tests:**
   ```bash
   npm run test
   ```

## 🏗️ Architecture Decisions

- **Framework:** Next.js (App Router) used for rapid setup and strong modern ecosystem.
- **State Management:** Zustand is used for global state. It's chosen over Context API because it allows components to subscribe to specific parts of the store without causing widespread re-renders when data (like frequent price/stock updates) changes.
- **Data Layer:** `ProductService` simulates an API fetch and continuous real-time pub-sub updates to decouple logic from the UI components.
- **Styling:** Vanilla CSS enclosed in CSS Modules to avoid globally conflicting styles, conforming to Next.js best practices and keeping bundle size minimal while leveraging native browser performance.

## ⚡ Performance Optimizations

1. **List Virtualization (`@tanstack/react-virtual`):** The DOM only renders ~10-15 rows out of the 1000 items in the dataset, keeping the layout steady and memory usage low.
2. **Debouncing:** Search queries are debounced, preventing expensive filter recalculations on every keystroke.
3. **Data Subscription Model:** The simulated live data uses a pub-sub model where only the affected item in the global store is updated.
4. **Memoization:** Computed analytics data is wrapped in `useMemo` so charts don't expensively recalculate every render unless underlying filtered list changes.

## 🧩 Assumptions & Trade-offs

- **Testing Environment:** Setup using Vitest for test execution.
- **Updates Simulation:** Updates simulate a fast-paced environment (1 update per second). In a real stock application, this would utilize WebSockets rather than setInterval.
- **Analytics Display:** Uses Recharts as it natively supports React and is fully responsive. Chart counts update dynamically based on search and filters.
