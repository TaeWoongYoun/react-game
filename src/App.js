import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import CardGamePage from './pages/CardGamePage';
import RSPgamePage from './pages/RSPgamePage';
import WatermelonGame from './pages/WatermelonGame';
import ColorGamePage from './pages/ColorGamePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/card-game" element={<CardGamePage />} />
        <Route path="/rsp-game" element={<RSPgamePage />} />
        <Route path="/wm-game" element={<WatermelonGame />} />
        <Route path="/color-game" element={<ColorGamePage />} />
      </Routes>
    </Router>
  );
}

export default App;