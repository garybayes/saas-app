"use client";

import React from 'react';

const NodePalette = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="border-r-2 border-gray-200 p-4 text-sm w-64">
      <div className="mb-4 font-bold">You can drag these nodes to the pane on the right.</div>
      <div
        className="bg-white p-3 border-2 border-blue-500 rounded cursor-grab"
        onDragStart={(event) => onDragStart(event, 'email')}
        draggable
      >
        Email Node
      </div>
      <div
        className="bg-white p-3 border-2 border-yellow-500 rounded cursor-grab mt-2"
        onDragStart={(event) => onDragStart(event, 'webhook')}
        draggable
      >
        Webhook Node
      </div>
      <div
        className="bg-white p-3 border-2 border-green-500 rounded cursor-grab mt-2"
        onDragStart={(event) => onDragStart(event, 'wait')}
        draggable
      >
        Wait Node
      </div>
      <div
        className="bg-white p-3 border-2 border-red-500 rounded cursor-grab mt-2"
        onDragStart={(event) => onDragStart(event, 'end')}
        draggable
      >
        End Node
      </div>
    </aside>
  );
};

export default NodePalette;
