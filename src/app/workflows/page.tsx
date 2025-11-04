"use client";

import { useState, useCallback, DragEvent, useEffect } from "react";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  Connection,
  NodeChange,
  EdgeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";

import WorkflowToolbar from "./components/WorkflowToolbar";
import NodePalette from "./components/NodePalette";
import NodeEditor from "./components/NodeEditor";
import WorkflowCanvas from "./components/WorkflowCanvas";
import { WorkflowNode, WorkflowData, WorkflowRecord } from "./types";

export default function WorkflowPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowRecord[]>([]);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null);

  const onNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData("application/reactflow");
    const position = {
      x: event.clientX - 250, // Adjust for palette width
      y: event.clientY - 50, // Adjust for toolbar height
    };

    const newNode: Node = {
      id: uuidv4(),
      type,
      position,
      data: { label: `${type} node` },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    const workflowNode: WorkflowNode = {
      id: node.id,
      type: node.type || "",
      label: node.data.label,
      data: node.data,
    };
    setSelectedNode(workflowNode);
  };

  const onLabelChange = (nodeId: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    );
  };

  const handleSave = async () => {
    const workflowName = prompt("Enter a name for your workflow:");
    if (!workflowName) return;

    const workflowData: WorkflowData = {
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type || "",
        label: node.data.label,
        data: node.data,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
    };

    try {
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: workflowName, data: workflowData }),
      });

      if (response.ok) {
        alert("Workflow saved successfully!");
        handleLoad(); // Refresh the list of workflows
      } else {
        const errorData = await response.json();
        alert(`Failed to save workflow: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error saving workflow:", error);
      alert("An unexpected error occurred while saving the workflow.");
    }
  };

  const handleLoad = async () => {
    try {
      const response = await fetch("/api/workflows");
      if (response.ok) {
        const loadedWorkflows: WorkflowRecord[] = await response.json();
        setWorkflows(loadedWorkflows);

        if (loadedWorkflows.length > 0) {
          const workflowNames = loadedWorkflows.map((wf) => wf.name).join("\n");
          const selectedName = prompt(
            `Select a workflow to load:\n\n${workflowNames}`
          );
          const selectedWorkflow = loadedWorkflows.find(
            (wf) => wf.name === selectedName
          );

          if (selectedWorkflow) {
            setNodes(selectedWorkflow.data.nodes);
            setEdges(selectedWorkflow.data.edges);
            setCurrentWorkflowId(selectedWorkflow.id);
          }
        } else {
          alert("No saved workflows found.");
        }
      } else {
        alert("Failed to load workflows.");
      }
    } catch (error) {
      console.error("Error loading workflows:", error);
      alert("An unexpected error occurred while loading workflows.");
    }
  };

  const handleDelete = async () => {
    if (!currentWorkflowId) {
      alert("Please load a workflow to delete.");
      return;
    }

    if (confirm("Are you sure you want to delete this workflow?")) {
      try {
        const response = await fetch(`/api/workflows/${currentWorkflowId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Workflow deleted successfully!");
          setNodes([]);
          setEdges([]);
          setCurrentWorkflowId(null);
          handleLoad(); // Refresh the list of workflows
        } else {
          const errorData = await response.json();
          alert(`Failed to delete workflow: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error deleting workflow:", error);
        alert("An unexpected error occurred while deleting the workflow.");
      }
    }
  };

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <WorkflowToolbar
        onSave={handleSave}
        onLoad={handleLoad}
        onDelete={handleDelete}
      />
      <div className="flex flex-grow">
        <NodePalette />
        <div className="flex-grow" onDragOver={onDragOver} onDrop={onDrop}>
          <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
          />
        </div>
        <NodeEditor
          selectedNode={selectedNode}
          onLabelChange={onLabelChange}
        />
      </div>
    </div>
  );
}
