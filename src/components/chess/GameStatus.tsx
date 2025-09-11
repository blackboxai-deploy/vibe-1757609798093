/**
 * Game Status Component
 * Display current game status, turn information, and game state indicators
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GameStatus, PieceColor } from '@/lib/chess/types';

interface GameStatusProps {
  gameStatus: GameStatus;
  currentPlayer: PieceColor;
  moveNumber: number;
  halfMoveClock: number;
  isKingInCheck: {
    white: boolean;
    black: boolean;
  };
  capturedPieces?: {
    white: string[];
    black: string[];
  };
}

export function GameStatusComponent({
  gameStatus,
  currentPlayer,
  moveNumber,
  halfMoveClock,
  isKingInCheck,
  capturedPieces = { white: [], black: [] }
}: GameStatusProps) {
  // Get status badge variant
  const getStatusVariant = () => {
    switch (gameStatus) {
      case 'check':
        return 'destructive' as const;
      case 'checkmate':
      case 'resigned':
        return 'destructive' as const;
      case 'stalemate':
      case 'draw':
        return 'secondary' as const;
      case 'active':
        return 'default' as const;
      default:
        return 'outline' as const;
    }
  };

  // Get status display text
  const getStatusDisplay = () => {
    switch (gameStatus) {
      case 'active':
        return 'Active Game';
      case 'check':
        return 'Check!';
      case 'checkmate':
        return 'Checkmate';
      case 'stalemate':
        return 'Stalemate';
      case 'draw':
        return 'Draw';
      case 'resigned':
        return 'Resigned';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-4">
      {/* Game Status Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Game Status</CardTitle>
            <Badge variant={getStatusVariant()}>
              {getStatusDisplay()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Move Information */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Move:</span>
              <div className="font-semibold">{moveNumber}</div>
            </div>
            <div>
              <span className="text-muted-foreground">50-Move Clock:</span>
              <div className="font-semibold">{halfMoveClock}/100</div>
            </div>
          </div>

          {/* Current Turn */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">Current Turn:</span>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                currentPlayer === 'white' 
                  ? 'bg-white border-2 border-gray-400' 
                  : 'bg-gray-800'
              }`} />
              <span className="font-semibold capitalize">
                {currentPlayer}
              </span>
            </div>
          </div>

          {/* Check Status */}
          {(isKingInCheck.white || isKingInCheck.black) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm font-medium text-red-800">
                King in Check:
              </div>
              <div className="mt-1 space-x-2">
                {isKingInCheck.white && (
                  <Badge variant="destructive" className="text-xs">
                    White King
                  </Badge>
                )}
                {isKingInCheck.black && (
                  <Badge variant="destructive" className="text-xs">
                    Black King
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Captured Pieces */}
      {(capturedPieces.white.length > 0 || capturedPieces.black.length > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Captured Pieces</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* White captured pieces */}
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Captured by Black:
              </div>
              <div className="flex flex-wrap gap-1 min-h-[1.5rem]">
                {capturedPieces.white.length > 0 ? (
                  capturedPieces.white.map((piece, index) => (
                    <span key={index} className="text-lg">
                      {piece}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">None</span>
                )}
              </div>
            </div>

            {/* Black captured pieces */}
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Captured by White:
              </div>
              <div className="flex flex-wrap gap-1 min-h-[1.5rem]">
                {capturedPieces.black.length > 0 ? (
                  capturedPieces.black.map((piece, index) => (
                    <span key={index} className="text-lg">
                      {piece}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">None</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}