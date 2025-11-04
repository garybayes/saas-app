"use client";

import { WorkflowNode } from "../types";

interface NodeEditorProps {
  selectedNode: WorkflowNode | null;
  onLabelChange: (nodeId: string, label: string) => void;
}

const NodeEditor = ({ selectedNode, onLabelChange }: NodeEditorProps) => {
  if (!selectedNode) {
    return (
      <aside className="border-l-2 border-gray-200 p-4 text-sm w-64">
        <div className="font-bold">Node Editor</div>
        <div>Select a node to edit its properties.</div>
      </aside>
    );
  }

  return (
    <aside className="border-l-2 border-gray-200 p-4 text-sm w-64">
      <div className="font-bold">Node Editor</div>
      <div>
        <label>Label:</label>
        <input
          type="text"
          value={selectedNode.label}
          onChange={(e) => onLabelChange(selectedNode.id, e.target.value)}
          className="w-full p-1 border border-gray-300 rounded"
        />
      </div>
    </aside>
  );
};

export default NodeEditor;
