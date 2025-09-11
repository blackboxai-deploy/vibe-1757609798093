/**
 * Chess Game Logic Engine
 * Main game state management, move validation, and game rule enforcement
 */

import {
  GameState,
  Move,
  BoardPosition,
  ChessPiece,
  PieceColor,
  GameStatus,
  ValidMove
} from './types';
import {
  isValidPosition,
  positionsEqual,
  getPieceAt,
  findKingPosition,
  makeMove,
  getOppositeColor,
  createInitialGameState
} from './board-utils';
import {
  getPossibleMoves,
  isSquareAttacked,
  isValidMove
} from './move-validator';

/**
 * Main Chess Game Class
 */
export class ChessGame {
  private gameState: GameState;

  constructor(initialState?: GameState) {
    this.gameState = initialState || createInitialGameState();
  }

  /**
   * Get current game state
   */
  getGameState(): GameState {
    return { ...this.gameState };
  }

  /**
   * Get current board
   */
  getBoard(): (ChessPiece | null)[][] {
    return this.gameState.board;
  }

  /**
   * Get current player
   */
  getCurrentPlayer(): PieceColor {
    return this.gameState.currentPlayer;
  }

  /**
   * Get game status
   */
  getGameStatus(): GameStatus {
    return this.gameState.status;
  }

  /**
   * Get move history
   */
  getMoveHistory(): Move[] {
    return [...this.gameState.moveHistory];
  }

  /**
   * Get last move
   */
  getLastMove(): Move | undefined {
    return this.gameState.lastMove;
  }

  /**
   * Check if it's a player's turn
   */
  isPlayerTurn(color: PieceColor): boolean {
    return this.gameState.currentPlayer === color && this.gameState.status === 'active';
  }

  /**
   * Get all legal moves for a piece at a position
   */
  getLegalMoves(position: BoardPosition): ValidMove[] {
    const piece = getPieceAt(this.gameState.board, position);
    
    if (!piece || piece.color !== this.gameState.currentPlayer) {
      return [];
    }

    const possibleMoves = getPossibleMoves(this.gameState.board, position, piece);
    
    // Filter out moves that would put own king in check
    return possibleMoves.filter(move => {
      return this.isMoveLegal(position, move.to);
    });
  }

  /**
   * Check if a move is legal (doesn't put own king in check)
   */
  private isMoveLegal(from: BoardPosition, to: BoardPosition): boolean {
    const piece = getPieceAt(this.gameState.board, from);
    if (!piece) return false;

    // Make the move temporarily
    const tempBoard = makeMove(this.gameState.board, from, to);
    
    // Find king position after move
    let kingPosition: BoardPosition;
    if (piece.type === 'king') {
      kingPosition = to;
    } else {
      kingPosition = findKingPosition(tempBoard, piece.color);
    }

    // Check if king would be in check after this move
    return !isSquareAttacked(tempBoard, kingPosition, getOppositeColor(piece.color));
  }

  /**
   * Attempt to make a move
   */
  makeMove(from: BoardPosition, to: BoardPosition): boolean {
    // Validate basic move conditions
    if (!this.canMakeMove(from, to)) {
      return false;
    }

    const piece = getPieceAt(this.gameState.board, from)!;
    const capturedPiece = getPieceAt(this.gameState.board, to);

    // Create move object
    const move: Move = {
      from,
      to,
      piece: { ...piece },
      capturedPiece: capturedPiece ? { ...capturedPiece } : undefined,
      moveType: capturedPiece ? 'capture' : 'normal',
      timestamp: Date.now()
    };

    // Execute the move
    this.executeMoveInternal(move);
    
    return true;
  }

  /**
   * Check if a move can be made
   */
  private canMakeMove(from: BoardPosition, to: BoardPosition): boolean {
    // Check if positions are valid
    if (!isValidPosition(from) || !isValidPosition(to)) {
      return false;
    }

    // Check if source and destination are the same
    if (positionsEqual(from, to)) {
      return false;
    }

    // Check if game is active
    if (this.gameState.status !== 'active' && this.gameState.status !== 'check') {
      return false;
    }

    // Check if there's a piece at the source position
    const piece = getPieceAt(this.gameState.board, from);
    if (!piece) {
      return false;
    }

    // Check if it's the player's turn
    if (piece.color !== this.gameState.currentPlayer) {
      return false;
    }

    // Check if the move is valid for this piece
    if (!isValidMove(this.gameState.board, from, to, piece)) {
      return false;
    }

    // Check if the move is legal (doesn't put own king in check)
    return this.isMoveLegal(from, to);
  }

