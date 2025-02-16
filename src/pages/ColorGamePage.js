import { useState } from "react";
import "../App.css";

const colors = ["red", "orange", "yellow", "green", "blue"];
const shuffledColors = [...colors].sort(() => Math.random() - 0.5);

function ColorGamePage() {
  const [userChoices, setUserChoices] = useState(Array(5).fill(null));
  const [correctCount, setCorrectCount] = useState(null);

  const handleDragStart = (color) => (event) => {
    event.dataTransfer.setData("color", color);
  };

  const handleDrop = (index) => (event) => {
    const draggedColor = event.dataTransfer.getData("color");
    const newChoices = [...userChoices];
    newChoices[index] = draggedColor;
    setUserChoices(newChoices);
  };

  const handleCheckAnswer = () => {
    let count = 0;
    userChoices.forEach((choice, index) => {
      if (choice === colors[index]) count++;
    });
    setCorrectCount(count);
  };

  return (
    <div className="color-game centered">
      <h2>색상 맞추기 게임</h2>
      <div className="hidden-colors">
        {shuffledColors.map((color, index) => (
          <div
            key={index}
            className="color-box"
            style={{ backgroundColor: color, width: "80px", height: "80px" }}
            draggable
            onDragStart={handleDragStart(color)}
          />
        ))}
      </div>
      <div className="drop-zones">
        {colors.map((_, index) => (
          <div
            key={index}
            className="drop-box"
            style={{ width: "80px", height: "80px" }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop(index)}
          >
            {userChoices[index] ? (
              <div className="color-box" style={{ backgroundColor: userChoices[index], width: "80px", height: "80px" }}></div>
            ) : (
              <span className="question-mark">❓</span>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleCheckAnswer}>정답 확인</button>
      {correctCount !== null && <p>맞춘 개수: {correctCount} / 5</p>}
    </div>
  );
}

export default ColorGamePage;
