import { useContext } from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  ClipboardList,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import { AppContext } from "../context/AppContextDefinition";
import { mockUsers } from "../data/mockData";

function StudentsPage() {
  const { currentUser, assignments } = useContext(AppContext);

  const students = mockUsers.filter(
    (user) => user.role === "student"
  );

  // Only assignments created by the logged-in admin
  const myAssignments = assignments.filter(
    (assignment) => assignment.createdBy === currentUser.id
  );

  const studentProgress = students.map((student) => {
    // Only count assignments assigned to this student
    const assignedAssignments = myAssignments.filter(
      (assignment) => assignment.assignedTo?.includes(student.id)
    );

    const submitted = assignedAssignments.filter(
      (assignment) =>
        assignment.submissions?.[student.id]?.status === "submitted"
    ).length;

    const pending = assignedAssignments.length - submitted;

    const percentage =
      assignedAssignments.length > 0
        ? Math.round((submitted / assignedAssignments.length) * 100)
        : 0;

    return {
      ...student,
      total: assignedAssignments.length,
      submitted,
      pending,
      percentage,
    };
  });

  const totalAssigned = studentProgress.reduce(
    (total, student) => total + student.total,
    0
  );

  const totalSubmitted = studentProgress.reduce(
    (total, student) => total + student.submitted,
    0
  );

  const totalPending = totalAssigned - totalSubmitted;

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
      label: "Submitted",
      value: totalSubmitted,
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
      description="Monitor individual student performance and assignment progress."
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
                <p className="text-sm text-muted">{item.label}</p>

                <div className="w-9 h-9 flex items-center justify-center bg-olive/10 text-olive rounded-lg">
                  <Icon size={19} />
                </div>
              </div>

              <p className="text-3xl font-semibold">{item.value}</p>
            </div>
          );
        })}
      </section>

      {/* Student list */}
      <section className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="text-lg font-semibold">Student Overview</h3>

          <p className="text-sm text-muted mt-1">
            Individual assignment completion and submission status.
          </p>
        </div>

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

                <div>
                  <h4 className="font-semibold">{student.name}</h4>
                  <p className="text-xs text-muted">{student.email}</p>
                </div>
              </div>

              {/* Assignment statistics */}
              <div className="flex items-center gap-6 lg:w-1/4">
                <div>
                  <p className="text-xs text-muted">Assigned</p>
                  <p className="font-semibold mt-1">{student.total}</p>
                </div>

                <div>
                  <p className="text-xs text-muted">Submitted</p>
                  <p className="font-semibold text-olive mt-1">
                    {student.submitted}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted">Pending</p>
                  <p className="font-semibold text-terracotta mt-1">
                    {student.pending}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted">
                    Completion progress
                  </span>

                  <span className="text-sm font-medium">
                    {student.percentage}%
                  </span>
                </div>

                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-olive rounded-full transition-all"
                    style={{ width: `${student.percentage}%` }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default StudentsPage;