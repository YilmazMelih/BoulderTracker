import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider>
            <App />
            <Toaster />
            <Analytics />
        </Provider>
    </StrictMode>
);
