import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from "matter-js";

const FRUITS = [  
    { radius: 25, color: "#ff7c7c", score: 1, name: "체리" },   // 크기 증가
    { radius: 35, color: "#ff9f71", score: 2, name: "딸기" },   
    { radius: 45, color: "#ffd93d", score: 3, name: "레몬" },   
    { radius: 55, color: "#95d5b2", score: 4, name: "키위" },   
    { radius: 65, color: "#ff8364", score: 5, name: "오렌지" }, 
    { radius: 75, color: "#ff6b6b", score: 6, name: "사과" },   
    { radius: 85, color: "#c0eb75", score: 7, name: "배" },    
    { radius: 95, color: "#87ceeb", score: 8, name: "블루베리" }, 
    { radius: 105, color: "#ffb4a2", score: 9, name: "복숭아" }, 
    { radius: 115, color: "#ff8ba7", score: 10, name: "수박" }  
];

const MOVE_SPEED = 15;
const MIN_X = 100;
const MAX_X = 520;
const DROP_HEIGHT = 120;

export default function WatermelonGame() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const runnerRef = useRef(null);
  
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('watermelon-high-score');
    return saved ? parseInt(saved) : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [nextFruit, setNextFruit] = useState(0);
  const [canDrop, setCanDrop] = useState(true);
  const [position, setPosition] = useState(310);

  // 게임 초기화
  useEffect(() => {
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Events = Matter.Events;

    // 엔진 생성
    engineRef.current = Engine.create({
      enableSleeping: false,
      gravity: { x: 0, y: 1.5 }
    });

    // 렌더러 설정
    renderRef.current = Render.create({
      element: containerRef.current,
      engine: engineRef.current,
      canvas: canvasRef.current,
      options: {
        width: 620,
        height: 850,
        wireframes: false,
        background: '#F7F4C8'
      }
    });

    // 벽 생성
    const walls = [
      Bodies.rectangle(15, 425, 30, 850, {
        isStatic: true,
        render: { fillStyle: "#E6B143" }
      }),
      Bodies.rectangle(605, 425, 30, 850, {
        isStatic: true,
        render: { fillStyle: "#E6B143" }
      }),
      Bodies.rectangle(310, 850, 620, 60, {
        isStatic: true,
        render: { fillStyle: "#E6B143" }
      }),
      Bodies.rectangle(310, 150, 620, 2, {
        name: "topLine",
        isStatic: true,
        isSensor: true,
        render: { fillStyle: "#E6B143" }
      })
    ];

    World.add(engineRef.current.world, walls);

    // 충돌 감지
    Events.on(engineRef.current, 'collisionStart', (event) => {
      event.pairs.forEach((collision) => {
        const bodyA = collision.bodyA;
        const bodyB = collision.bodyB;

        if (bodyA.name === "topLine" || bodyB.name === "topLine") {
          if (!bodyA.isStatic && !bodyB.isStatic) {
            setGameOver(true);
          }
          return;
        }

        if (bodyA.size === undefined || bodyB.size === undefined) return;
        if (bodyA.size !== bodyB.size) return;

        World.remove(engineRef.current.world, [bodyA, bodyB]);
        
        const newSize = bodyA.size + 1;
        if (newSize >= FRUITS.length) {
          setScore(prev => prev + FRUITS[bodyA.size].score * 2);
          return;
        }

        const newFruit = FRUITS[newSize];
        const newBody = Bodies.circle(
          (bodyA.position.x + bodyB.position.x) / 2,
          (bodyA.position.y + bodyB.position.y) / 2,
          newFruit.radius,
          {
            restitution: 0.3,
            friction: 0.1,
            frictionAir: 0.0003,
            density: 0.001,
            render: {
              fillStyle: newFruit.color,
              strokeStyle: '#000',
              lineWidth: 1
            },
            size: newSize
          }
        );

        World.add(engineRef.current.world, newBody);
        setScore(prev => prev + FRUITS[bodyA.size].score);
      });
    });

    // 게임 실행
    runnerRef.current = Matter.Runner.create();
    Matter.Runner.run(runnerRef.current, engineRef.current);
    Render.run(renderRef.current);

    setNextFruit(Math.floor(Math.random() * 3));

    return () => {
      if (engineRef.current) {
        World.clear(engineRef.current.world);
        Engine.clear(engineRef.current);
      }
      if (renderRef.current) {
        Render.stop(renderRef.current);
      }
      if (runnerRef.current) {
        Matter.Runner.stop(runnerRef.current);
      }
    };
  }, []);

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          setPosition(prev => Math.max(MIN_X, prev - MOVE_SPEED));
          break;
        case 'ArrowRight':
          setPosition(prev => Math.min(MAX_X, prev + MOVE_SPEED));
          break;
        case ' ':
          if (!canDrop || !engineRef.current) return;
          
          const fruit = FRUITS[nextFruit];
          const ball = Matter.Bodies.circle(position, DROP_HEIGHT, fruit.radius, {
            restitution: 0.3,
            friction: 0.1,
            frictionAir: 0.0003,
            density: 0.001,
            render: {
              fillStyle: fruit.color,
              strokeStyle: '#000',
              lineWidth: 1
            },
            size: nextFruit
          });

          Matter.World.add(engineRef.current.world, ball);
          setCanDrop(false);
          setNextFruit(Math.floor(Math.random() * 3));
          setTimeout(() => setCanDrop(true), 500);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [position, canDrop, nextFruit, gameOver]);

  return (
    <div className="watermelon-game" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      padding: '20px',
      backgroundColor: '#2c3e50',
      minHeight: '100vh'
    }}>
      <div className="game-container" style={{ 
        position: 'relative',
        backgroundColor: '#34495e',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 0 20px rgba(0,0,0,0.3)'
      }}>
        <div ref={containerRef} className="canvas-container">
          <canvas ref={canvasRef}/>
          
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '0',
            right: '0',
            display: 'flex',
            justifyContent: 'space-around',
            padding: '10px'
          }}>
            <div style={{
              backgroundColor: 'rgba(230,177,67,0.9)',
              padding: '8px 15px',
              borderRadius: '20px',
              color: '#2c3e50',
              fontWeight: 'bold'
            }}>Score: {score}</div>
          </div>

          {!gameOver && canDrop && (
            <div style={{
              position: 'absolute',
              top: `${DROP_HEIGHT - FRUITS[nextFruit].radius}px`,
              left: `${position - FRUITS[nextFruit].radius}px`,
              width: `${FRUITS[nextFruit].radius * 2}px`,
              height: `${FRUITS[nextFruit].radius * 2}px`,
              backgroundColor: FRUITS[nextFruit].color,
              borderRadius: '50%',
              opacity: 0.5,
              transition: 'left 0.1s',
              border: '1px solid #000'
            }}/>
          )}

          {gameOver && (
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '15px'
            }}>
              <div style={{
                backgroundColor: '#34495e',
                padding: '30px',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <h2 style={{
                  color: '#E6B143',
                  fontSize: '36px',
                  margin: '0 0 20px 0'
                }}>Game Over!</h2>
                <p style={{
                  color: '#fff',
                  fontSize: '24px'
                }}>Final Score: {score}</p>
                <button 
                  onClick={() => window.location.reload()}
                  style={{
                    backgroundColor: '#E6B143',
                    border: 'none',
                    padding: '12px 30px',
                    borderRadius: '25px',
                    color: '#2c3e50',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '20px'
                  }}
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}