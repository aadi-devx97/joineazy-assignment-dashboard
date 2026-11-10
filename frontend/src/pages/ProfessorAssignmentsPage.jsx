
import { useContext, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  X,
  CalendarDays,
  ExternalLink,
  ClipboardList,
  Users,
  User,
  Clock,
} from "lucide-react";

import { AppContext } from "../context/AppContextDefinition";
import DashboardLayout from "../components/layout/DashboardLayout";

const emptyForm = {
  courseId: "",
  title: "",
  description: "",
  deadline: "",
  oneDriveLink: "",
  submissionType: "individual",
};

function formatDeadline(value) {
  if (!value) return "No deadline";

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ProfessorAssignmentsPage() {
  const {
    currentUser,
    courses,
    assignments,
    setAssignments,
    groups,
  } = useContext(AppContext);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const professorCourses = useMemo(
    () =>
      courses.filter(
        (course) => course.professorId === currentUser?.id
      ),
    [courses, currentUser]
  );

  const professorAssignments = useMemo(
    () =>
      assignments
        .filter(
          (assignment) =>
            assignment.professorId === currentUser?.id
        )
        .sort(
          (a, b) =>
            new Date(a.deadline) - new Date(b.deadline)
        ),
    [assignments, currentUser]
  );

  const getCourse = (courseId) =>
    courses.find((course) => course.id === courseId);

  const getCourseName = (courseId) => {
    const course = getCourse(courseId);
    return course?.title || course?.name || "Unknown course";
  };

  const getAcknowledgementCount = (assignment) => {
    const acknowledgements = assignment.acknowledgements || {};

    if (assignment.submissionType === "group") {
      return groups
        .filter((group) => group.courseId === assignment.courseId)
        .reduce((total, group) => {
          const acknowledged =
            acknowledgements[group.id]?.acknowledged;

          return total + (
            acknowledged ? group.members?.length || 0 : 0
          );
        }, 0);
    }

    return Object.values(acknowledgements).filter(
      (item) => item?.acknowledged
    ).length;
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      courseId: professorCourses[0]?.id || "",
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (assignment) => {
    setEditingId(assignment.id);

    setForm({
      courseId: assignment.courseId || "",
      title: assignment.title || "",
      description: assignment.description || "",
      deadline: assignment.deadline
        ? new Date(assignment.deadline)
            .toISOString()
            .slice(0, 16)
        : "",
      oneDriveLink: assignment.oneDriveLink || "",
      submissionType: assignment.submissionType || "individual",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.courseId ||
      !form.title.trim() ||
      !form.description.trim() ||
      !form.deadline ||
      !form.oneDriveLink.trim()
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (new Date(form.deadline).getTime() <= Date.now()) {
      setError("Please select a future deadline.");
      return;
    }

    try {
      const link = new URL(form.oneDriveLink.trim());

      if (!["http:", "https:"].includes(link.protocol)) {
        setError("Please enter a valid OneDrive URL.");
        return;
      }
    } catch {
      setError("Please enter a valid OneDrive URL.");
      return;
    }

    const assignmentData = {
      courseId: form.courseId,
      professorId: currentUser.id,
      title: form.title.trim(),
      description: form.description.trim(),
      deadline: new Date(form.deadline).toISOString(),
      oneDriveLink: form.oneDriveLink.trim(),
      submissionType: form.submissionType,
    };

    if (editingId) {
      setAssignments((previous) =>
        previous.map((assignment) =>
          assignment.id === editingId
            ? { ...assignment, ...assignmentData }
            : assignment
        )
      );

      setSuccess("Assignment updated successfully.");
    } else {
      const newAssignment = {
        id: crypto.randomUUID(),
        ...assignmentData,
        acknowledgements: {},
        createdAt: new Date().toISOString(),
      };

      setAssignments((previous) => [
        ...previous,
        newAssignment,
      ]);

      setSuccess("Assignment created successfully.");
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <DashboardLayout
      title="Assignments"
      description="Create and manage assignments for your courses."
    >
      {/* Page heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
        <div>
          <h2 className="text-xl font-semibold">
            Assignment Management
          </h2>
          <p className="text-sm text-muted mt-1">
            Manage deadlines, resources and student acknowledgement progress.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          disabled={professorCourses.length === 0}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-olive text-white text-sm font-medium rounded-lg hover:bg-olive-dark disabled:opacity-50"
        >
          <Plus size={18} />
          Create Assignment
        </button>
      </div>

      {success && (
        <div
          className="mb-5 p-4 rounded-lg bg-olive/10 text-olive text-sm"
          role="status"
        >
          {success}
        </div>
      )}

      {/* Assignment list */}
      {professorCourses.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl py-16 px-5 text-center">
          <ClipboardList
            size={36}
            className="mx-auto text-muted mb-4"
          />
          <h3 className="font-semibold">
            No courses available
          </h3>
          <p className="text-sm text-muted mt-2">
            You need a course before creating an assignment.
          </p>
        </div>
      ) : professorAssignments.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl py-16 px-5 text-center">
          <ClipboardList
            size={36}
            className="mx-auto text-muted mb-4"
          />
          <h3 className="font-semibold">
            No assignments yet
          </h3>
          <p className="text-sm text-muted mt-2">
            Create your first assignment to get started.
          </p>

          <button
            type="button"
            onClick={openCreateForm}
            className="mt-5 inline-flex items-center gap-2 px-5 py-3 bg-olive text-white text-sm font-medium rounded-lg hover:bg-olive-dark"
          >
            <Plus size={17} />
            Create Assignment
          </button>
        </div>
      ) : (
        <section className="space-y-4">
          {professorAssignments.map((assignment) => {
            const course = getCourse(assignment.courseId);
            const totalStudents = course?.studentIds?.length || 0;
            const acknowledged =
              getAcknowledgementCount(assignment);

            const progress = totalStudents
              ? Math.min(
                  100,
                  Math.round(
                    (acknowledged / totalStudents) * 100
                  )
                )
              : 0;

            const overdue =
              new Date(assignment.deadline) < new Date();

            return (
              <article
                key={assignment.id}
                className="bg-surface border border-border rounded-xl p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-olive mb-2">
                      {getCourseName(assignment.courseId)}
                    </p>

                    <h3 className="text-lg font-semibold">
                      {assignment.title}
                    </h3>

                    <p className="text-sm text-muted mt-2">
                      {assignment.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => openEditForm(assignment)}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-canvas"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-3 mt-5 text-sm text-muted">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={16} />
                    {formatDeadline(assignment.deadline)}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    {assignment.submissionType === "group" ? (
                      <Users size={16} />
                    ) : (
                      <User size={16} />
                    )}

                    {assignment.submissionType === "group"
                      ? "Group submission"
                      : "Individual submission"}
                  </span>

                  {assignment.oneDriveLink && (
                    <a
                      href={assignment.oneDriveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-olive hover:underline"
                    >
                      <ExternalLink size={15} />
                      OneDrive resource
                    </a>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-sm font-medium">
                      Acknowledgement progress
                    </p>
                    <p className="text-sm text-muted">
                      {acknowledged} / {totalStudents}
                    </p>
                  </div>

                  <div
                    className="w-full h-2 bg-canvas rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className="h-full bg-olive rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {overdue && (
                    <p className="inline-flex items-center gap-2 mt-3 text-xs font-medium text-terracotta">
                      <Clock size={14} />
                      Deadline passed
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Create / Edit modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-surface border border-border rounded-xl shadow-xl p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="assignment-form-title"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2
                  id="assignment-form-title"
                  className="text-xl font-semibold"
                >
                  {editingId ? "Edit Assignment" : "Create Assignment"}
                </h2>
                <p className="text-sm text-muted mt-1">
                  Enter the assignment details below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg hover:bg-canvas"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="courseId"
                  className="block text-sm font-medium mb-2"
                >
                  Course
                </label>

                <select
                  id="courseId"
                  name="courseId"
                  value={form.courseId}
                  onChange={handleChange}
                  required
                  className="w-full bg-canvas border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-olive"
                >
                  <option value="">Select a course</option>
                  {professorCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title || course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-2"
                >
                  Assignment title
                </label>

                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Build a React application"
                  maxLength={100}
                  required
                  className="w-full bg-canvas border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-olive"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-2"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Explain the assignment requirements..."
                  rows={4}
                  required
                  className="w-full bg-canvas border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-olive resize-y"
                />
              </div>

              <div>
                <label
                  htmlFor="deadline"
                  className="block text-sm font-medium mb-2"
                >
                  Deadline
                </label>

                <input
                  id="deadline"
                  name="deadline"
                  type="datetime-local"
                  value={form.deadline}
                  onChange={handleChange}
                  required
                  className="w-full bg-canvas border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-olive"
                />
              </div>

              <div>
                <label
                  htmlFor="oneDriveLink"
                  className="block text-sm font-medium mb-2"
                >
                  OneDrive assignment link
                </label>

                <input
                  id="oneDriveLink"
                  name="oneDriveLink"
                  type="url"
                  value={form.oneDriveLink}
                  onChange={handleChange}
                  placeholder="https://..."
                  required
                  className="w-full bg-canvas border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-olive"
                />
              </div>

              <div>
                <label
                  htmlFor="submissionType"
                  className="block text-sm font-medium mb-2"
                >
                  Submission type
                </label>

                <select
                  id="submissionType"
                  name="submissionType"
                  value={form.submissionType}
                  onChange={handleChange}
                  className="w-full bg-canvas border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-olive"
                >
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                </select>
              </div>

              {error && (
                <p
                  className="p-3 rounded-lg bg-terracotta/10 text-terracotta text-sm"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-canvas"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-olive text-white rounded-lg text-sm font-medium hover:bg-olive-dark"
                >
                  {editingId ? "Save Changes" : "Create Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ProfessorAssignmentsPage;
