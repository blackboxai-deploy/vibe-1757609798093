/**
 * Chess Board Component
 * Interactive chess board with drag-and-drop and click functionality
 */

'use client';

import React from 'react';
import { BoardPosition, ChessPiece } from '@/lib/chess/types';
import { ChessPieceComponent } from './ChessPiece';
import { Square } from './Square';

interface ChessBoardProps {
  board: (ChessPiece | null)[][];
  selectedSquare: BoardPosition | null;
  highlightedSquares: BoardPosition[];
  lastMove?: BoardPosition[];
  onSquareClick: (position: BoardPosition) => void;
  onPieceMove: (from: BoardPosition, to: BoardPosition) => boolean;
  isInteractive?: boolean;
  flipped?: boolean;
}

export function ChessBoard({
  board,
  selectedSquare,
  highlightedSquares,
  lastMove = [],
  onSquareClick,
  onPieceMove,
  isInteractive = true,
  flipped = false
}: ChessBoardProps) {
  // Handle piece drop
  const handleDrop = (from: BoardPosition, to: BoardPosition) => {
    if (!isInteractive) return false;
    return onPieceMove(from, to);
  };

  // Render a single square with its piece
  const renderSquare = (row: number, col: number) => {
    const position: BoardPosition = { row, col };
    const piece = board[row][col];
    
    // Determine square appearance
    const isLight = (row + col) % 2 === 0;
    const isSelected = selectedSquare !== null && 
      selectedSquare.row === row && selectedSquare.col === col;
    const isHighlighted = highlightedSquares.some(pos => 
      pos.row === row && pos.col === col);
    const isLastMove = lastMove.some(pos => 
      pos.row === row && pos.col === col);

    return (
      <Square
        key={`${row}-${col}`}
        position={position}
        isLight={isLight}
        isSelected={isSelected}
        isHighlighted={isHighlighted}
        isLastMove={isLastMove}
        onClick={() => isInteractive && onSquareClick(position)}
        onDrop={(from) => handleDrop(from, position)}
      >
        {piece && (
          <ChessPieceComponent
            piece={piece}
            position={position}
            isDraggable={isInteractive}
            onDragStart={() => isInteractive && onSquareClick(position)}
          />
        )}
      </Square>
    );
  };

  // Create board layout
  const renderBoard = () => {
    const squares = [];
    
    for (let row = 0; row < 8; row++) {
      const boardRow = [];
      for (let col = 0; col < 8; col++) {
        const displayRow = flipped ? 7 - row : row;
        const displayCol = flipped ? 7 - col : col;
        boardRow.push(renderSquare(displayRow, displayCol));
      }
      squares.push(
        <div key={row} className="flex">
          {boardRow}
        </div>
      );
    }
    
    return squares;
  };

  // Render rank labels (1-8)
  const renderRankLabels = () => {
    const ranks = flipped ? ['1', '2', '3', '4', '5', '6', '7', '8'] : ['8', '7', '6', '5', '4', '3', '2', '1'];
    return (
      <div className="flex flex-col justify-between h-full py-1">
        {ranks.map((rank) => (
          <div 
            key={rank}
            className="flex items-center justify-center h-12 w-6 text-sm font-medium text-muted-foreground"
          >
            {rank}
          </div>
        ))}
      </div>
    );
  };

  // Render file labels (a-h)
  const renderFileLabels = () => {
    const files = flipped ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return (
      <div className="flex justify-between w-full px-1">
        {files.map((file) => (
          <div 
            key={file}
            className="flex items-center justify-center w-12 h-6 text-sm font-medium text-muted-foreground"
          >
            {file}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="inline-flex flex-col items-center space-y-2">
      {/* Chess board with rank labels */}
      <div className="flex items-center space-x-2">
        {/* Rank labels */}
        {renderRankLabels()}
        
        {/* Main chess board */}
        <div className="relative bg-amber-100 border-4 border-amber-800 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 gap-0">
            {renderBoard()}
          </div>
          
          {/* Board coordinate overlay (optional) */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Any additional overlays can go here */}
          </div>
        </div>
      </div>
      
      {/* File labels */}
      <div className="ml-8">
        {renderFileLabels()}
      </div>
    </div>
  );
}