import { Routes, Route } from "react-router-dom";

import SideBar from "../components/SideBar";
import InitialPage from "./InitialPage";
import Documents from "./Documents";
import { ProtectedRoute } from "../components/ProtectedRoute";

function HomePage() {
  return (
    <main className="min-h-screen flex relative">
      <SideBar />
      <section className="flex-1 bg-gray-100 p-4 overflow-y-auto scrollbar-hide">
        <Routes>
          <Route index element={<InitialPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="doc/:id" element={<Documents />} />
          </Route>
        </Routes>
      </section>
    </main>
  );
}
export default HomePage;
