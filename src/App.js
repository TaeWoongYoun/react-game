import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import './App.css'

const EMOJIS = ['🐶', '🐱', '🐼', '🐨', '🦊', '🦁', '🐯', '🐸'];
const CARD_PAIRS = [...EMOJIS, ...EMOJIS];

function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledCards = CARD_PAIRS
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji: emoji,
      }));
    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsWon(false);
  };

  const handleCardClick = (cardId) => {
    if (
      flipped.length === 2 || 
      flipped.includes(cardId) || 
      matched.includes(cardId)
    ) return;

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstId, secondId] = newFlipped;
      
      if (cards[firstId].emoji === cards[secondId].emoji) {
        setMatched(prev => [...prev, firstId, secondId]);
        setFlipped([]);
        
        if (matched.length + 2 === cards.length) {
          setIsWon(true);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };
  
  return (
    <div className="container">
      <div className="header">
        <h1>카드 게임</h1>
        <div className="game-info">
          <span>시도 횟수: {moves}</span>
          <button onClick={initializeGame} className="reset-btn">
            게임 재시작
          </button>
        </div>
      </div>

      <div className="card-grid">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`card ${
              flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''
            } ${matched.includes(card.id) ? 'matched' : ''}`}
            disabled={isWon}
          >
            {(flipped.includes(card.id) || matched.includes(card.id)) ? (
              <span className="emoji">{card.emoji}</span>
            ) : (
              <Sparkles className="sparkle" size={32} />
            )}
          </button>
        ))}
      </div>

      {isWon && (
        <div className="win-message">
          <h2>🎉 Congratulations! You won in {moves} moves! 🎉</h2>
        </div>
      )}
    </div>
  );
  }


export default App;