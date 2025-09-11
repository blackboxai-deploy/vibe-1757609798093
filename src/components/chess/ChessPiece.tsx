/**
 * Chess Piece Component
 * Individual chess piece with drag-and-drop functionality
 */

'use client';

import React from 'react';
import { ChessPiece, BoardPosition, PIECE_SYMBOLS } from '@/lib/chess/types';

interface ChessPieceProps {
  piece: ChessPiece;
  position: BoardPosition;
  isDraggable?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function ChessPieceComponent({
  piece,
  position,
  isDraggable = true,
  onDragStart,
  onDragEnd
}: ChessPieceProps) {
  const symbol = PIECE_SYMBOLS[piece.color][piece.type];
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isDraggable) {
      e.preventDefault();
      return;
    }
    
    // Store the piece position in the drag data
    e.dataTransfer.setData('text/plain', JSON.stringify({
      from: position,
      piece: piece
    }));
    e.dataTransfer.effectAllowed = 'move';
    
    // Make the drag image slightly transparent
    if (e.currentTarget) {
      setTimeout(() => {
        e.currentTarget.style.opacity = '0.5';
      }, 0);
    }
    
    onDragStart?.();
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // Reset opacity
    if (e.currentTarget) {
      e.currentTarget.style.opacity = '1';
    }
    
    onDragEnd?.();
  };

  // Piece styling based on color
  const pieceColorClass = piece.color === 'white' 
    ? 'text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)]' 
    : 'text-black drop-shadow-[1px_1px_1px_rgba(255,255,255,0.3)]';

  return (
    <div
      className={`
        flex items-center justify-center w-full h-full cursor-pointer select-none
        text-4xl font-bold transition-transform duration-150
        ${pieceColorClass}
        ${isDraggable ? 'hover:scale-110 active:scale-95' : ''}
      `}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      title={`${piece.color} ${piece.type}`}
    >
      {symbol}
    </div>
  );
}