import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DiscoverPage from "./pages/DiscoverPage";
import PlaylistsPage from "./pages/PlaylistsPage";
import UploadPage from "./pages/UploadPage";
import AppShell from "./components/AppShell";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="playlists" element={<PlaylistsPage />} />
        <Route path="upload" element={<UploadPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
