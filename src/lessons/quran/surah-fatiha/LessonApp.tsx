import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SurahFatiha from "./pages/SurahFatiha";

// Thin wrapper — provides the internal sub-routes without a new BrowserRouter.
// /lessons/surah-fatiha/           → lesson menu (Index)
// /lessons/surah-fatiha/surah/fatiha → lesson content (SurahFatiha)
export default function SurahFatihaLesson() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="surah/fatiha" element={<SurahFatiha />} />
    </Routes>
  );
}
