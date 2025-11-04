"use client";

interface WorkflowToolbarProps {
  onSave: () => void;
  onLoad: () => void;
  onDelete: () => void;
}

const WorkflowToolbar = ({ onSave, onLoad, onDelete }: WorkflowToolbarProps) => {
  return (
    <div className="flex justify-end p-2 border-b-2 border-gray-200">
      <button onClick={onSave} className="bg-blue-500 text-white p-2 rounded mr-2">Save</button>
      <button onClick={onLoad} className="bg-green-500 text-white p-2 rounded mr-2">Load</button>
      <button onClick={onDelete} className="bg-red-500 text-white p-2 rounded">Delete</button>
    </div>
  );
};

export default WorkflowToolbar;
