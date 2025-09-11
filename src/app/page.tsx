/**
 * Chess Game Main Page
 * Complete chess game with interactive board and controls
 */

'use client';

import React, { useState } from 'react';
import { ChessBoard } from '@/components/chess/ChessBoard';
import { GameControls } from '@/components/chess/GameControls';
import { GameStatusComponent } from '@/components/chess/GameStatus';
import { MoveHistory } from '@/components/chess/MoveHistory';
import { useChessGame } from '@/hooks/useChessGame';
import { Card, CardContent } from '@/components/ui/card';

export default function ChessGamePage() {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const {
    // Game state
    gameState,
    board,
    currentPlayer,
    gameStatus,
    moveHistory,
    lastMove,
    
    // Game actions
    makeMove,
    resetGame,
    
    // Game queries
    isKingInCheck,
    
    // UI state
    selectedSquare,
    highlightedSquares,
    
    // Move helpers
    handleSquareClick
  } = useChessGame();

  // Handle piece move (drag and drop)
  const handlePieceMove = (from: any, to: any) => {
    return makeMove(from, to);
  };

  // Handle board flip
  const handleFlipBoard = () => {
    setIsFlipped(!isFlipped);
  };

  // Get last move positions for highlighting
  const lastMovePositions = lastMove ? [lastMove.from, lastMove.to] : [];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-800 mb-2">
            Chess Master
          </h1>
          <p className="text-lg text-amber-700">
            Play chess with complete rule validation and beautiful interface
          </p>
        </div>

        {/* Main Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Game Status (Hidden on mobile) */}
          <div className="hidden lg:block">
            <GameStatusComponent
              gameStatus={gameStatus}
              currentPlayer={currentPlayer}
              moveNumber={gameState.fullMoveNumber}
              halfMoveClock={gameState.halfMoveClock}
              isKingInCheck={{
                white: isKingInCheck('white'),
                black: isKingInCheck('black')
              }}
            />
          </div>

          {/* Center - Chess Board */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-6">
            {/* Mobile Game Status */}
            <div className="lg:hidden w-full max-w-md">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-2">
                      {gameStatus === 'active' && `${currentPlayer === 'white' ? 'White' : 'Black'} to move`}
                      {gameStatus === 'check' && `${currentPlayer === 'white' ? 'White' : 'Black'} is in check!`}
                      {gameStatus === 'checkmate' && `Checkmate! ${currentPlayer === 'white' ? 'Black' : 'White'} wins!`}
                      {gameStatus === 'stalemate' && 'Stalemate - Draw!'}
                      {gameStatus === 'draw' && 'Draw!'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Move {gameState.fullMoveNumber}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chess Board */}
            <div className="flex justify-center">
              <ChessBoard
                board={board}
                selectedSquare={selectedSquare}
                highlightedSquares={highlightedSquares}
                lastMove={lastMovePositions}
                onSquareClick={handleSquareClick}
                onPieceMove={handlePieceMove}
                flipped={isFlipped}
                isInteractive={gameStatus === 'active' || gameStatus === 'check'}
              />
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden w-full max-w-md">
              <GameControls
                gameStatus={gameStatus}
                currentPlayer={currentPlayer}
                onNewGame={resetGame}
                onResetGame={resetGame}
                moveCount={moveHistory.length}
                onFlipBoard={handleFlipBoard}
                isFlipped={isFlipped}
              />
            </div>
          </div>

          {/* Right Sidebar - Controls and Move History */}
          <div className="space-y-6">
            {/* Desktop Controls */}
            <div className="hidden lg:block">
              <GameControls
                gameStatus={gameStatus}
                currentPlayer={currentPlayer}
                onNewGame={resetGame}
                onResetGame={resetGame}
                moveCount={moveHistory.length}
                onFlipBoard={handleFlipBoard}
                isFlipped={isFlipped}
              />
            </div>

            {/* Move History */}
            <MoveHistory
              moveHistory={moveHistory}
              gameStatus={gameStatus}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-amber-200">
          <p className="text-amber-600 text-sm">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
          <p className="text-amber-500 text-xs mt-1">
            Complete chess engine with full rule validation
          </p>
        </div>
      </div>
    </div>
  );
}