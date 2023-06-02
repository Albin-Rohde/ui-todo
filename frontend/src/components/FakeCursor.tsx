import React from 'react';

interface FakeCursorProps {
  top?: number;
  left: number;
}

export const FakeCursor = ({ top, left }: FakeCursorProps) => {
  top = top || 0 + 18;
  left = left + 41;
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        width: '2px',
        height: '1.2em',
        backgroundColor: '#007afe',
      }}
      className="fake-cursor">
      ‎
    </div>
  );
};
