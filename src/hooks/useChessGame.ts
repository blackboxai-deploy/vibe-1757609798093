/**
 * Chess Game Hook
 * React hook for managing chess game state and interactions
 */

'use client';

import { useState, useCallback } from 'react';
import { ChessGame } from '@/lib/chess/game-logic';
import {
  BoardPosition,
  ChessPiece,
  GameState,
  GameStatus,
  Move,
  ValidMove,
  PieceColor
} from '@/lib/chess/types';

interface UseChessGameReturn {
  // Game state
  gameState: GameState;
  board: (ChessPiece | null)[][];
  currentPlayer: PieceColor;
  gameStatus: GameStatus;
  moveHistory: Move[];
  lastMove: Move | undefined;
  
  // Game actions
  makeMove: (from: BoardPosition, to: BoardPosition) => boolean;
  resetGame: () => void;
  
  // Game queries
  getPieceAt: (position: BoardPosition) => ChessPiece | null;
  getLegalMoves: (position: BoardPosition) => ValidMove[];
  isValidMoveDestination: (from: BoardPosition, to: BoardPosition) => boolean;
  isKingInCheck: (color: PieceColor) => boolean;
  isPlayerTurn: (color: PieceColor) => boolean;
  
  // UI state
  selectedSquare: BoardPosition | null;
  highlightedSquares: BoardPosition[];
  setSelectedSquare: (position: BoardPosition | null) => void;
  
  // Move helpers
  handleSquareClick: (position: BoardPosition) => void;
}

export function useChessGame(): UseChessGameReturn {
  // Initialize chess game engine
  const [chessGame] = useState(() => new ChessGame());
  
  // Force re-render when game state changes
  const [, setUpdateTrigger] = useState(0);
  const forceUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);
  
  // UI state for piece selection and highlighting
  const [selectedSquare, setSelectedSquare] = useState<BoardPosition | null>(null);
  const [highlightedSquares, setHighlightedSquares] = useState<BoardPosition[]>([]);
  
  // Get current game state
  const gameState = chessGame.getGameState();
  
  // Game actions
  const makeMove = useCallback((from: BoardPosition, to: BoardPosition): boolean => {
    const success = chessGame.makeMove(from, to);
    if (success) {
      setSelectedSquare(null);
      setHighlightedSquares([]);
      forceUpdate();
    }
    return success;
  }, [chessGame, forceUpdate]);
  
  const resetGame = useCallback(() => {
    chessGame.resetGame();
    setSelectedSquare(null);
    setHighlightedSquares([]);
    forceUpdate();
  }, [chessGame, forceUpdate]);
  
  // Game queries
  const getPieceAt = useCallback((position: BoardPosition) => {
    return chessGame.getPieceAt(position);
  }, [chessGame]);
  
  const getLegalMoves = useCallback((position: BoardPosition) => {
    return chessGame.getLegalMoves(position);
  }, [chessGame]);
  
  const isValidMoveDestination = useCallback((from: BoardPosition, to: BoardPosition) => {
    return chessGame.isValidMoveDestination(from, to);
  }, [chessGame]);
  
  const isKingInCheck = useCallback((color: PieceColor) => {
    return chessGame.isKingInCheck(color);
  }, [chessGame]);
  
  const isPlayerTurn = useCallback((color: PieceColor) => {
    return chessGame.isPlayerTurn(color);
  }, [chessGame]);
  
  // Handle square click logic
  const handleSquareClick = useCallback((position: BoardPosition) => {
    const piece = getPieceAt(position);
    
    // If no square is selected
    if (!selectedSquare) {
      // Select square if it has a piece belonging to current player
      if (piece && isPlayerTurn(piece.color)) {
        setSelectedSquare(position);
        const legalMoves = getLegalMoves(position);
        setHighlightedSquares(legalMoves.map(move => move.to));
      }
      return;
    }
    
    // If clicking on the same square, deselect
    if (selectedSquare.row === position.row && selectedSquare.col === position.col) {
      setSelectedSquare(null);
      setHighlightedSquares([]);
      return;
    }
    
    // If clicking on another piece of the same color, switch selection
    const selectedPiece = getPieceAt(selectedSquare);
    if (piece && selectedPiece && piece.color === selectedPiece.color && isPlayerTurn(piece.color)) {
      setSelectedSquare(position);
      const legalMoves = getLegalMoves(position);
      setHighlightedSquares(legalMoves.map(move => move.to));
      return;
    }
    
    // Try to make a move
    const moveSuccess = makeMove(selectedSquare, position);
    if (!moveSuccess) {
      // If move failed and clicked on own piece, select it
      if (piece && isPlayerTurn(piece.color)) {
        setSelectedSquare(position);
        const legalMoves = getLegalMoves(position);
        setHighlightedSquares(legalMoves.map(move => move.to));
      } else {
        // Clear selection if invalid move
        setSelectedSquare(null);
        setHighlightedSquares([]);
      }
    }
  }, [selectedSquare, getPieceAt, isPlayerTurn, getLegalMoves, makeMove]);
  
  return {
    // Game state
    gameState,
    board: gameState.board,
    currentPlayer: gameState.currentPlayer,
    gameStatus: gameState.status,
    moveHistory: gameState.moveHistory,
    lastMove: gameState.lastMove,
    
    // Game actions
    makeMove,
    resetGame,
    
    // Game queries
    getPieceAt,
    getLegalMoves,
    isValidMoveDestination,
    isKingInCheck,
    isPlayerTurn,
    
    // UI state
    selectedSquare,
    highlightedSquares,
    setSelectedSquare,
    
    // Move helpers
    handleSquareClick
  };
}