/**
 * Game Controls Component
 * Chess game control buttons and options
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GameStatus, PieceColor } from '@/lib/chess/types';

interface GameControlsProps {
  gameStatus: GameStatus;
  currentPlayer: PieceColor;
  onNewGame: () => void;
  onResetGame: () => void;
  moveCount: number;
  onFlipBoard?: () => void;
  isFlipped?: boolean;
}

export function GameControls({
  gameStatus,
  currentPlayer,
  onNewGame,
  onResetGame,
  moveCount,
  onFlipBoard,
  isFlipped = false
}: GameControlsProps) {
  // Get status display text
  const getStatusText = () => {
    switch (gameStatus) {
      case 'active':
        return `${currentPlayer === 'white' ? 'White' : 'Black'} to move`;
      case 'check':
        return `${currentPlayer === 'white' ? 'White' : 'Black'} is in check!`;
      case 'checkmate':
        const winner = currentPlayer === 'white' ? 'Black' : 'White';
        return `Checkmate! ${winner} wins!`;
      case 'stalemate':
        return 'Stalemate - Draw!';
      case 'draw':
        return 'Draw!';
      case 'resigned':
        const resignWinner = currentPlayer === 'white' ? 'Black' : 'White';
        return `${resignWinner} wins by resignation!`;
      default:
        return 'Game ready';
    }
  };

  // Get status color
  const getStatusColor = () => {
    switch (gameStatus) {
      case 'check':
        return 'text-red-600 font-bold';
      case 'checkmate':
      case 'resigned':
        return 'text-red-600 font-bold';
      case 'stalemate':
      case 'draw':
        return 'text-yellow-600 font-bold';
      case 'active':
        return currentPlayer === 'white' ? 'text-gray-700' : 'text-gray-800';
      default:
        return 'text-gray-600';
    }
  };

  const isGameActive = gameStatus === 'active' || gameStatus === 'check';

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        {/* Game Status */}
        <div className="text-center">
          <div className={`text-lg font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Move {Math.floor(moveCount / 2) + 1} 
            {moveCount > 0 && ` • ${moveCount} half-moves`}
          </div>
        </div>

        {/* Current Player Indicator */}
        {isGameActive && (
          <div className="flex items-center justify-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full ${
                currentPlayer === 'white' 
                  ? 'bg-white border-2 border-gray-400' 
                  : 'bg-gray-800'
              }`} />
              <span className="text-sm font-medium">
                {currentPlayer === 'white' ? 'White' : 'Black'}
              </span>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex flex-col space-y-2">
          <Button
            onClick={onNewGame}
            variant="default"
            className="w-full"
          >
            New Game
          </Button>
          
          <Button
            onClick={onResetGame}
            variant="outline"
            className="w-full"
            disabled={moveCount === 0}
          >
            Reset Position
          </Button>
          
          {onFlipBoard && (
            <Button
              onClick={onFlipBoard}
              variant="outline"
              className="w-full"
            >
              Flip Board {isFlipped ? '(Black View)' : '(White View)'}
            </Button>
          )}
        </div>

        {/* Game Over Actions */}
        {!isGameActive && gameStatus !== 'draw' && gameStatus !== 'stalemate' && (
          <div className="pt-4 border-t">
            <div className="text-center text-sm text-muted-foreground mb-3">
              Game Over
            </div>
            <Button
              onClick={onNewGame}
              variant="default"
              className="w-full"
            >
              Play Again
            </Button>
          </div>
        )}

        {/* Draw Actions */}
        {(gameStatus === 'draw' || gameStatus === 'stalemate') && (
          <div className="pt-4 border-t">
            <div className="text-center text-sm text-muted-foreground mb-3">
              Game Drawn
            </div>
            <Button
              onClick={onNewGame}
              variant="default"
              className="w-full"
            >
              New Game
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}