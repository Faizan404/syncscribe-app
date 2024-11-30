import Header from "./components/Header";
import HomePage from "./pages/HomePage";

import { Toaster } from "react-hot-toast";



export default function App() {

  return (
    <>
      <Header />
      <HomePage />
      <Toaster position="top-right" />
    </>
  );
}
