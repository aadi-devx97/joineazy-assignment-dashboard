
import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  ExternalLink,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import { AppContext } from "../context/AppContextDefinition";

function AdminDashboard() {
  const navigate = useNavigate();

  const {
    currentUser,
    courses,
    assignments,
    groups,
  } = useContext(AppContext);

  const professorCourses = useMemo(
    () =>
      courses.filter(
        (course) => course.professorId === currentUser.id
      ),
    [courses, currentUser]
  );

  const courseIds = professorCourses.map((course) => course.id);

  const students = useMemo(() => {
    const studentIds = new Set(
      professorCourses.flatMap(
        (course) => course.studentIds || []
      )
    );

    return studentIds;
  }, [professorCourses]);

  const myAssignments = useMemo(
    () =>
      assignments.filter(
        (assignment) =>
          assignment.professorId === currentUser.id
      ),
    [assignments, currentUser]
  );

  const getCourseName = (courseId) => {
    const course = courses.find(
      (item) => item.id === courseId
    );

    return course?.title || course?.name || "Unknown course";
  };

  const getAcknowledgedStudents = (assignment) => {
    const acknowledgements = assignment.acknowledgements || {};

    if (assignment.submissionType === "group") {
      const courseGroups = groups.filter(
        (group) => group.courseId === assignment.courseId
      );

      return courseGroups.reduce((total, group) => {
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

  const totalAcknowledged = myAssignments.reduce(
    (total, assignment) =>
      total + getAcknowledgedStudents(assignment),
    0
  );

  const totalExpected = myAssignments.reduce(
    (total, assignment) => {
      const course = courses.find(
        (item) => item.id === assignment.courseId
      );

      return total + (course?.studentIds?.length || 0);
    },
    0
  );

  const totalPending = Math.max(
    0,
    totalExpected - totalAcknowledged
  );

  const stats = [
    {
      label: "Total Assignments",
      value: myAssignments.length,
      icon: ClipboardList,
    },
    {
      label: "Total Students",
      value: students.size,
      icon: Users,
    },
    {
      label: "Acknowledged",
      value: totalAcknowledged,
      icon: CheckCircle2,
    },
    {
      label: "Pending Acknowledgements",
      value: totalPending,
      icon: Clock,
    },
  ];

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
            Keep track of your courses, assignments and student progress.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/professor/assignments")}
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

      {/* Assignment overview */}
      <section className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-lg">
            Assignment Overview
          </h3>

          <p className="text-sm text-muted mt-1">
            Monitor acknowledgement progress across your courses.
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
              type="button"
              onClick={() => navigate("/professor/assignments")}
              className="mt-5 inline-flex items-center gap-2 bg-olive text-white px-4 py-2.5 rounded-lg text-sm hover:bg-olive-dark"
            >
              <Plus size={17} />
              Create Assignment
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {myAssignments.map((assignment) => {
              const course = courses.find(
                (item) => item.id === assignment.courseId
              );

              const totalStudents =
                course?.studentIds?.length || 0;

              const acknowledged =
                getAcknowledgedStudents(assignment);

              const pending = Math.max(
                0,
                totalStudents - acknowledged
              );

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
                <article key={assignment.id} className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-olive mb-2">
                        {getCourseName(assignment.courseId)}
                      </p>

                      <h4 className="font-semibold text-base">
                        {assignment.title}
                      </h4>

                      <p className="text-sm text-muted mt-1">
                        {assignment.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted">
                        <span>
                          Deadline:{" "}
                          {assignment.deadline
                            ? new Date(
                                assignment.deadline
                              ).toLocaleString("en-IN")
                            : "Not set"}
                        </span>

                        <span>
                          {assignment.submissionType === "group"
                            ? "Group"
                            : "Individual"}{" "}
                          assignment
                        </span>

                        {overdue && (
                          <span className="text-terracotta font-medium">
                            Overdue
                          </span>
                        )}

                        {assignment.oneDriveLink && (
                          <a
                            href={assignment.oneDriveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-olive hover:underline"
                          >
                            Resource
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex flex-wrap justify-between gap-2 text-sm mb-2">
                      <span className="text-muted">
                        Student acknowledgement
                      </span>

                      <span className="font-medium">
                        {acknowledged} acknowledged · {pending} pending
                      </span>
                    </div>

                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-olive rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

export default AdminDashboard;
