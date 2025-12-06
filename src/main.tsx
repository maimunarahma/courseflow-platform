import { createRoot } from "react-dom/client";
import axios from "axios";
import App from "./App.tsx";
import "./index.css";

// Ensure axios sends credentials (cookies) with requests by default
axios.defaults.withCredentials = true;
// Optionally set baseURL if you use VITE_SERVER_URL env var
if (import.meta.env.VITE_SERVER_URL) {
	axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL as string;
}

createRoot(document.getElementById("root")!).render(<App />);
