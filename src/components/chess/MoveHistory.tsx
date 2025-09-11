/**
 * Move History Component
 * Display game moves in algebraic notation with navigation
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Move } from '@/lib/chess/types';
import { useGameHistory, formatGameResult } from '@/hooks/useGameHistory';

interface MoveHistoryProps {
  moveHistory: Move[];
  gameStatus: string;
  className?: string;
}

export function MoveHistory({ 
  moveHistory, 
  gameStatus,
  className = ''
}: MoveHistoryProps) {
  const { formattedHistory, getCurrentMoveNumber } = useGameHistory(moveHistory);

  // Get game result for display
  const gameResult = formatGameResult(gameStatus);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Move History</CardTitle>
          <Badge variant="outline" className="text-xs">
            {getCurrentMoveNumber() - 1} moves
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48 w-full pr-4">
          {formattedHistory.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
              No moves yet
            </div>
          ) : (
            <div className="space-y-1">
              {formattedHistory.map((moveText, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 rounded hover:bg-muted transition-colors cursor-pointer text-sm"
                  title={`Move ${index + 1}`}
                >
                  <span className="font-mono">{moveText}</span>
                </div>
              ))}
              
              {/* Game result */}
              {gameResult !== '*' && (
                <div className="mt-4 pt-2 border-t">
                  <div className="text-center">
                    <Badge variant="secondary" className="font-mono">
                      {gameResult}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Move count summary */}
        <div className="mt-4 pt-3 border-t text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Total moves: {moveHistory.length}</span>
            <span>Current move: {getCurrentMoveNumber()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Compact Move History for smaller spaces
 */
export function CompactMoveHistory({ 
  moveHistory, 
  gameStatus,
  className = ''
}: MoveHistoryProps) {
  const { formattedHistory } = useGameHistory(moveHistory);
  const gameResult = formatGameResult(gameStatus);

  return (
    <div className={`${className} space-y-2`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Moves</h3>
        <Badge variant="outline" className="text-xs">
          {moveHistory.length}
        </Badge>
      </div>
      
      <ScrollArea className="h-32">
        <div className="text-xs space-y-1 font-mono">
          {formattedHistory.length === 0 ? (
            <div className="text-muted-foreground italic">No moves</div>
          ) : (
            <>
              {formattedHistory.map((moveText, index) => (
                <div key={index} className="hover:bg-muted rounded px-1 py-0.5">
                  {moveText}
                </div>
              ))}
              {gameResult !== '*' && (
                <div className="pt-1 text-center font-bold">
                  {gameResult}
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

/**
 * Last Moves Display - shows only the most recent moves
 */
export function LastMovesDisplay({ 
  moveHistory,
  maxMoves = 4,
  className = ''
}: {
  moveHistory: Move[];
  maxMoves?: number;
  className?: string;
}) {
  const { moveNotations } = useGameHistory(moveHistory);
  
  // Get the last few moves
  const recentMoves = moveNotations.slice(-maxMoves);

  if (recentMoves.length === 0) {
    return null;
  }

  return (
    <div className={`${className} space-y-1`}>
      <h4 className="text-xs font-semibold text-muted-foreground">Recent:</h4>
      <div className="text-xs font-mono space-y-0.5">
        {recentMoves.map((moveNotation, index) => (
          <div 
            key={index}
            className="flex items-center space-x-2 text-muted-foreground"
          >
            <span className="w-6 text-right">
              {moveNotation.isWhiteMove ? `${moveNotation.moveNumber}.` : ''}
            </span>
            <span className={moveNotation.isWhiteMove ? 'text-foreground' : 'text-foreground'}>
              {moveNotation.notation}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}