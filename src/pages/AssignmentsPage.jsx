import { useContext, useMemo, useState } from "react";
import {
  Search,
  ClipboardList,
  Pencil,
  Trash2,
  ExternalLink,
  Plus,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import AssignmentModal from "../components/dashboard/AssignmentModal";
import { AppContext } from "../context/AppContextDefinition";
import { mockUsers } from "../data/mockData";

function AssignmentsPage() {
  const { currentUser, assignments, setAssignments } =
    useContext(AppContext);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("nearest");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const students = mockUsers.filter(
    (user) => user.role === "student"
  );

  const myAssignments = assignments.filter(
    (assignment) => assignment.createdBy === currentUser.id
  );

  // Search, filter and sort
  const filteredAssignments = useMemo(() => {
    let result = [...myAssignments];

    if (search.trim()) {
      result = result.filter((assignment) =>
        assignment.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((assignment) => {
        const assignedStudents = assignment.assignedTo || [];

        const submittedCount = assignedStudents.filter(
          (studentId) =>
            assignment.submissions?.[studentId]?.status === "submitted"
        ).length;

        const pendingCount = assignedStudents.length - submittedCount;

        if (statusFilter === "pending") return pendingCount > 0;
        if (statusFilter === "submitted") {
          return assignedStudents.length > 0 && pendingCount === 0;
        }

        return true;
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
  }, [myAssignments, search, statusFilter, sortOrder]);

  const handleCreate = () => {
    setEditingAssignment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleSave = (formData) => {
    if (editingAssignment) {
      setAssignments((previous) =>
        previous.map((assignment) => {
          if (assignment.id !== editingAssignment.id) return assignment;

          const updatedSubmissions = {};

          formData.assignedTo.forEach((studentId) => {
            updatedSubmissions[studentId] =
              assignment.submissions?.[studentId] || {
                status: "pending",
                submittedAt: null,
              };
          });

          return {
            ...assignment,
            ...formData,
            submissions: updatedSubmissions,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    } else {
      const submissions = {};

      formData.assignedTo.forEach((studentId) => {
        submissions[studentId] = {
          status: "pending",
          submittedAt: null,
        };
      });

      setAssignments((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          ...formData,
          createdBy: currentUser.id,
          createdAt: new Date().toISOString(),
          submissions,
        },
      ]);
    }

    setIsModalOpen(false);
    setEditingAssignment(null);
  };

  const handleDelete = (assignmentId) => {
    if (!window.confirm("Delete this assignment permanently?")) return;

    setAssignments((previous) =>
      previous.filter(
        (assignment) =>
          !(
            assignment.id === assignmentId &&
            assignment.createdBy === currentUser.id
          )
      )
    );
  };

  return (
    <DashboardLayout
      title="Assignments"
      description="Create, organize and monitor your assignments."
    >
      {/* Page heading */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
        <div>
          <h2 className="text-xl font-semibold">
            Manage Assignments
          </h2>
          <p className="text-sm text-muted mt-1">
            {myAssignments.length} assignments created by you.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 bg-olive text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-olive-dark"
        >
          <Plus size={18} />
          Create Assignment
        </button>
      </section>

      {/* Search and filters */}
      <section className="bg-surface border border-border rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-1">
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
            <option value="pending">Pending submissions</option>
            <option value="submitted">Fully submitted</option>
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
          <h3 className="font-semibold text-lg">
            Your Assignments
          </h3>
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
                : "Create your first assignment to get started."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredAssignments.map((assignment) => {
              const assignedStudents = students.filter(
                (student) =>
                  assignment.assignedTo?.includes(student.id)
              );

              const submittedCount = assignedStudents.filter(
                (student) =>
                  assignment.submissions?.[student.id]?.status === "submitted"
              ).length;

              const pendingCount =
                assignedStudents.length - submittedCount;

              const completion =
                assignedStudents.length > 0
                  ? Math.round(
                      (submittedCount / assignedStudents.length) * 100
                    )
                  : 0;

              const isOverdue =
                new Date(`${assignment.dueDate}T23:59:59`) < new Date() &&
                pendingCount > 0;

              return (
                <article key={assignment.id} className="p-5">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="font-semibold">
                        {assignment.title}
                      </h4>

                      <p className="text-sm text-muted mt-1">
                        {assignment.description}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted">
                        <span>
                          Due: {assignment.dueDate}
                        </span>

                        <span>
                          {assignedStudents.length} students
                        </span>

                        <a
                          href={assignment.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-olive hover:underline"
                        >
                          Drive link
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isOverdue && (
                        <span className="text-xs bg-terracotta/10 text-terracotta px-2 py-1 rounded-full">
                          Overdue
                        </span>
                      )}

                      <button
                        onClick={() => handleEdit(assignment)}
                        aria-label="Edit assignment"
                        className="p-2 border border-border rounded-lg hover:bg-canvas"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(assignment.id)}
                        aria-label="Delete assignment"
                        className="p-2 border border-border rounded-lg text-terracotta hover:bg-terracotta/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted">
                        Submission progress
                      </span>

                      <span className="font-medium">
                        {submittedCount}/{assignedStudents.length} submitted
                        · {completion}%
                      </span>
                    </div>

                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-olive rounded-full"
                        style={{ width: `${completion}%` }}
                      />
                    </div>

                    <p className="text-xs text-muted mt-2">
                      {pendingCount} pending submissions
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {isModalOpen && (
        <AssignmentModal
          key={editingAssignment?.id || "new"}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAssignment(null);
          }}
        onSave={handleSave}
        editingAssignment={editingAssignment}
        />
      )}
    </DashboardLayout>
  );
}

export default AssignmentsPage;