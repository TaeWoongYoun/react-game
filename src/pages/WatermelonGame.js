import React, { useEffect, useRef, useState } from 'react';
import Matter from "matter-js";

const FRUITS = [
    { 
        radius: 20, 
        color: "#82AAFF", 
        borderColor: "#64B5F6",
        score: 1, 
        name: "블루베리",
        label: "🫐"
    },
    { 
        radius: 30,
        color: "#FF6B6B", 
        borderColor: "#FF5252",
        score: 2, 
        name: "체리",
        label: "🍒"
    },   
    { 
        radius: 50, 
        color: "#FF8787", 
        borderColor: "#FF6B6B",
        score: 3, 
        name: "딸기",
        label: "🍓"
    },
    { 
        radius: 70, 
        color: "#A8E6CF", 
        borderColor: "#8CD3B6",
        score: 4, 
        name: "키위",
        label: "🥝"
    },   
    { 
        radius: 90, 
        color: "#FFB94E", 
        borderColor: "#FFA726",
        score: 5, 
        name: "오렌지",
        label: "🍊"
    },
    { 
        radius: 110, 
        color: "#FF6B6B", 
        borderColor: "#FF5252",
        score: 6, 
        name: "사과",
        label: "🍎"
    },
    { 
        radius: 130, 
        color: "#FFCCBC", 
        borderColor: "#FFAB91",
        score: 7, 
        name: "복숭아",
        label: "🍑"
    },
    { 
        radius: 200, 
        color: "#FF9B9B", 
        borderColor: "#FF8383",
        score: 8, 
        name: "수박",
        label: "🍉"
    }
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

  const [fruits, setFruits] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [nextFruit, setNextFruit] = useState(0);
  const [canDrop, setCanDrop] = useState(true);
  const [position, setPosition] = useState(310);

  useEffect(() => {
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Events = Matter.Events;

    engineRef.current = Engine.create({
      enableSleeping: false,
      gravity: { x: 0, y: 1.5 }
    });

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

    Events.on(engineRef.current, 'afterUpdate', () => {
      const bodies = Matter.Composite.allBodies(engineRef.current.world);
      const currentFruits = bodies
        .filter(body => body.size !== undefined)
        .map(body => ({
          id: body.id,
          x: body.position.x,
          y: body.position.y,
          size: body.size,
          angle: body.angle
        }));
      setFruits(currentFruits);
    });

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
              visible: true,
              fillStyle: newFruit.color,
              strokeStyle: newFruit.borderColor,
              lineWidth: 4
            },
            size: newSize
          }
        );

        World.add(engineRef.current.world, newBody);
        setScore(prev => prev + FRUITS[bodyA.size].score);
      });
    });

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
              visible: true,
              fillStyle: fruit.color,
              strokeStyle: fruit.borderColor,
              lineWidth: 4
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
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#2c3e50',
      padding: '20px'
    }}>
      <div style={{ 
        position: 'relative',
        backgroundColor: '#34495e',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        maxWidth: '620px',
        width: '100%',
        marginTop: '50px'
      }}>
        <div ref={containerRef} style={{ position: 'relative' }}>
          <canvas ref={canvasRef} style={{ position: 'absolute' }}/>

          {fruits.map(fruit => (
            <div
              key={fruit.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: FRUITS[fruit.size].radius * 2,
                height: FRUITS[fruit.size].radius * 2,
                backgroundColor: FRUITS[fruit.size].color,
                border: `4px solid ${FRUITS[fruit.size].borderColor}`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${FRUITS[fruit.size].radius}px`,
                transform: `translate(${fruit.x - FRUITS[fruit.size].radius}px, ${fruit.y - FRUITS[fruit.size].radius}px) rotate(${fruit.angle}rad)`
              }}
            >
              {FRUITS[fruit.size].label}
            </div>
          ))}

          {canDrop && !gameOver && (
            <div style={{
              position: 'absolute',
              top: `${DROP_HEIGHT - FRUITS[nextFruit].radius}px`,
              left: `${position - FRUITS[nextFruit].radius}px`,
              width: `${FRUITS[nextFruit].radius * 2}px`,
              height: `${FRUITS[nextFruit].radius * 2}px`,
              backgroundColor: FRUITS[nextFruit].color,
              border: `4px solid ${FRUITS[nextFruit].borderColor}`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${FRUITS[nextFruit].radius}px`,
              zIndex: 2
            }}>
              {FRUITS[nextFruit].label}
            </div>
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
              borderRadius: '15px',
              zIndex: 3
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
