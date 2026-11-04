import { useContext, useState } from "react";
import {
  ClipboardList,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import AssignmentModal from "../components/dashboard/AssignmentModal";
import { AppContext } from "../context/AppContext";
import { mockUsers } from "../data/mockData";

function AdminDashboard() {
  const { currentUser, assignments, setAssignments } =
    useContext(AppContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const students = mockUsers.filter(
    (user) => user.role === "student"
  );

  // Only show assignments created by this admin
  const myAssignments = assignments.filter(
    (assignment) => assignment.createdBy === currentUser.id
  );

  const totalAssignments = myAssignments.length;

  const totalSubmissions = myAssignments.reduce(
    (total, assignment) =>
      total +
      Object.values(assignment.submissions || {}).filter(
        (submission) => submission.status === "submitted"
      ).length,
    0
  );

  const pendingSubmissions = myAssignments.reduce(
    (total, assignment) =>
      total +
      Object.values(assignment.submissions || {}).filter(
        (submission) => submission.status === "pending"
      ).length,
    0
  );

  const stats = [
    {
      label: "Total Assignments",
      value: totalAssignments,
      icon: ClipboardList,
    },
    {
      label: "Total Students",
      value: students.length,
      icon: Users,
    },
    {
      label: "Submissions",
      value: totalSubmissions,
      icon: CheckCircle2,
    },
    {
      label: "Pending Submissions",
      value: pendingSubmissions,
      icon: Clock,
    },
  ];

  // Open modal for creating
  const handleCreate = () => {
    setEditingAssignment(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  // Save new or edited assignment
  const handleSave = (formData) => {
    if (editingAssignment) {
      setAssignments((previous) =>
        previous.map((assignment) => {
          if (assignment.id !== editingAssignment.id) {
            return assignment;
          }

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

      const newAssignment = {
        id: crypto.randomUUID(),
        ...formData,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        submissions,
      };

      setAssignments((previous) => [
        ...previous,
        newAssignment,
      ]);
    }

    setIsModalOpen(false);
    setEditingAssignment(null);
  };

  // Delete assignment
  const handleDelete = (assignmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmed) return;

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
      title="Overview"
      description="Here's what's happening in your workspace."
    >
      {/* Welcome section */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-semibold">
            Good to see you, {currentUser.name.split(" ")[0]}!
          </h2>

          <p className="text-sm text-muted mt-1">
            Keep track of assignments and student progress.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 bg-olive text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-olive-dark transition-colors"
        >
          <Plus size={18} />
          Create Assignment
        </button>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-surface border border-border p-5 rounded-xl"
            >
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-muted">{stat.label}</p>

                <div className="w-9 h-9 flex items-center justify-center bg-olive/10 text-olive rounded-lg">
                  <Icon size={19} />
                </div>
              </div>

              <p className="text-3xl font-semibold tracking-tight">
                {stat.value}
              </p>
            </div>
          );
        })}
      </section>

      {/* Assignment management */}
      <section className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-lg">
            Assignment Management
          </h3>

          <p className="text-sm text-muted mt-1">
            Manage assignments and monitor individual student progress.
          </p>
        </div>

        {myAssignments.length === 0 ? (
          <div className="py-16 px-5 text-center">
            <ClipboardList
              size={35}
              className="mx-auto text-muted mb-4"
            />

            <h4 className="font-semibold">
              No assignments yet
            </h4>

            <p className="text-sm text-muted mt-2">
              Create your first assignment to get started.
            </p>

            <button
              onClick={handleCreate}
              className="mt-5 inline-flex items-center gap-2 bg-olive text-white px-4 py-2.5 rounded-lg text-sm hover:bg-olive-dark"
            >
              <Plus size={17} />
              Create Assignment
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {myAssignments.map((assignment) => {
              const assignedStudents = students.filter(
                (student) =>
                  assignment.assignedTo?.includes(student.id)
              );

              const submittedCount = assignedStudents.filter(
                (student) =>
                  assignment.submissions?.[student.id]?.status ===
                  "submitted"
              ).length;

              const completionRate =
                assignedStudents.length > 0
                  ? Math.round(
                      (submittedCount / assignedStudents.length) * 100
                    )
                  : 0;

              return (
                <article key={assignment.id} className="p-5">
                  {/* Assignment heading */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-base">
                        {assignment.title}
                      </h4>

                      <p className="text-sm text-muted mt-1">
                        {assignment.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted">
                        <span>Due: {assignment.dueDate}</span>

                        <span>
                          {assignedStudents.length} students assigned
                        </span>

                        <a
                          href={assignment.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-olive hover:underline"
                        >
                          Drive resource
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleEdit(assignment)}
                        aria-label="Edit assignment"
                        className="p-2 rounded-lg border border-border hover:bg-canvas"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(assignment.id)}
                        aria-label="Delete assignment"
                        className="p-2 rounded-lg border border-border text-terracotta hover:bg-terracotta/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Completion rate */}
                  <div className="mt-5">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted">
                        Class completion
                      </span>

                      <span className="font-medium">
                        {submittedCount}/{assignedStudents.length} submitted
                        ({completionRate}%)
                      </span>
                    </div>

                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-olive rounded-full transition-all"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Individual student statuses */}
                  <div className="mt-5 pt-4 border-t border-border">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
                      Student submissions
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {assignedStudents.map((student) => {
                        const isSubmitted =
                          assignment.submissions?.[student.id]?.status ===
                          "submitted";

                        return (
                          <div
                            key={student.id}
                            className="flex items-center justify-between gap-2 bg-canvas p-3 rounded-lg"
                          >
                            <span className="text-sm font-medium">
                              {student.name}
                            </span>

                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                isSubmitted
                                  ? "bg-olive/10 text-olive"
                                  : "bg-terracotta/10 text-terracotta"
                              }`}
                            >
                              {isSubmitted ? "Submitted" : "Pending"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Assignment modal */}
      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAssignment(null);
        }}
        onSave={handleSave}
        editingAssignment={editingAssignment}
      />
    </DashboardLayout>
  );
}

export default AdminDashboard;