import ReactDOM from "react-dom/client";
import App from "App";

import { QueryClient, QueryClientProvider } from "react-query";

import { Provider } from "react-redux";
import { store } from "rtk/store";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "swiper/css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
    </Provider>
  </QueryClientProvider>
);
