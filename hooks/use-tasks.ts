"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Task, Subtask } from "@/types/database";

export interface TaskWithSubtasks extends Task {
  subtasks: Subtask[];
}

interface CreateTaskResult {
  task: TaskWithSubtasks | null;
  unrelated?: boolean;
  unrelatedMessage?: string;
}

interface UseTasksReturn {
  tasks: TaskWithSubtasks[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createTaskFromAI: (message: string) => Promise<CreateTaskResult>;
  toggleSubtask: (subtaskId: string, isDone: boolean) => Promise<void>;
  updateTaskStatus: (taskId: string, status: Task["status"]) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  isCreating: boolean;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<TaskWithSubtasks[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get auth token for API calls
  const getAuthToken = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await getAuthToken();
      if (!token) {
        setTasks([]);
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Kon taken niet ophalen");
      }

      const { data } = await response.json();
      setTasks(data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err instanceof Error ? err.message : "Er ging iets mis");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create task from AI message
  const createTaskFromAI = async (message: string): Promise<CreateTaskResult> => {
    try {
      setIsCreating(true);
      setError(null);

      const token = await getAuthToken();
      if (!token) {
        setError("Je moet ingelogd zijn");
        return { task: null };
      }

      const response = await fetch("/api/tasks/from-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Kon taak niet aanmaken");
      }

      // Check if AI flagged this as unrelated
      if (result.unrelated) {
        return {
          task: null,
          unrelated: true,
          unrelatedMessage: result.message,
        };
      }

      // Add new task to the list
      const newTask = result.data as TaskWithSubtasks;
      setTasks((prev) => [newTask, ...prev]);

      return { task: newTask };
    } catch (err) {
      console.error("Error creating task from AI:", err);
      const errorMessage = err instanceof Error ? err.message : "Er ging iets mis";
      setError(errorMessage);
      return { task: null };
    } finally {
      setIsCreating(false);
    }
  };

  // Toggle subtask completion
  const toggleSubtask = async (subtaskId: string, isDone: boolean): Promise<void> => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      // Optimistic update
      setTasks((prev) =>
        prev.map((task) => ({
          ...task,
          subtasks: task.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, is_done: isDone } : st
          ),
        }))
      );

      const response = await fetch(`/api/subtasks/${subtaskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_done: isDone }),
      });

      if (!response.ok) {
        // Revert on error
        setTasks((prev) =>
          prev.map((task) => ({
            ...task,
            subtasks: task.subtasks.map((st) =>
              st.id === subtaskId ? { ...st, is_done: !isDone } : st
            ),
          }))
        );
        throw new Error("Kon subtaak niet bijwerken");
      }
    } catch (err) {
      console.error("Error toggling subtask:", err);
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId: string, status: Task["status"]): Promise<void> => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      // Optimistic update
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status } : task
        )
      );

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        // Revert on error - refetch to get correct state
        await fetchTasks();
        throw new Error("Kon taak niet bijwerken");
      }
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  // Delete task
  const deleteTask = async (taskId: string): Promise<void> => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      // Optimistic update
      setTasks((prev) => prev.filter((task) => task.id !== taskId));

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Refetch on error
        await fetchTasks();
        throw new Error("Kon taak niet verwijderen");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Subscribe to auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchTasks();
    });

    return () => subscription.unsubscribe();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    refetch: fetchTasks,
    createTaskFromAI,
    toggleSubtask,
    updateTaskStatus,
    deleteTask,
    isCreating,
  };
}
