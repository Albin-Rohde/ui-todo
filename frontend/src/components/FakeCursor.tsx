import { Tooltip } from '@mui/material';
import React from 'react';

interface FakeCursorProps {
  top?: number;
  left: number;
  username: string;
}

export const FakeCursor = ({ top, left, username }: FakeCursorProps) => {
  top = top || 0 + 18;
  left = left + 41;
  return (
    <Tooltip
      title={`${username} is typing`} arrow open={true}
    >
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
    </Tooltip>
  );
};
