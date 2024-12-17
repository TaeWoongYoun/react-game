import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const RSPgamePage = () => {
    // 게임 상태 관리
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [result, setResult] = useState('결과가 여기에 표시됩니다');
    const [showVenomEffect, setShowVenomEffect] = useState(false);
    const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0 });
  
    // 게임 시작 함수
    const startGame = () => {
      setIsGameStarted(true);
      setResult('선택하세요!');
      setShowVenomEffect(false);
    };
  
    // 게임 플레이 함수
    const play = (playerChoice) => {
      const choices = ['rock', 'scissors', 'paper'];
      const computerChoice = choices[Math.floor(Math.random() * 3)];
      
      setShowVenomEffect(true);
  
      const choiceEmojis = {
        'rock': '✊',
        'scissors': '✌️',
        'paper': '🖐️'
      };
  
      // 승패 결정 로직
      let gameResult;
      if (playerChoice === computerChoice) {
        gameResult = '무승부! 😐';
        setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
      } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'scissors' && computerChoice === 'paper') ||
        (playerChoice === 'paper' && computerChoice === 'rock')
      ) {
        gameResult = '승리! 🎉';
        setScore(prev => ({ ...prev, wins: prev.wins + 1 }));
      } else {
        gameResult = '패배! 😢';
        setScore(prev => ({ ...prev, losses: prev.losses + 1 }));
      }
  
      // 결과 표시
      setTimeout(() => {
        setResult(`당신: ${choiceEmojis[playerChoice]}\n컴퓨터: ${choiceEmojis[computerChoice]}\n${gameResult}`);
      }, 1000);
    };
  
    // 게임 리셋 함수
    const resetGame = () => {
      setIsGameStarted(false);
      setResult('결과가 여기에 표시됩니다');
      setShowVenomEffect(false);
      setScore({ wins: 0, losses: 0, draws: 0 });
    };
  
    return (
      <div className="rsp-container">
        <Link to="/" className="back-link">
          메인으로 돌아가기
        </Link>
  
        <h1 className="rsp-title">가위바위보 게임</h1>
        
        {/* 스코어보드 */}
        <div className="score-board">
          <div className="score-item">승: {score.wins}</div>
          <div className="score-item">패: {score.losses}</div>
          <div className="score-item">무: {score.draws}</div>
        </div>
  
        {/* 결과 표시 컨테이너 */}
        <div 
          className={`result-container ${showVenomEffect ? 'venom-effect' : ''}`}
        >
          {result}
        </div>
  
        {/* 게임 컨트롤 버튼 */}
        <div className="control-buttons">
          <button className="start-button" onClick={startGame}>
            게임 시작
          </button>
          <button className="reset-button" onClick={resetGame}>
            리셋
          </button>
        </div>
  
        {/* 게임 선택지 */}
        {isGameStarted && (
          <div className="choices">
            <span
              className="choice"
              onClick={() => play('rock')}
              role="button"
              aria-label="바위"
            >
              ✊
            </span>
            <span
              className="choice"
              onClick={() => play('scissors')}
              role="button"
              aria-label="가위"
            >
              ✌️
            </span>
            <span
              className="choice"
              onClick={() => play('paper')}
              role="button"
              aria-label="보"
            >
              🖐️
            </span>
          </div>
        )}
      </div>
    );
  };
  
  export default RSPgamePage;