  /**
   * Execute a move (internal method)
   */
  private executeMoveInternal(move: Move): void {
    // Update board
    this.gameState.board = makeMove(this.gameState.board, move.from, move.to);
    
    // Update king positions if king moved
    if (move.piece.type === 'king') {
      this.gameState.kingPositions[move.piece.color] = move.to;
    }

    // Update castling rights
    this.updateCastlingRights(move);

    // Add move to history
    this.gameState.moveHistory.push(move);
    this.gameState.lastMove = move;

    // Update move clocks
    this.updateMoveClock(move);

    // Switch players
    this.gameState.currentPlayer = getOppositeColor(this.gameState.currentPlayer);

    // Update game status
    this.updateGameStatus();
  }

  /**
   * Update castling rights after a move
   */
  private updateCastlingRights(move: Move): void {
    const { piece, from } = move;
    
    // King moves - lose all castling rights
    if (piece.type === 'king') {
      this.gameState.castlingRights[piece.color].kingside = false;
      this.gameState.castlingRights[piece.color].queenside = false;
    }
    
    // Rook moves - lose specific castling rights
    if (piece.type === 'rook') {
      if (piece.color === 'white') {
        if (from.row === 7 && from.col === 0) { // Queenside rook
          this.gameState.castlingRights.white.queenside = false;
        } else if (from.row === 7 && from.col === 7) { // Kingside rook
          this.gameState.castlingRights.white.kingside = false;
        }
      } else {
        if (from.row === 0 && from.col === 0) { // Queenside rook
          this.gameState.castlingRights.black.queenside = false;
        } else if (from.row === 0 && from.col === 7) { // Kingside rook
          this.gameState.castlingRights.black.kingside = false;
        }
      }
    }
  }

  /**
   * Update move clock counters
   */
  private updateMoveClock(move: Move): void {
    // Reset half-move clock on pawn move or capture
    if (move.piece.type === 'pawn' || move.capturedPiece) {
      this.gameState.halfMoveClock = 0;
    } else {
      this.gameState.halfMoveClock++;
    }

    // Increment full move number after black's move
    if (move.piece.color === 'black') {
      this.gameState.fullMoveNumber++;
    }
  }

  /**
   * Update game status (check, checkmate, stalemate, etc.)
   */
  private updateGameStatus(): void {
    const currentPlayer = this.gameState.currentPlayer;
    const kingPosition = this.gameState.kingPositions[currentPlayer];
    
    // Check if king is in check
    const isInCheck = isSquareAttacked(
      this.gameState.board,
      kingPosition,
      getOppositeColor(currentPlayer)
    );

    // Get all legal moves for current player
    const hasLegalMoves = this.hasAnyLegalMoves(currentPlayer);

    if (isInCheck) {
      if (hasLegalMoves) {
        this.gameState.status = 'check';
      } else {
        this.gameState.status = 'checkmate';
      }
    } else {
      if (hasLegalMoves) {
        this.gameState.status = 'active';
      } else {
        this.gameState.status = 'stalemate';
      }
    }

    // Check for draw conditions
    if (this.gameState.halfMoveClock >= 100) { // 50-move rule
      this.gameState.status = 'draw';
    }
  }

  /**
   * Check if a player has any legal moves
   */
  private hasAnyLegalMoves(color: PieceColor): boolean {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.gameState.board[row][col];
        if (piece && piece.color === color) {
          const legalMoves = this.getLegalMoves({ row, col });
          if (legalMoves.length > 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Check if king is in check
   */
  isKingInCheck(color: PieceColor): boolean {
    const kingPosition = this.gameState.kingPositions[color];
    return isSquareAttacked(this.gameState.board, kingPosition, getOppositeColor(color));
  }

  /**
   * Reset game to initial state
   */
  resetGame(): void {
    this.gameState = createInitialGameState();
  }

  /**
   * Get squares that are under attack by the opponent
   */
  getAttackedSquares(byColor: PieceColor): BoardPosition[] {
    const attackedSquares: BoardPosition[] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (isSquareAttacked(this.gameState.board, { row, col }, byColor)) {
          attackedSquares.push({ row, col });
        }
      }
    }
    
    return attackedSquares;
  }

  /**
   * Get piece at position
   */
  getPieceAt(position: BoardPosition): ChessPiece | null {
    return getPieceAt(this.gameState.board, position);
  }

  /**
   * Check if position is valid move destination for piece at source
   */
  isValidMoveDestination(from: BoardPosition, to: BoardPosition): boolean {
    return this.canMakeMove(from, to);
  }
}

/**
 * Create a new chess game instance
 */
export function createChessGame(): ChessGame {
  return new ChessGame();
}