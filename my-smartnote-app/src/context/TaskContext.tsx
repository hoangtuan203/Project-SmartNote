import { createContext, useContext, useState, ReactNode } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  assignee: string;
  tags: string[];
  completed: boolean;
}

interface TaskContextType {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
