/**
 * Chess Board Utilities
 * Helper functions for board manipulation, position validation, and piece management
 */

import { 
  ChessPiece, 
  BoardPosition, 
  PieceColor, 
  PieceType,
  GameState,
  INITIAL_SETUP,
  FILES,
  RANKS
} from './types';

/**
 * Check if a position is within the chess board bounds
 */
export function isValidPosition(pos: BoardPosition): boolean {
  return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
}

/**
 * Check if two positions are equal
 */
export function positionsEqual(pos1: BoardPosition, pos2: BoardPosition): boolean {
  return pos1.row === pos2.row && pos1.col === pos2.col;
}

/**
 * Convert board position to chess notation (e.g., {row: 7, col: 0} -> "a1")
 */
export function positionToNotation(pos: BoardPosition): string {
  return `${FILES[pos.col]}${RANKS[pos.row]}`;
}

/**
 * Convert chess notation to board position (e.g., "a1" -> {row: 7, col: 0})
 */
export function notationToPosition(notation: string): BoardPosition {
  const file = notation[0];
  const rank = notation[1];
  const col = FILES.indexOf(file);
  const row = RANKS.indexOf(rank);
  return { row, col };
}

/**
 * Create initial chess board setup
 */
export function createInitialBoard(): (ChessPiece | null)[][] {
  // Create empty 8x8 board
  const board: (ChessPiece | null)[][] = Array.from({ length: 8 }, () => 
    Array.from({ length: 8 }, () => null)
  );

  // Place pieces according to initial setup
  Object.entries(INITIAL_SETUP).forEach(([pieceType, positions]) => {
    const type = pieceType as PieceType;
    const piecePositions = positions as { white: BoardPosition[]; black: BoardPosition[] };
    
    // Place white pieces
    piecePositions.white.forEach((pos, index) => {
      board[pos.row][pos.col] = {
        type,
        color: 'white',
        hasMoved: false,
        id: `white-${type}-${index}`
      };
    });
    
    // Place black pieces
    piecePositions.black.forEach((pos, index) => {
      board[pos.row][pos.col] = {
        type,
        color: 'black',
        hasMoved: false,
        id: `black-${type}-${index}`
      };
    });
  });

  return board;
}

/**
 * Get piece at a specific position
 */
export function getPieceAt(board: (ChessPiece | null)[][], pos: BoardPosition): ChessPiece | null {
  if (!isValidPosition(pos)) return null;
  return board[pos.row][pos.col];
}

/**
 * Check if a square is empty
 */
export function isSquareEmpty(board: (ChessPiece | null)[][], pos: BoardPosition): boolean {
  return getPieceAt(board, pos) === null;
}

/**
 * Check if a square contains an enemy piece
 */
export function isEnemyPiece(board: (ChessPiece | null)[][], pos: BoardPosition, color: PieceColor): boolean {
  const piece = getPieceAt(board, pos);
  return piece !== null && piece.color !== color;
}

/**
 * Check if a square contains a friendly piece
 */
export function isFriendlyPiece(board: (ChessPiece | null)[][], pos: BoardPosition, color: PieceColor): boolean {
  const piece = getPieceAt(board, pos);
  return piece !== null && piece.color === color;
}

/**
 * Get all positions of a specific piece type and color
 */
export function getPiecePositions(board: (ChessPiece | null)[][], type: PieceType, color: PieceColor): BoardPosition[] {
  const positions: BoardPosition[] = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === type && piece.color === color) {
        positions.push({ row, col });
      }
    }
  }
  
  return positions;
}

/**
 * Find the king's position for a given color
 */
export function findKingPosition(board: (ChessPiece | null)[][], color: PieceColor): BoardPosition {
  const kingPositions = getPiecePositions(board, 'king', color);
  if (kingPositions.length === 0) {
    throw new Error(`King not found for color: ${color}`);
  }
  return kingPositions[0];
}

/**
 * Create a deep copy of the board
 */
export function cloneBoard(board: (ChessPiece | null)[][]): (ChessPiece | null)[][] {
  return board.map(row => row.map(piece => 
    piece ? { ...piece } : null
  ));
}

/**
 * Make a move on the board (returns new board, doesn't modify original)
 */
export function makeMove(
  board: (ChessPiece | null)[][],
  from: BoardPosition,
  to: BoardPosition
): (ChessPiece | null)[][] {
  const newBoard = cloneBoard(board);
  const piece = newBoard[from.row][from.col];
  
  if (piece) {
    // Move the piece
    newBoard[to.row][to.col] = { ...piece, hasMoved: true };
    newBoard[from.row][from.col] = null;
  }
  
  return newBoard;
}

/**
 * Get the opposite color
 */
export function getOppositeColor(color: PieceColor): PieceColor {
  return color === 'white' ? 'black' : 'white';
}

/**
 * Calculate distance between two positions
 */
export function getDistance(pos1: BoardPosition, pos2: BoardPosition): { rows: number; cols: number; max: number } {
  const rows = Math.abs(pos1.row - pos2.row);
  const cols = Math.abs(pos1.col - pos2.col);
  return {
    rows,
    cols,
    max: Math.max(rows, cols)
  };
}

/**
 * Check if path between two positions is clear (no pieces in between)
 */
export function isPathClear(board: (ChessPiece | null)[][], from: BoardPosition, to: BoardPosition): boolean {
  const rowDiff = to.row - from.row;
  const colDiff = to.col - from.col;
  
  // Determine direction
  const rowStep = rowDiff === 0 ? 0 : Math.sign(rowDiff);
  const colStep = colDiff === 0 ? 0 : Math.sign(colDiff);
  
  // Check each square in the path (excluding start and end)
  let currentRow = from.row + rowStep;
  let currentCol = from.col + colStep;
  
  while (currentRow !== to.row || currentCol !== to.col) {
    if (board[currentRow][currentCol] !== null) {
      return false;
    }
    currentRow += rowStep;
    currentCol += colStep;
  }
  
  return true;
}

/**
 * Get all pieces of a specific color
 */
export function getPiecesOfColor(board: (ChessPiece | null)[][], color: PieceColor): Array<{piece: ChessPiece, position: BoardPosition}> {
  const pieces: Array<{piece: ChessPiece, position: BoardPosition}> = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        pieces.push({ piece, position: { row, col } });
      }
    }
  }
  
  return pieces;
}

/**
 * Create initial game state
 */
export function createInitialGameState(): GameState {
  const board = createInitialBoard();
  
  return {
    board,
    currentPlayer: 'white',
    status: 'active',
    moveHistory: [],
    kingPositions: {
      white: findKingPosition(board, 'white'),
      black: findKingPosition(board, 'black')
    },
    castlingRights: {
      white: { kingside: true, queenside: true },
      black: { kingside: true, queenside: true }
    },
    halfMoveClock: 0,
    fullMoveNumber: 1
  };
}