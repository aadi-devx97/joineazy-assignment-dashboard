
import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ExternalLink,
  FileText,
  Users,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import { AppContext } from "../context/AppContextDefinition";

function CourseDetailPage() {
  const { courseId } = useParams();

  const {
    currentUser,
    courses,
    users,
    assignments,
    groups,
  } = useContext(AppContext);

  const isProfessor = currentUser.role === "professor";

  const course = courses.find(
    (item) => item.id === courseId
  );

  if (!course) {
    return (
      <DashboardLayout
        title="Course not found"
        description="This course may no longer be available."
      >
        <Link
          to={isProfessor ? "/professor/courses" : "/student/courses"}
          className="inline-flex items-center gap-2 text-sm text-olive hover:underline"
        >
          <ArrowLeft size={16} />
          Back to courses
        </Link>
      </DashboardLayout>
    );
  }

  const professor = users.find(
    (user) => user.id === course.professorId
  );

  const students = users.filter(
    (user) => course.studentIds?.includes(user.id)
  );

  const courseAssignments = assignments.filter(
    (assignment) => assignment.courseId === course.id
  );

  const courseGroups = groups.filter(
    (group) => group.courseId === course.id
  );

  const backPath = isProfessor
    ? "/professor/courses"
    : "/student/courses";

  const assignmentPath = isProfessor
    ? "/professor/assignments"
    : "/student/assignments";

  return (
    <DashboardLayout
      title={course.title}
      description={`${course.code} · Course workspace`}
    >
      <Link
        to={backPath}
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-olive mb-6"
      >
        <ArrowLeft size={16} />
        Back to courses
      </Link>

      {/* Course information */}
      <section className="bg-surface border border-border rounded-xl p-6 mb-7">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 shrink-0 rounded-xl bg-olive/10 text-olive flex items-center justify-center">
            <BookOpen size={24} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-terracotta mb-2">
              {course.code}
            </p>

            <h2 className="text-xl font-semibold">
              {course.title}
            </h2>

            <p className="text-sm text-muted mt-2">
              {course.description}
            </p>

            {!isProfessor && (
              <p className="text-sm text-muted mt-3">
                Professor: {professor?.name || "Not assigned"}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Course statistics */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted mb-3">
            <FileText size={18} />
            <span className="text-sm">Assignments</span>
          </div>
          <p className="text-2xl font-semibold">
            {courseAssignments.length}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted mb-3">
            <Users size={18} />
            <span className="text-sm">Students</span>
          </div>
          <p className="text-2xl font-semibold">
            {students.length}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted mb-3">
            <Users size={18} />
            <span className="text-sm">Groups</span>
          </div>
          <p className="text-2xl font-semibold">
            {courseGroups.length}
          </p>
        </div>
      </section>

      {/* Enrolled students */}
      {isProfessor && (
        <section className="bg-surface border border-border rounded-xl p-5 mb-7">
          <h3 className="font-semibold mb-4">
            Enrolled Students
          </h3>

          {students.length === 0 ? (
            <p className="text-sm text-muted">
              No students are enrolled in this course.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 p-3 bg-canvas rounded-lg"
                >
                  <div className="w-9 h-9 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center font-semibold">
                    {student.name.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {student.name}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {student.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Assignments */}
      <section className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-lg">
              Course Assignments
            </h3>
            <p className="text-sm text-muted mt-1">
              Assignments associated with this course.
            </p>
          </div>

          <Link
            to={assignmentPath}
            className="text-sm font-medium text-olive hover:underline whitespace-nowrap"
          >
            View all
          </Link>
        </div>

        {courseAssignments.length === 0 ? (
          <div className="py-12 px-5 text-center">
            <FileText
              size={32}
              className="mx-auto text-muted mb-3"
            />

            <h4 className="font-medium">
              No assignments yet
            </h4>

            <p className="text-sm text-muted mt-2">
              {isProfessor
                ? "Assignments you create for this course will appear here."
                : "Your professor hasn't posted any assignments for this course yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {courseAssignments.map((assignment) => (
              <article
                key={assignment.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <h4 className="font-semibold">
                    {assignment.title}
                  </h4>

                  <p className="text-sm text-muted mt-1">
                    {assignment.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays size={14} />
                      {assignment.deadline
                        ? new Date(assignment.deadline).toLocaleString()
                        : "No deadline"}
                    </span>

                    <span className="capitalize">
                      {assignment.submissionType || "Individual"} submission
                    </span>
                  </div>
                </div>

                {assignment.oneDriveLink && (
                  <a
                    href={assignment.oneDriveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-olive hover:underline shrink-0"
                  >
                    Open resource
                    <ExternalLink size={15} />
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

export default CourseDetailPage;
