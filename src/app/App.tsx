import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Agentation } from "agentation";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      {import.meta.env.DEV && <Agentation />}
    </>
  );
}
