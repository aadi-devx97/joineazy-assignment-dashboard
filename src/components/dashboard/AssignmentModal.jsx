
import { useState } from "react";
import { X, Users, CalendarDays, Link as LinkIcon } from "lucide-react";
import { mockUsers } from "../../data/mockData";

function AssignmentModal({
  isOpen,
  onClose,
  onSave,
  editingAssignment = null,
}) {
  const students = mockUsers.filter((user) => user.role === "student");

  const [formData, setFormData] = useState(() =>
    editingAssignment
      ? {
          title: editingAssignment.title,
          description: editingAssignment.description,
          dueDate: editingAssignment.dueDate,
          driveLink: editingAssignment.driveLink,
          assignedTo: "selected",
        }
      : {
          title: "",
          description: "",
          dueDate: "",
          driveLink: "",
          assignedTo: "all",
        }
  );

  const [selectedStudents, setSelectedStudents] = useState(
    () => editingAssignment?.assignedTo || []
  );

  const [formError, setFormError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormError("");

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const toggleStudent = (studentId) => {
    setFormError("");

    setSelectedStudents((previous) =>
      previous.includes(studentId)
        ? previous.filter((id) => id !== studentId)
        : [...previous, studentId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      formData.assignedTo === "selected" &&
      selectedStudents.length === 0
    ) {
      setFormError("Please select at least one student.");
      return;
    }

    setFormError("");

    onSave({
      ...formData,
      assignedTo:
        formData.assignedTo === "all"
          ? students.map((student) => student.id)
          : selectedStudents,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="assignment-modal-title"
        className="bg-surface text-ink w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 id="assignment-modal-title" className="text-xl font-semibold">
              {editingAssignment ? "Edit Assignment" : "Create Assignment"}
            </h2>

            <p className="text-sm text-muted mt-1">
              Fill in the assignment details below.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-lg hover:bg-canvas"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              Assignment Title *
            </label>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={100}
              placeholder="e.g. React Fundamentals Project"
              className="w-full bg-canvas border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-olive"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              maxLength={1000}
              placeholder="Describe what students need to complete..."
              className="w-full bg-canvas border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-olive resize-y"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <CalendarDays size={16} />
              Due Date *
            </label>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={new Date().toLocaleDateString("en-CA")}
              required
              className="w-full bg-canvas border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-olive"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <LinkIcon size={16} />
              Google Drive Link *
            </label>

            <input
              type="url"
              name="driveLink"
              value={formData.driveLink}
              onChange={handleChange}
              required
              placeholder="https://drive.google.com/..."
              className="w-full bg-canvas border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-olive"
            />
          </div>

          {/* Student assignment */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-3">
              <Users size={17} />
              Assign To *
            </label>

            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="assignedTo"
                  value="all"
                  checked={formData.assignedTo === "all"}
                  onChange={handleChange}
                  className="accent-[#66745A]"
                />
                All students
              </label>

              <label className="flex items-center gap-3 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="assignedTo"
                  value="selected"
                  checked={formData.assignedTo === "selected"}
                  onChange={handleChange}
                  className="accent-[#66745A]"
                />
                Select specific students
              </label>
            </div>

            {formData.assignedTo === "selected" && (
              <div className="mt-4 p-4 bg-canvas border border-border rounded-lg space-y-3">
                {students.map((student) => (
                  <label
                    key={student.id}
                    className="flex items-center gap-3 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      className="accent-[#66745A]"
                    />

                    <span>{student.name}</span>
                  </label>
                ))}
              </div>
            )}

            {formError && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {formError}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-canvas"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-olive text-white text-sm font-medium hover:bg-olive-dark"
            >
              {editingAssignment ? "Save Changes" : "Create Assignment"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AssignmentModal;
