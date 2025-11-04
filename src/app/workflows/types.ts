export interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  data?: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface WorkflowData {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface WorkflowRecord {
  id: string;
  name: string;
  data: WorkflowData;
  createdAt: string;
  updatedAt: string;
}
