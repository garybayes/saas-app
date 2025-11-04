"use client";

import ReactFlow, { MiniMap, Controls, Background, OnNodesChange, OnEdgesChange, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { useMemo } from "react";

interface WorkflowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
}

const WorkflowCanvas = ({ nodes, edges, onNodesChange, onEdgesChange }: WorkflowCanvasProps) => {
  const nodeTypes = useMemo(() => ({}), []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
};

export default WorkflowCanvas;
