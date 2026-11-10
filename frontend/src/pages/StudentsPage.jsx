
import { useContext, useMemo } from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  ClipboardList,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import { AppContext } from "../context/AppContextDefinition";

function StudentsPage() {
  const {
    currentUser,
    users,
    courses,
    assignments,
    groups,
  } = useContext(AppContext);

  // Courses taught by the logged-in professor.
  const professorCourses = useMemo(
    () =>
      courses.filter(
        (course) => course.professorId === currentUser.id
      ),
    [courses, currentUser]
  );

  const courseIds = professorCourses.map(
    (course) => course.id
  );

  // Only students enrolled in the professor's courses.
  const students = useMemo(() => {
    const enrolledStudentIds = new Set(
      professorCourses.flatMap(
        (course) => course.studentIds || []
      )
    );

    return users.filter(
      (user) =>
        user.role === "student" &&
        enrolledStudentIds.has(user.id)
    );
  }, [users, professorCourses]);

  // Assignments belonging to the professor's courses.
  const professorAssignments = useMemo(
    () =>
      assignments.filter((assignment) =>
        courseIds.includes(assignment.courseId)
      ),
    [assignments, courseIds]
  );

  const getStudentProgress = (student) => {
    const enrolledCourseIds = professorCourses
      .filter((course) =>
        course.studentIds?.includes(student.id)
      )
      .map((course) => course.id);

    const applicableAssignments = professorAssignments.filter(
      (assignment) =>
        enrolledCourseIds.includes(assignment.courseId)
    );

    let acknowledged = 0;

    applicableAssignments.forEach((assignment) => {
      const acknowledgements =
        assignment.acknowledgements || {};

      if (assignment.submissionType === "group") {
        const group = groups.find(
          (item) =>
            item.courseId === assignment.courseId &&
            item.members?.includes(student.id)
        );

        if (
          group &&
          acknowledgements[group.id]?.acknowledged
        ) {
          acknowledged += 1;
        }
      } else if (
        acknowledgements[student.id]?.acknowledged
      ) {
        acknowledged += 1;
      }
    });

    const total = applicableAssignments.length;
    const pending = total - acknowledged;

    const percentage = total
      ? Math.round((acknowledged / total) * 100)
      : 0;

    return {
      total,
      acknowledged,
      pending,
      percentage,
    };
  };

  const studentProgress = students.map((student) => ({
    ...student,
    ...getStudentProgress(student),
  }));

  const totalAssigned = studentProgress.reduce(
    (total, student) => total + student.total,
    0
  );

  const totalAcknowledged = studentProgress.reduce(
    (total, student) => total + student.acknowledged,
    0
  );

  const totalPending = totalAssigned - totalAcknowledged;

  const summary = [
    {
      label: "Total Students",
      value: students.length,
      icon: Users,
    },
    {
      label: "Assigned Tasks",
      value: totalAssigned,
      icon: ClipboardList,
    },
    {
      label: "Acknowledged",
      value: totalAcknowledged,
      icon: CheckCircle2,
    },
    {
      label: "Pending",
      value: totalPending,
      icon: Clock,
    },
  ];

  return (
    <DashboardLayout
      title="Students"
      description="Monitor student acknowledgement progress across your courses."
    >
      {/* Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {summary.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="bg-surface border border-border rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-muted">
                  {item.label}
                </p>

                <div className="w-9 h-9 flex items-center justify-center bg-olive/10 text-olive rounded-lg">
                  <Icon size={19} />
                </div>
              </div>

              <p className="text-3xl font-semibold">
                {item.value}
              </p>
            </div>
          );
        })}
      </section>

      {/* Student list */}
      <section className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="text-lg font-semibold">
            Student Overview
          </h3>

          <p className="text-sm text-muted mt-1">
            Individual student acknowledgement and assignment progress.
          </p>
        </div>

        {studentProgress.length === 0 ? (
          <div className="py-16 px-5 text-center">
            <Users
              size={35}
              className="mx-auto text-muted mb-4"
            />

            <h4 className="font-semibold">
              No students enrolled
            </h4>

            <p className="text-sm text-muted mt-2">
              Students enrolled in your courses will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {studentProgress.map((student) => (
              <article
                key={student.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center gap-5"
              >
                {/* Student identity */}
                <div className="flex items-center gap-3 lg:w-1/4">
                  <div className="w-11 h-11 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center font-semibold">
                    {student.name.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-semibold">
                      {student.name}
                    </h4>

                    <p className="text-xs text-muted truncate">
                      {student.email}
                    </p>
                  </div>
                </div>

                {/* Assignment statistics */}
                <div className="flex items-center gap-6 lg:w-1/4">
                  <div>
                    <p className="text-xs text-muted">
                      Assigned
                    </p>
                    <p className="font-semibold mt-1">
                      {student.total}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted">
                      Acknowledged
                    </p>
                    <p className="font-semibold text-olive mt-1">
                      {student.acknowledged}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted">
                      Pending
                    </p>
                    <p className="font-semibold text-terracotta mt-1">
                      {student.pending}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted">
                      Acknowledgement progress
                    </span>

                    <span className="text-sm font-medium">
                      {student.percentage}%
                    </span>
                  </div>

                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-olive rounded-full transition-all"
                      style={{
                        width: `${student.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

export default StudentsPage;
