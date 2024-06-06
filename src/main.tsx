import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { wagmiClient } from "./configs";
import { WagmiConfig } from "wagmi";
import "antd/dist/reset.css";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import store from "./states";
import { Provider } from "react-redux";

// Create a client
const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiConfig>
  </React.StrictMode>
);
