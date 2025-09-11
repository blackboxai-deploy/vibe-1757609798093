/**
 * Game History Hook
 * React hook for managing move history, notation, and game replay
 */

'use client';

import { useMemo } from 'react';
import { Move, PieceType, PieceColor } from '@/lib/chess/types';
import { positionToNotation } from '@/lib/chess/board-utils';

interface MoveNotation {
  move: Move;
  notation: string;
  moveNumber: number;
  isWhiteMove: boolean;
}

interface UseGameHistoryReturn {
  moveNotations: MoveNotation[];
  formattedHistory: string[];
  getLastMove: () => Move | undefined;
  getMoveCount: () => number;
  getCurrentMoveNumber: () => number;
}

export function useGameHistory(moveHistory: Move[]): UseGameHistoryReturn {
  // Convert moves to algebraic notation
  const moveNotations = useMemo<MoveNotation[]>(() => {
    return moveHistory.map((move, index) => {
      const isWhiteMove = move.piece.color === 'white';
      const moveNumber = isWhiteMove ? Math.floor(index / 2) + 1 : Math.floor(index / 2) + 1;
      
      return {
        move,
        notation: generateAlgebraicNotation(move),
        moveNumber,
        isWhiteMove
      };
    });
  }, [moveHistory]);

  // Format history for display
  const formattedHistory = useMemo(() => {
    const formatted: string[] = [];
    
    for (let i = 0; i < moveNotations.length; i += 2) {
      const whiteMove = moveNotations[i];
      const blackMove = moveNotations[i + 1];
      
      const moveNumber = whiteMove.moveNumber;
      let moveText = `${moveNumber}. ${whiteMove.notation}`;
      
      if (blackMove) {
        moveText += ` ${blackMove.notation}`;
      }
      
      formatted.push(moveText);
    }
    
    return formatted;
  }, [moveNotations]);

  const getLastMove = () => {
    return moveHistory.length > 0 ? moveHistory[moveHistory.length - 1] : undefined;
  };

  const getMoveCount = () => {
    return moveHistory.length;
  };

  const getCurrentMoveNumber = () => {
    return Math.floor(moveHistory.length / 2) + 1;
  };

  return {
    moveNotations,
    formattedHistory,
    getLastMove,
    getMoveCount,
    getCurrentMoveNumber
  };
}

/**
 * Generate algebraic notation for a move
 */
function generateAlgebraicNotation(move: Move): string {
  const { piece, from, to, capturedPiece, moveType } = move;
  
  let notation = '';
  
  // Special moves
  if (moveType === 'castling-kingside') {
    return 'O-O';
  }
  
  if (moveType === 'castling-queenside') {
    return 'O-O-O';
  }
  
  // Piece notation (empty for pawn)
  const pieceNotation = getPieceNotation(piece.type);
  notation += pieceNotation;
  
  // For pawn captures, include the file
  if (piece.type === 'pawn' && capturedPiece) {
    notation += positionToNotation(from)[0]; // File letter
  }
  
  // Capture notation
  if (capturedPiece) {
    notation += 'x';
  }
  
  // Destination square
  notation += positionToNotation(to);
  
  // Pawn promotion (placeholder - would need to be implemented)
  if (moveType === 'pawn-promotion') {
    notation += '=Q'; // Assume promotion to queen for now
  }
  
  // En passant
  if (moveType === 'en-passant') {
    notation += ' e.p.';
  }
  
  return notation;
}

/**
 * Get piece notation for algebraic notation
 */
function getPieceNotation(pieceType: PieceType): string {
  switch (pieceType) {
    case 'king': return 'K';
    case 'queen': return 'Q';
    case 'rook': return 'R';
    case 'bishop': return 'B';
    case 'knight': return 'N';
    case 'pawn': return ''; // Pawns have no notation
    default: return '';
  }
}

/**
 * Format game result for display
 */
export function formatGameResult(
  gameStatus: string,
  winner?: PieceColor
): string {
  switch (gameStatus) {
    case 'checkmate':
      return winner === 'white' ? '1-0' : '0-1';
    case 'stalemate':
    case 'draw':
      return '½-½';
    case 'resigned':
      return winner === 'white' ? '1-0' : '0-1';
    default:
      return '*'; // Game in progress
  }
}

/**
 * Format move for display with move number
 */
export function formatMoveWithNumber(
  move: Move,
  moveNumber: number,
  isWhiteMove: boolean
): string {
  const notation = generateAlgebraicNotation(move);
  
  if (isWhiteMove) {
    return `${moveNumber}. ${notation}`;
  } else {
    return notation;
  }
}