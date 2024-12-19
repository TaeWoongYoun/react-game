import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const RSPgamePage = () => {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [result, setResult] = useState('게임을 시작해주세요!');
    const [showVenomEffect, setShowVenomEffect] = useState(false);
  
    const startGame = () => {
      setIsGameStarted(true);
      setResult('선택하세요!');
      setShowVenomEffect(false);
    };
  
    const play = (playerChoice) => {
      const choices = ['rock', 'scissors', 'paper'];
      const computerChoice = choices[Math.floor(Math.random() * 3)];
      
      setShowVenomEffect(true);
  
      const choiceEmojis = {
        'rock': '✊',
        'scissors': '✌️',
        'paper': '🖐️'
      };
  
      let gameResult;
      if (playerChoice === computerChoice) {
        gameResult = '무승부! 😐';
      } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'scissors' && computerChoice === 'paper') ||
        (playerChoice === 'paper' && computerChoice === 'rock')
      ) {
        gameResult = '승리! 🎉';
      } else {
        gameResult = '패배! 😢';
      }
  
      setTimeout(() => {
        setResult(`당신: ${choiceEmojis[playerChoice]}\n컴퓨터: ${choiceEmojis[computerChoice]}\n${gameResult}`);
      }, 1000);
    };
  
    const resetGame = () => {
      setIsGameStarted(false);
      setResult('게임을 시작해주세요!');
      setShowVenomEffect(false);
    };
  
    return (
      <div className="rsp-container">
        <Link to="/" className="back-link">
          메인으로 돌아가기
        </Link>
  
        <h1 className="rsp-title">가위바위보 게임</h1>
  
        <div 
          className={`result-container ${showVenomEffect ? 'venom-effect' : ''}`}
        >
          {result}
        </div>
  
        <div className="control-buttons">
          <button className="start-button" onClick={startGame}>
            게임 시작
          </button>
          <button className="reset-button" onClick={resetGame}>
            리셋
          </button>
        </div>
  
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