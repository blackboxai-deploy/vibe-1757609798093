/**
 * Chess Move Validator
 * Validates individual piece movement rules and generates possible moves
 */

import {
  ChessPiece,
  BoardPosition,
  PieceColor,
  ValidMove
} from './types';
import {
  isValidPosition,
  getPieceAt,
  isSquareEmpty,
  isEnemyPiece
} from './board-utils';

/**
 * Generate all possible moves for a piece at a given position
 */
export function getPossibleMoves(
  board: (ChessPiece | null)[][],
  position: BoardPosition,
  piece: ChessPiece
): ValidMove[] {
  switch (piece.type) {
    case 'pawn':
      return getPawnMoves(board, position, piece);
    case 'rook':
      return getRookMoves(board, position, piece);
    case 'knight':
      return getKnightMoves(board, position, piece);
    case 'bishop':
      return getBishopMoves(board, position, piece);
    case 'queen':
      return getQueenMoves(board, position, piece);
    case 'king':
      return getKingMoves(board, position, piece);
    default:
      return [];
  }
}

/**
 * Validate if a move is legal for a specific piece
 */
export function isValidMove(
  board: (ChessPiece | null)[][],
  from: BoardPosition,
  to: BoardPosition,
  piece: ChessPiece
): boolean {
  const possibleMoves = getPossibleMoves(board, from, piece);
  return possibleMoves.some(move => move.to.row === to.row && move.to.col === to.col);
}

/**
 * Generate pawn moves (most complex due to special rules)
 */
function getPawnMoves(
  board: (ChessPiece | null)[][],
  position: BoardPosition,
  piece: ChessPiece
): ValidMove[] {
  const moves: ValidMove[] = [];
  const { row, col } = position;
  const isWhite = piece.color === 'white';
  const direction = isWhite ? -1 : 1; // White moves up (negative), black moves down (positive)
  const startingRow = isWhite ? 6 : 1;

  // Forward move (one square)
  const oneSquareForward = { row: row + direction, col };
  if (isValidPosition(oneSquareForward) && isSquareEmpty(board, oneSquareForward)) {
    moves.push({
      to: oneSquareForward,
      moveType: 'normal'
    });

    // Forward move (two squares) - only from starting position
    if (row === startingRow) {
      const twoSquaresForward = { row: row + (2 * direction), col };
      if (isValidPosition(twoSquaresForward) && isSquareEmpty(board, twoSquaresForward)) {
        moves.push({
          to: twoSquaresForward,
          moveType: 'normal'
        });
      }
    }
  }

  // Diagonal captures
  const capturePositions = [
    { row: row + direction, col: col - 1 },
    { row: row + direction, col: col + 1 }
  ];

  capturePositions.forEach(capturePos => {
    if (isValidPosition(capturePos) && isEnemyPiece(board, capturePos, piece.color)) {
      moves.push({
        to: capturePos,
        moveType: 'capture',
        capturedPiece: getPieceAt(board, capturePos)!
      });
    }
  });

  return moves;
}

/**
 * Generate rook moves (horizontal and vertical lines)
 */
function getRookMoves(
  board: (ChessPiece | null)[][],
  position: BoardPosition,
  piece: ChessPiece
): ValidMove[] {
  const directions = [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 },  // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 }   // Right
  ];

  return getLinearMoves(board, position, piece, directions);
}

/**
 * Generate bishop moves (diagonal lines)
 */
function getBishopMoves(
  board: (ChessPiece | null)[][],
  position: BoardPosition,
  piece: ChessPiece
): ValidMove[] {
  const directions = [
    { row: -1, col: -1 }, // Up-left
    { row: -1, col: 1 },  // Up-right
    { row: 1, col: -1 },  // Down-left
    { row: 1, col: 1 }    // Down-right
  ];

  return getLinearMoves(board, position, piece, directions);
}

/**
 * Generate queen moves (combination of rook and bishop)
 */
function getQueenMoves(
  board: (ChessPiece | null)[][],
  position: BoardPosition,
  piece: ChessPiece
): ValidMove[] {
  const directions = [
    { row: -1, col: 0 }, { row: 1, col: 0 },   // Vertical
    { row: 0, col: -1 }, { row: 0, col: 1 },   // Horizontal
    { row: -1, col: -1 }, { row: -1, col: 1 }, // Diagonal up
    { row: 1, col: -1 }, { row: 1, col: 1 }    // Diagonal down
  ];

  return getLinearMoves(board, position, piece, directions);
}

/**
 * Generate knight moves (L-shaped moves)
 */
