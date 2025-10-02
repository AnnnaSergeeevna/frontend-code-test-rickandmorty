import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "urql";
import { createClient, cacheExchange, fetchExchange } from "urql";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CharacterPage from "./pages/CharacterPage";
import HomePage from "./pages/HomePage";

const client = createClient({
  url: "https://rickandmortyapi.com/graphql",
  exchanges: [cacheExchange, fetchExchange],
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/character/:id",
    element: <CharacterPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider value={client}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
