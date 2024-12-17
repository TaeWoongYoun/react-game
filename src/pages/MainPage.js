import { Link } from 'react-router-dom';
import '../App.css'

const MainPage = () => {
  return (
    <div className="main-container">
      <h1 className="main-title">미니 게임 모음</h1>
      <div className="game-buttons">
        <Link to="/card-game" className="game-button card-game-btn">
          카드 매칭 게임
        </Link>
        <Link to="/rsp-game" className="game-button rsp-game-btn">
          가위바위보 게임
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
