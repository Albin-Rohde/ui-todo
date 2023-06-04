import { Tooltip } from '@mui/material';
import React, { useContext } from 'react';

import { TodoItemContext } from '../contexts/TodoItemsContext';
import { TodoItem } from '../types';

/**
 * Calculate the pixel offset of the cursor based on the cursor index
 * @param cursorIndex index of the cursor in input
 * @param input input element to calculate the offset for
 */
function calculateCursorPixelOffset(cursorIndex: number, input: HTMLInputElement): number {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context!.font = window.getComputedStyle(input).font;

  const slicedValue = input.value.slice(0, cursorIndex);
  return context!.measureText(slicedValue).width;
}

interface FakeCursorProps {
  item: TodoItem;
  inputRef: React.RefObject<HTMLInputElement>;
  paddingLeft?: number
}

export const FakeCursor = (props: FakeCursorProps) => {
  const { cursorPositions } = useContext(TodoItemContext);

  const cursorPosition = cursorPositions.find((cursorPos) => {
    return cursorPos.itemId === props.item.id;
  });

  if (!cursorPosition || cursorPosition.cursorStart === null || !props.inputRef.current) return (<></>);

  const cursorLeft = calculateCursorPixelOffset(cursorPosition.cursorStart, props.inputRef.current!);

  let left = cursorLeft + 41; // 41 is the padding of the input
  if (props.paddingLeft) {
    left += props.paddingLeft;
  }
  if (cursorPosition.cursorStart === cursorPosition.cursorEnd) {
    return (
      <Tooltip title={`${cursorPosition.username}`} arrow open={true}>
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: left,
            width: '2px',
            height: '1.2em',
            backgroundColor: '#007afe',
          }}
          className="fake-cursor">
          ‎
        </div>
      </Tooltip>
    )
  } else {
    return (
      <Tooltip title={`${cursorPosition.username}`} arrow open={true}>
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: left, // 41 is the padding of the input
            width: `${calculateCursorPixelOffset(cursorPosition.cursorEnd, props.inputRef.current!) - cursorLeft}px`,
            height: '1.2em',
            backgroundColor: 'rgba(0,157,255,0.4)',
          }}
          className=""/>
      </Tooltip>
    )
  }
};