# Centscape - Unified Wishlist Assignment

This repository contains the full-stack take-home assignment for the Founding Engineer role at Centscape. It features a React Native (Expo) client and a Node.js (Express) server.

## Project Structure

The project is organized as two independent applications within a single repository. This structure was chosen to ensure maximum dependency stability for the Expo client by preventing any potential conflicts from a hoisted monorepo (`npm workspaces`).

```

centscape-assignment/
├── app/         \# The React Native (Expo) frontend application
│   ├── node\_modules/
│   └── package.json
│
└── server/      \# The Node.js (Express) backend application
├── node\_modules/
└── package.json

````

---

## Prerequisites

Before you begin, ensure you have the following installed:
* **Node.js** (v18+ recommended)
* **npm** (v8+ recommended)
* **Xcode** (for running the iOS Simulator on a Mac) or **Android Studio** (for running an Android Emulator)
* **Expo Go** app on a physical device (optional, for testing on a real phone)

---

## Setup and Installation

Follow these steps precisely to set up and run the project.

**1. Clone the Repository**
```bash
git clone <your-repo-url>
cd centscape-assignment
````

**2. Install Backend Dependencies**
This command navigates to the server directory, installs its dependencies into `server/node_modules`, and returns to the root.

```bash
cd server && npm install && cd ..
```

**3. Install Frontend Dependencies**
This navigates to the app directory and uses `npx expo install`. This is the recommended command for Expo projects as it ensures all native dependency versions are compatible with the project's Expo SDK.

```bash
cd app && npx expo install && cd ..
```

-----

## Running the Project

You will need **two separate terminal windows** to run the backend and frontend servers simultaneously.

**Terminal 1: Start the Backend Server**

```bash
cd server
npm run dev
```

> The server will start on `http://localhost:3001`.

**Terminal 2: Start the Frontend App**

```bash
cd app
npx expo start -c
```

  * The `-c` flag is recommended on the first run to clear the bundler's cache.
  * Once the Metro bundler starts, you will see a QR code and a menu.
      * Press `i` to launch the iOS Simulator.
      * Press `a` to launch the Android Emulator.
      * Scan the QR code with the Expo Go app on your physical phone.

> **IMPORTANT:** If you are running on a physical device, ensure it is on the **same Wi-Fi network** as your computer. You will also need to update the `API_BASE_URL` in `app/services/api.ts` from `http://localhost:3001` to your computer's local network IP address (e.g., `http://192.168.1.10:3001`).

-----

## Key Features Implemented

### Backend (Node.js / Express)

  * **Secure Metadata Parsing:** A `/preview` endpoint that fetches and parses URL metadata.
  * **Robustness:** Implemented with request timeouts, redirect limits, and content size limits.
  * **SSRF Protection:** A security layer prevents the server from making requests to private or internal IP addresses.
  * **Rate Limiting:** Protects the endpoint from abuse by limiting requests to 10 per minute per IP.
  * **Validation & Error Handling:** Uses `express-validator` for input validation and has a centralized error handler.
  * **Unit Tests:** Core backend logic is tested using Jest and Supertest.

### Frontend (React Native / Expo)

  * **Wishlist UI:** Displays wishlist items in a clean, scrollable list.
  * **Add/Remove Functionality:** Users can add new items via a URL and remove existing ones.
  * **Data Persistence:** Wishlist data is saved to the device's local storage using `AsyncStorage` and persists across app restarts.
  * **Schema Migration:** Includes logic in the `useWishlist` hook to seamlessly migrate user data from a `v1` schema to a `v2` schema on app startup.
  * **Deduplication:** Uses a `normalizedUrl` in the `v2` schema to prevent duplicate items from being added.
  * **Deep Linking:** The app registers a `centscape://` scheme to allow opening the "Add Item" modal from an external link.
  * **Accessibility:** `accessibilityLabel` props are used on interactive elements like icon buttons for screen reader support.
  * **Haptic Feedback:** Provides subtle physical feedback on successful actions to improve user experience.

-----

## Engineering Tradeoffs & Design Decisions

  * **Persistence:** I chose **AsyncStorage** for its simplicity and because it's built-in, making it perfect for the scale of this assignment. For a production app with a larger dataset or more complex querying needs, a more robust solution like **SQLite** (via `expo-sqlite`) or **WatermelonDB** would be a better choice.
  * **State Management:** I relied on React's built-in hooks (`useState`, `useEffect`) encapsulated in a custom hook (`useWishlist`). This keeps the app lightweight and avoids external dependencies. For a more complex app with shared global state (like user authentication), a library like **Zustand** or **React Query** would be more appropriate.
  * **Price Extraction:** The fallback price extraction uses a simple regular expression. This is a pragmatic choice for a prototype but is inherently brittle. A production-grade solution would require a more sophisticated, possibly machine-learning-based, system or site-specific parsers.
  * **AI-Assisted Development:** An AI assistant was used as a productivity tool for generating boilerplate code, debugging dependency issues, and structuring documentation. The core engineering logic, architectural decisions, and final implementation were directed and refactored by me.
