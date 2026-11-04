import { useContext, useMemo, useState } from "react";
import {
  Search,
  ClipboardList,
  ExternalLink,
  CheckCircle2,
  Clock,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import SubmissionModal from "../components/dashboard/SubmissionModal";
import { AppContext } from "../context/AppContext";

function MyAssignmentsPage() {
  const { currentUser, assignments, setAssignments } =
    useContext(AppContext);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("nearest");
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Only assignments assigned to the logged-in student
  const myAssignments = assignments.filter(
    (assignment) => assignment.assignedTo?.includes(currentUser.id)
  );

  const filteredAssignments = useMemo(() => {
    let result = [...myAssignments];

    if (search.trim()) {
      result = result.filter((assignment) =>
        assignment.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((assignment) => {
        const isSubmitted =
          assignment.submissions?.[currentUser.id]?.status === "submitted";

        return statusFilter === "submitted"
          ? isSubmitted
          : !isSubmitted;
      });
    }

    result.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);

      return sortOrder === "nearest"
        ? dateA - dateB
        : dateB - dateA;
    });

    return result;
  }, [myAssignments, search, statusFilter, sortOrder, currentUser.id]);

  const submittedCount = myAssignments.filter(
    (assignment) =>
      assignment.submissions?.[currentUser.id]?.status === "submitted"
  ).length;

  const pendingCount = myAssignments.length - submittedCount;

  const handleSubmission = () => {
    if (!selectedAssignment) return;

    setAssignments((previous) =>
      previous.map((assignment) => {
        if (assignment.id !== selectedAssignment.id) return assignment;

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

  return (
    <DashboardLayout
      title="My Assignments"
      description="View your tasks, manage deadlines and track submissions."
    >
      {/* Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
        {[
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
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="bg-surface border border-border rounded-xl p-5"
            >
              <div className="flex justify-between items-center mb-5">
                <p className="text-sm text-muted">{item.label}</p>
                <Icon size={20} className="text-olive" />
              </div>

              <p className="text-3xl font-semibold">{item.value}</p>
            </div>
          );
        })}
      </section>

      {/* Search and filters */}
      <section className="bg-surface border border-border rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assignments..."
              className="w-full bg-canvas border border-border rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-olive"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-canvas border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-olive"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-canvas border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-olive"
          >
            <option value="nearest">Nearest due date</option>
            <option value="farthest">Farthest due date</option>
          </select>
        </div>
      </section>

      {/* Assignment list */}
      <section className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-lg">Your Assignments</h3>

          <p className="text-sm text-muted mt-1">
            {filteredAssignments.length} assignments found.
          </p>
        </div>

        {filteredAssignments.length === 0 ? (
          <div className="py-16 px-5 text-center">
            <ClipboardList
              size={35}
              className="mx-auto text-muted mb-4"
            />

            <h4 className="font-semibold">
              {search || statusFilter !== "all"
                ? "No matching assignments"
                : "No assignments yet"}
            </h4>

            <p className="text-sm text-muted mt-2">
              {search || statusFilter !== "all"
                ? "Try changing your search or filters."
                : "Your assigned tasks will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredAssignments.map((assignment) => {
              const isSubmitted =
                assignment.submissions?.[currentUser.id]?.status === "submitted";

              const isOverdue =
                new Date(`${assignment.dueDate}T23:59:59`) < new Date() &&
                !isSubmitted;

              return (
                <article key={assignment.id} className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="font-semibold">
                        {assignment.title}
                      </h4>

                      <p className="text-sm text-muted mt-1">
                        {assignment.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                        <span className="text-muted">
                          Due: {assignment.dueDate}
                        </span>

                        {isOverdue && (
                          <span className="text-terracotta font-medium">
                            Overdue
                          </span>
                        )}
                      </div>
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
                          className="inline-flex items-center gap-2 border border-border px-3 py-2 rounded-lg text-sm hover:bg-canvas"
                        >
                          Open resource
                          <ExternalLink size={15} />
                        </a>
                      )}

                      {!isSubmitted && (
                        <button
                          onClick={() => setSelectedAssignment(assignment)}
                          className="px-4 py-2.5 bg-olive text-white text-sm font-medium rounded-lg hover:bg-olive-dark"
                        >
                          Submit assignment
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <SubmissionModal
        isOpen={Boolean(selectedAssignment)}
        onClose={() => setSelectedAssignment(null)}
        onConfirm={handleSubmission}
        assignmentTitle={selectedAssignment?.title || ""}
      />
    </DashboardLayout>
  );
}

export default MyAssignmentsPage;