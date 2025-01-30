import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css"; 

const GRID_ROWS = 15;
const GRID_COLS = 20;

const generateGrid = (rows, cols) => {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      id: `${row}-${col}`,
      intensity: 0, 
    }))
  );
};

const WaveGrid = () => {
  const [grid, setGrid] = useState(generateGrid(GRID_ROWS, GRID_COLS));
  const [wavePhase, setWavePhase] = useState(0);
  const [direction, setDirection] = useState(1); 
  const [waveColor, setWaveColor] = useState("green"); 

  useEffect(() => {
    const interval = setInterval(() => {
      setWavePhase((prev) => {
        let newPhase = prev + direction;
        
       
        if (newPhase >= GRID_COLS) {
          setDirection(-1);
          setWaveColor(waveColor === "green" ? "blue" : "pink");
          return GRID_COLS - 1;
        }
       
        if (newPhase < 0) {
          setDirection(1);
          setWaveColor(waveColor === "blue" ? "pink" : "green");
          return 0;
        }

        return newPhase;
      });

      setGrid((prevGrid) =>
        prevGrid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const distance = Math.abs(colIndex - wavePhase);
            return {
              ...cell,
              intensity: Math.max(0, 1 - distance / 5), 
            };
          })
        )
      );
    }, 200);

    return () => clearInterval(interval);
  }, [wavePhase, direction, waveColor]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <h1 className="text-white text-3xl font-bold mb-4">Bouncing Wave Grid</h1>
      <div className="grid" style={{ display: "grid", gridTemplateColumns: `repeat(${GRID_COLS}, 20px)` }}>
        {grid.flat().map((cell) => (
          <motion.div
            key={cell.id}
            className="w-5 h-5 border border-gray-800"
            style={{
              backgroundColor:
                waveColor === "green"
                  ? `rgb(0, ${cell.intensity * 255}, 0)` // Green
                  : waveColor === "blue"
                  ? `rgb(0, 0, ${cell.intensity * 255})` // Blue
                  : `rgb(${cell.intensity * 255}, 0, ${cell.intensity * 255})`, // Pink
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
};

export default WaveGrid;