function getKnightMoves(
  board: (ChessPiece | null)[][],
  position: BoardPosition,
  piece: ChessPiece
): ValidMove[] {
  const moves: ValidMove[] = [];
  const { row, col } = position;
  
  const knightMoves = [
    { row: row - 2, col: col - 1 }, { row: row - 2, col: col + 1 },
    { row: row - 1, col: col - 2 }, { row: row - 1, col: col + 2 },
    { row: row + 1, col: col - 2 }, { row: row + 1, col: col + 2 },
    { row: row + 2, col: col - 1 }, { row: row + 2, col: col + 1 }
  ];

  knightMoves.forEach(movePos => {
    if (isValidPosition(movePos)) {
      if (isSquareEmpty(board, movePos)) {
        moves.push({
          to: movePos,
          moveType: 'normal'
        });
      } else if (isEnemyPiece(board, movePos, piece.color)) {
        moves.push({
          to: movePos,
          moveType: 'capture',
          capturedPiece: getPieceAt(board, movePos)!
        });
      }
    }
  });

  return moves;
}

/**
 * Generate king moves (one square in any direction)
 */
function getKingMoves(
  board: (ChessPiece | null)[][],
  position: BoardPosition,
  piece: ChessPiece
): ValidMove[] {
  const moves: ValidMove[] = [];
  const { row, col } = position;

  // King can move one square in any direction
  const kingMoves = [
    { row: row - 1, col: col - 1 }, { row: row - 1, col: col }, { row: row - 1, col: col + 1 },
    { row: row, col: col - 1 },                                    { row: row, col: col + 1 },
    { row: row + 1, col: col - 1 }, { row: row + 1, col: col }, { row: row + 1, col: col + 1 }
  ];

  kingMoves.forEach(movePos => {
    if (isValidPosition(movePos)) {
      if (isSquareEmpty(board, movePos)) {
        moves.push({
          to: movePos,
          moveType: 'normal'
        });
      } else if (isEnemyPiece(board, movePos, piece.color)) {
        moves.push({
          to: movePos,
          moveType: 'capture',
          capturedPiece: getPieceAt(board, movePos)!
        });
      }
    }
  });

  return moves;
}

/**
 * Helper function for generating linear moves (rook, bishop, queen)
 */
function getLinearMoves(
  board: (ChessPiece | null)[][],
  position: BoardPosition,
  piece: ChessPiece,
  directions: Array<{ row: number; col: number }>
): ValidMove[] {
  const moves: ValidMove[] = [];
  const { row, col } = position;

  directions.forEach(direction => {
    let currentRow = row + direction.row;
    let currentCol = col + direction.col;

    while (isValidPosition({ row: currentRow, col: currentCol })) {
      const currentPos = { row: currentRow, col: currentCol };

      if (isSquareEmpty(board, currentPos)) {
        // Empty square - can move here
        moves.push({
          to: currentPos,
          moveType: 'normal'
        });
      } else if (isEnemyPiece(board, currentPos, piece.color)) {
        // Enemy piece - can capture
        moves.push({
          to: currentPos,
          moveType: 'capture',
          capturedPiece: getPieceAt(board, currentPos)!
        });
        break; // Can't move further in this direction
      } else {
        // Friendly piece - can't move here or further
        break;
      }

      currentRow += direction.row;
      currentCol += direction.col;
    }
  });

  return moves;
}

/**
 * Check if a specific square is attacked by the opponent
 */
export function isSquareAttacked(
  board: (ChessPiece | null)[][],
  position: BoardPosition,
  byColor: PieceColor
): boolean {
  // Check all opponent pieces to see if they can attack this position
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === byColor) {
        const piecePosition = { row, col };
        const possibleMoves = getPossibleMoves(board, piecePosition, piece);
        
        if (possibleMoves.some(move => 
          move.to.row === position.row && move.to.col === position.col
        )) {
          return true;
        }
      }
    }
  }
  
  return false;
}

/**
 * Get all squares attacked by a specific color
 */
export function getAttackedSquares(
  board: (ChessPiece | null)[][],
  byColor: PieceColor
): BoardPosition[] {
  const attackedSquares: BoardPosition[] = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === byColor) {
        const piecePosition = { row, col };
        const possibleMoves = getPossibleMoves(board, piecePosition, piece);
        
        possibleMoves.forEach(move => {
          if (!attackedSquares.some(pos => 
            pos.row === move.to.row && pos.col === move.to.col
          )) {
            attackedSquares.push(move.to);
          }
        });
      }
    }
  }
  
  return attackedSquares;
}