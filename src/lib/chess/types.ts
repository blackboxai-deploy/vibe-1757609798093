/**
 * Chess Game Types and Interfaces
 * Complete type definitions for chess pieces, board state, and game logic
 */

export type PieceColor = 'white' | 'black';
export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean; // For castling and en passant
  id: string; // Unique identifier for each piece
}

export interface BoardPosition {
  row: number; // 0-7 (0 = rank 8, 7 = rank 1)
  col: number; // 0-7 (0 = file a, 7 = file h)
}

export interface Move {
  from: BoardPosition;
  to: BoardPosition;
  piece: ChessPiece;
  capturedPiece?: ChessPiece;
  moveType?: MoveType;
  notation?: string; // Standard algebraic notation
  timestamp: number;
}

export type MoveType = 
  | 'normal'
  | 'capture'
  | 'castling-kingside'
  | 'castling-queenside'
  | 'en-passant'
  | 'pawn-promotion';

export type GameStatus = 
  | 'active'
  | 'check'
  | 'checkmate'
  | 'stalemate'
  | 'draw'
  | 'resigned';

export interface GameState {
  board: (ChessPiece | null)[][];
  currentPlayer: PieceColor;
  status: GameStatus;
  moveHistory: Move[];
  lastMove?: Move;
  kingPositions: {
    white: BoardPosition;
    black: BoardPosition;
  };
  castlingRights: {
    white: {
      kingside: boolean;
      queenside: boolean;
    };
    black: {
      kingside: boolean;
      queenside: boolean;
    };
  };
  enPassantTarget?: BoardPosition; // Square where en passant capture is possible
  halfMoveClock: number; // For 50-move rule
  fullMoveNumber: number;
}

export interface ValidMove {
  to: BoardPosition;
  moveType: MoveType;
  capturedPiece?: ChessPiece;
}

export interface ChessGameConfig {
  allowUndo?: boolean;
  showMoveHighlights?: boolean;
  showLegalMoves?: boolean;
  autoPromoteToQueen?: boolean;
}

// Unicode symbols for chess pieces
export const PIECE_SYMBOLS: Record<PieceColor, Record<PieceType, string>> = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  }
};

// Board file and rank labels
export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

// Initial piece setup
export const INITIAL_SETUP: Record<PieceType, { white: BoardPosition[]; black: BoardPosition[] }> = {
  rook: {
    white: [{ row: 7, col: 0 }, { row: 7, col: 7 }],
    black: [{ row: 0, col: 0 }, { row: 0, col: 7 }]
  },
  knight: {
    white: [{ row: 7, col: 1 }, { row: 7, col: 6 }],
    black: [{ row: 0, col: 1 }, { row: 0, col: 6 }]
  },
  bishop: {
    white: [{ row: 7, col: 2 }, { row: 7, col: 5 }],
    black: [{ row: 0, col: 2 }, { row: 0, col: 5 }]
  },
  queen: {
    white: [{ row: 7, col: 3 }],
    black: [{ row: 0, col: 3 }]
  },
  king: {
    white: [{ row: 7, col: 4 }],
    black: [{ row: 0, col: 4 }]
  },
  pawn: {
    white: Array.from({ length: 8 }, (_, i) => ({ row: 6, col: i })),
    black: Array.from({ length: 8 }, (_, i) => ({ row: 1, col: i }))
  }
};