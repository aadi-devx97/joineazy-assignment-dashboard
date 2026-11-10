
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const {
    currentUser,
    courses,
    assignments,
    setAssignments,
    users,
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

  const getCourseName = (courseId) =>
    courses.find((course) => course.id === courseId)?.name ||
    courses.find((course) => course.id === courseId)?.title ||
    "Unknown course";

  const getCourseStudentCount = (courseId) => {
    const course = courses.find((item) => item.id === courseId);
    return course?.studentIds?.length || 0;
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

    if (Number.isNaN(new Date(form.deadline).getTime())) {
      setError("Please enter a valid deadline.");
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
    setForm(emptyForm);
    setEditingId(null);
  };

  const getAcknowledgementCount = (assignment) => {
    const acknowledgements = assignment.acknowledgements || {};

    if (assignment.submissionType === "group") {
      return Object.keys(acknowledgements).length;
    }

    return Object.keys(acknowledgements).filter(
      (studentId) => acknowledgements[studentId]?.acknowledged
    ).length;
  };

  const isOverdue = (deadline) =>
    new Date(deadline).getTime() < Date.now();

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1>Assignments</h1>
            <p>Create and manage assignments for your courses.</p>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={openCreateForm}
            disabled={professorCourses.length === 0}
          >
            <Plus size={18} />
            Create Assignment
          </button>
        </div>

        {success && (
          <div className="success-message" role="status">
            {success}
          </div>
        )}

        {professorCourses.length === 0 ? (
          <div className="empty-state">
            <ClipboardList size={40} />
            <h3>No courses available</h3>
            <p>You need a course before creating an assignment.</p>
          </div>
        ) : professorAssignments.length === 0 ? (
          <div className="empty-state">
            <ClipboardList size={40} />
            <h3>No assignments yet</h3>
            <p>Create your first assignment to get started.</p>
          </div>
        ) : (
          <div className="assignment-list">
            {professorAssignments.map((assignment) => {
              const totalStudents = getCourseStudentCount(
                assignment.courseId
              );

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

              return (
                <article
                  className="assignment-card"
                  key={assignment.id}
                >
                  <div className="assignment-card-header">
                    <div>
                      <span className="course-label">
                        {getCourseName(assignment.courseId)}
                      </span>

                      <h3>{assignment.title}</h3>
                    </div>

                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => openEditForm(assignment)}
                      aria-label={`Edit ${assignment.title}`}
                      title="Edit assignment"
                    >
                      <Pencil size={17} />
                    </button>
                  </div>

                  <p className="assignment-description">
                    {assignment.description}
                  </p>

                  <div className="assignment-meta">
                    <span>
                      <CalendarDays size={16} />
                      {formatDeadline(assignment.deadline)}
                    </span>

                    <span>
                      {assignment.submissionType === "group" ? (
                        <Users size={16} />
                      ) : (
                        <User size={16} />
                      )}
                      {assignment.submissionType === "group"
                        ? "Group submission"
                        : "Individual submission"}
                    </span>

                    <a
                      href={assignment.oneDriveLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink size={15} />
                      OneDrive
                    </a>
                  </div>

                  <div className="assignment-progress">
                    <div className="progress-heading">
                      <span>Acknowledgement progress</span>
                      <strong>
                        {acknowledged} / {totalStudents}
                      </strong>
                    </div>

                    <div
                      className="progress-track"
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-label="Acknowledgement progress"
                    >
                      <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {isOverdue(assignment.deadline) && (
                    <span className="overdue-label">
                      <Clock size={14} />
                      Deadline passed
                    </span>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {showForm && (
          <div
            className="modal-overlay"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowForm(false);
              }
            }}
          >
            <div
              className="modal-content"
              role="dialog"
              aria-modal="true"
              aria-labelledby="assignment-form-title"
            >
              <div className="modal-header">
                <div>
                  <h2 id="assignment-form-title">
                    {editingId
                      ? "Edit Assignment"
                      : "Create Assignment"}
                  </h2>
                  <p>
                    Fill in the details for your students.
                  </p>
                </div>

                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setShowForm(false)}
                  aria-label="Close form"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="courseId">Course</label>
                  <select
                    id="courseId"
                    name="courseId"
                    value={form.courseId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a course</option>

                    {professorCourses.map((course) => (
                      <option
                        key={course.id}
                        value={course.id}
                      >
                        {course.name || course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="title">Assignment title</label>
                  <input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Build a React application"
                    maxLength={100}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Explain the assignment requirements..."
                    rows={4}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="deadline">Deadline</label>
                  <input
                    id="deadline"
                    name="deadline"
                    type="datetime-local"
                    value={form.deadline}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="oneDriveLink">
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
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="submissionType">
                    Submission type
                  </label>
                  <select
                    id="submissionType"
                    name="submissionType"
                    value={form.submissionType}
                    onChange={handleChange}
                  >
                    <option value="individual">
                      Individual
                    </option>
                    <option value="group">Group</option>
                  </select>
                </div>

                {error && (
                  <p className="error-message" role="alert">
                    {error}
                  </p>
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingId
                      ? "Save Changes"
                      : "Create Assignment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ProfessorAssignmentsPage;
