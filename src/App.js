import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import CardGamePage from './pages/CardGamePage';
import RSPgamePage from './pages/RSPgamePage';
import WatermelonGame from './pages/WatermelonGame';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/card-game" element={<CardGamePage />} />
        <Route path="/rsp-game" element={<RSPgamePage />} />
        <Route path="/wm-game" element={<WatermelonGame />} />
      </Routes>
    </Router>
  );
}

export default App;