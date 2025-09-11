/**
 * Chess Square Component
 * Individual chess board square with drag-and-drop support
 */

'use client';

import React from 'react';
import { BoardPosition } from '@/lib/chess/types';

interface SquareProps {
  position: BoardPosition;
  isLight: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
  isLastMove?: boolean;
  isInCheck?: boolean;
  onClick?: () => void;
  onDrop?: (from: BoardPosition) => void;
  children?: React.ReactNode;
}

export function Square({
  position,
  isLight,
  isSelected = false,
  isHighlighted = false,
  isLastMove = false,
  isInCheck = false,
  onClick,
  onDrop,
  children
}: SquareProps) {
  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    try {
      const dragData = e.dataTransfer.getData('text/plain');
      const { from } = JSON.parse(dragData);
      
      if (onDrop && from) {
        onDrop(from);
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  // Handle click
  const handleClick = () => {
    onClick?.();
  };

  // Determine square styling
  const getSquareClasses = () => {
    let baseClasses = 'relative w-12 h-12 flex items-center justify-center transition-all duration-200 cursor-pointer';
    
    // Base color
    if (isLight) {
      baseClasses += ' bg-amber-100 hover:bg-amber-200';
    } else {
      baseClasses += ' bg-amber-700 hover:bg-amber-600';
    }
    
    // Selection highlighting
    if (isSelected) {
      baseClasses += ' ring-4 ring-blue-400 ring-inset';
    }
    
    // Move highlighting (possible move destinations)
    if (isHighlighted) {
      baseClasses += ' ring-2 ring-green-400 ring-inset';
    }
    
    // Last move highlighting
    if (isLastMove) {
      baseClasses += ' ring-2 ring-yellow-400 ring-inset';
    }
    
    // Check highlighting
    if (isInCheck) {
      baseClasses += ' ring-4 ring-red-500 ring-inset animate-pulse';
    }
    
    return baseClasses;
  };

  return (
    <div
      className={getSquareClasses()}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-position={`${position.row}-${position.col}`}
    >
      {children}
      
      {/* Move hint dot for highlighted squares */}
      {isHighlighted && !children && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-green-400 rounded-full opacity-70" />
        </div>
      )}
      
      {/* Capture hint ring for highlighted squares with pieces */}
      {isHighlighted && children && (
        <div className="absolute inset-0 rounded-full border-4 border-green-400 opacity-70" />
      )}
    </div>
  );
}