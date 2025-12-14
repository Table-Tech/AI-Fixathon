"use client";

import { useState } from "react";
import { Button, Card, CardContent, Skeleton } from "@/components/ui";
import { useAuth, useTasks } from "@/hooks";
import Link from "next/link";

export default function TakenPage() {
  const { user, loading: authLoading } = useAuth();
  const { tasks, isLoading, isCreating, createTaskFromAI, toggleSubtask, deleteTask } = useTasks();

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  const handleCreateTask = async () => {
    if (!message.trim()) return;

    setModalError(null);
    const result = await createTaskFromAI(message.trim());

    if (result) {
      setMessage("");
      setShowModal(false);
    } else {
      setModalError("Kon taak niet aanmaken. Probeer het opnieuw.");
    }
  };

  const completedCount = (subtasks: { is_done: boolean }[]) =>
    subtasks.filter((st) => st.is_done).length;

  // Deadline helpers
  const getDeadlineStatus = (deadline: string | null) => {
    if (!deadline) return null;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return { label: "Verlopen", color: "bg-red-100 text-red-800", urgent: true };
    if (daysLeft === 0) return { label: "Vandaag", color: "bg-red-100 text-red-800", urgent: true };
    if (daysLeft <= 3) return { label: `${daysLeft} dagen`, color: "bg-orange-100 text-orange-800", urgent: true };
    if (daysLeft <= 7) return { label: `${daysLeft} dagen`, color: "bg-yellow-100 text-yellow-800", urgent: false };
    return { label: formatDeadline(deadline), color: "bg-gray-100 text-gray-800", urgent: false };
  };

  const formatDeadline = (deadline: string) => {
    return new Date(deadline).toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "short",
    });
  };

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <div className="px-4 py-6 max-w-3xl mx-auto">
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48 mb-6" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <div className="px-4 py-6 max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Terug naar home
          </Link>

          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">Taken</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Beheer je aanvragen en acties
            </p>
          </div>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-[var(--muted)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold mb-2">Log in om je taken te zien</h2>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                Maak een account aan of log in om taken te beheren.
              </p>
              <Link href="/login">
                <Button>Inloggen</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="px-4 py-6 max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Terug naar home
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Taken</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Beheer je aanvragen en acties
          </p>
        </div>

        {/* Deadline Alert Banner */}
        {(() => {
          const urgentTasks = tasks.filter((t) => {
            if (!t.deadline || t.status === "completed") return false;
            const status = getDeadlineStatus(t.deadline);
            return status?.urgent;
          });

          if (urgentTasks.length === 0) return null;

          return (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium">
                  {urgentTasks.length === 1
                    ? "1 taak heeft een dringende deadline"
                    : `${urgentTasks.length} taken hebben dringende deadlines`}
                </span>
              </div>
            </div>
          );
        })()}

        {/* New Task Button */}
        <Button
          onClick={() => setShowModal(true)}
          className="w-full mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nieuwe taak (AI)
        </Button>

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-[var(--muted)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold mb-2">Nog geen taken</h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                Klik op &quot;Nieuwe taak (AI)&quot; om je eerste taak aan te maken.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
          {/* Active Tasks */}
          <div className="space-y-4">
            {tasks.filter(t => t.status !== "completed").map((task) => (
              <Card key={task.id}>
                <CardContent className="pt-4 pb-4">
                  {/* Task Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{task.title}</h3>
                        {task.deadline && (() => {
                          const status = getDeadlineStatus(task.deadline);
                          return status ? (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {status.label}
                            </span>
                          ) : null;
                        })()}
                      </div>
                      {task.description && (
                        <p className="text-sm text-[var(--muted-foreground)] mt-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      title="Verwijderen"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Progress */}
                  {task.subtasks.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-[var(--muted-foreground)]">Voortgang</span>
                        <span className="font-medium">
                          {completedCount(task.subtasks)}/{task.subtasks.length}
                        </span>
                      </div>
                      <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--primary)] transition-all duration-300"
                          style={{
                            width: `${(completedCount(task.subtasks) / task.subtasks.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Subtasks */}
                  {task.subtasks.length > 0 && (
                    <div className="space-y-3">
                      {task.subtasks.map((subtask) => (
                        <label
                          key={subtask.id}
                          className="flex items-start gap-3 cursor-pointer group py-1"
                        >
                          <div className="relative mt-0.5 flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={subtask.is_done}
                              onChange={(e) => toggleSubtask(subtask.id, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                              subtask.is_done
                                ? "bg-[var(--primary)] border-[var(--primary)]"
                                : "border-[var(--muted-foreground)]/40 group-hover:border-[var(--primary)]/60"
                            }`}>
                              <svg
                                className={`w-3 h-3 text-white transition-all duration-200 ${
                                  subtask.is_done ? "opacity-100 scale-100" : "opacity-0 scale-50"
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          </div>
                          <span
                            className={`text-sm transition-all duration-200 ${
                              subtask.is_done
                                ? "line-through text-[var(--muted-foreground)]"
                                : "group-hover:text-[var(--foreground)]"
                            }`}
                          >
                            {subtask.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Complete Button */}
                  <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-end">
                    {task.status !== "completed" && (
                      <button
                        onClick={() => updateTaskStatus(task.id, "completed")}
                        disabled={task.subtasks.length > 0 && completedCount(task.subtasks) < task.subtasks.length}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary)]/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Markeren als voltooid
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Completed Tasks */}
          {tasks.filter(t => t.status === "completed").length > 0 && (
            <div className="mt-8">
              <details className="group">
                <summary className="flex items-center gap-2 cursor-pointer text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-3">
                  <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-sm font-medium">
                    Voltooide taken ({tasks.filter(t => t.status === "completed").length})
                  </span>
                </summary>
                <div className="space-y-3">
                  {tasks.filter(t => t.status === "completed").map((task) => (
                    <Card key={task.id} className="opacity-60">
                      <CardContent className="py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="line-through text-[var(--muted-foreground)]">{task.title}</span>
                          </div>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            title="Verwijderen"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </details>
            </div>
          )}
          </>
        )}
      </div>

      {/* AI Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pb-20 sm:pb-0">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isCreating && setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-[var(--background)] w-full sm:max-w-lg sm:rounded-lg rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => !isCreating && setShowModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-[var(--muted)] rounded-lg"
              disabled={isCreating}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-4">
              <h2 className="text-xl font-bold">Nieuwe taak maken</h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Beschrijf wat je wilt doen en de AI maakt een taak met stappen voor je aan.
              </p>
            </div>

            {/* Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Wat wil je doen?
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Bijv: Ik wil huurtoeslag aanvragen"
                className="w-full h-32 px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                disabled={isCreating}
              />
            </div>

            {/* Error */}
            {modalError && (
              <p className="text-sm text-red-500 mb-4">{modalError}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowModal(false)}
                disabled={isCreating}
              >
                Annuleren
              </Button>
              <Button
                className="flex-1"
                onClick={handleCreateTask}
                disabled={isCreating || !message.trim()}
              >
                {isCreating ? (
                  <>
                    <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Bezig...
                  </>
                ) : (
                  "Maak taak"
                )}
              </Button>
            </div>

            {/* Helper text */}
            <p className="text-xs text-[var(--muted-foreground)] text-center mt-4 mb-4">
              De AI analyseert je bericht en maakt een taak met duidelijke stappen.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
