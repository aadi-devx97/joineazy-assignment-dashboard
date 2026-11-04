import { useContext, useState } from "react";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import SubmissionModal from "../components/dashboard/SubmissionModal";
import { AppContext } from "../context/AppContextDefinition";

function StudentDashboard() {
  const { currentUser, assignments, setAssignments } =
    useContext(AppContext);

  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Only show assignments assigned to this student
  const myAssignments = assignments.filter(
    (assignment) =>
      assignment.assignedTo?.includes(currentUser.id)
  );

  const submittedCount = myAssignments.filter(
    (assignment) =>
      assignment.submissions?.[currentUser.id]?.status === "submitted"
  ).length;

  const pendingCount = myAssignments.length - submittedCount;

  const progress =
    myAssignments.length > 0
      ? Math.round((submittedCount / myAssignments.length) * 100)
      : 0;

  // Confirm assignment submission
  const handleSubmission = () => {
    if (!selectedAssignment) return;

    setAssignments((previous) =>
      previous.map((assignment) => {
        if (assignment.id !== selectedAssignment.id) {
          return assignment;
        }

        return {
          ...assignment,
          submissions: {
            ...assignment.submissions,
            [currentUser.id]: {
              status: "submitted",
              submittedAt: new Date().toISOString(),
            },
          },
        };
      })
    );

    setSelectedAssignment(null);
  };

  const stats = [
    {
      label: "Total Assignments",
      value: myAssignments.length,
      icon: ClipboardList,
    },
    {
      label: "Submitted",
      value: submittedCount,
      icon: CheckCircle2,
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: Clock,
    },
  ];

  return (
    <DashboardLayout
      title="My Dashboard"
      description="Your learning tasks, deadlines and submission progress."
    >
      {/* Welcome */}
      <section className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-terracotta mb-2">
          Student workspace
        </p>

        <h2 className="text-xl font-semibold">
          Ready to get things done, {currentUser.name.split(" ")[0]}?
        </h2>

        <p className="text-sm text-muted mt-2">
          Stay on top of your assignments and keep making progress.
        </p>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-surface border border-border rounded-xl p-5"
            >
              <div className="flex justify-between items-center mb-5">
                <p className="text-sm text-muted">{stat.label}</p>
                <Icon size={20} className="text-olive" />
              </div>

              <p className="text-3xl font-semibold">{stat.value}</p>
            </div>
          );
        })}
      </section>

      {/* Progress */}
      <section className="bg-surface border border-border rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-semibold">Your overall progress</h3>

            <p className="text-sm text-muted mt-1">
              {submittedCount} of {myAssignments.length} assignments completed
            </p>
          </div>

          <span className="text-xl font-semibold text-olive">
            {progress}%
          </span>
        </div>

        <div
          className="w-full h-2.5 bg-border rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Assignment completion progress"
        >
          <div
            className="h-full bg-olive rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      {/* Assignments */}
      <section className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="text-lg font-semibold">My Assignments</h3>

          <p className="text-sm text-muted mt-1">
            All assignments assigned to you.
          </p>
        </div>

        {myAssignments.length === 0 ? (
          <div className="py-16 px-5 text-center">
            <ClipboardList
              size={35}
              className="mx-auto text-muted mb-4"
            />

            <h4 className="font-semibold">You're all caught up!</h4>

            <p className="text-sm text-muted mt-2">
              No assignments have been assigned to you yet.
              Check back later.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {myAssignments.map((assignment) => {
              const isSubmitted =
                assignment.submissions?.[currentUser.id]?.status ===
                "submitted";

              return (
                <article
                  key={assignment.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="min-w-0">
                    <h4 className="font-semibold">
                      {assignment.title}
                    </h4>

                    <p className="text-sm text-muted mt-1">
                      {assignment.description}
                    </p>

                    <p className="text-xs text-muted mt-3">
                      Due: {assignment.dueDate}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <span
                      className={`text-xs px-3 py-1.5 rounded-full ${
                        isSubmitted
                          ? "bg-olive/10 text-olive"
                          : "bg-terracotta/10 text-terracotta"
                      }`}
                    >
                      {isSubmitted ? "Submitted" : "Pending"}
                    </span>

                    {assignment.driveLink && (
                      <a
                        href={assignment.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open assignment resource"
                        className="w-9 h-9 flex items-center justify-center border border-border rounded-lg hover:bg-canvas"
                      >
                        <ExternalLink size={17} />
                      </a>
                    )}

                    {!isSubmitted && (
                      <button
                        onClick={() => setSelectedAssignment(assignment)}
                        className="px-4 py-2.5 bg-olive text-white text-sm font-medium rounded-lg hover:bg-olive-dark transition-colors"
                      >
                        Yes, I have submitted
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Submission confirmation modal */}
      <SubmissionModal
        isOpen={Boolean(selectedAssignment)}
        onClose={() => setSelectedAssignment(null)}
        onConfirm={handleSubmission}
        assignmentTitle={selectedAssignment?.title || ""}
      />
    </DashboardLayout>
  );
}

export default StudentDashboard;