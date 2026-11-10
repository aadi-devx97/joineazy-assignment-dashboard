
import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  ExternalLink,
  Users,
  User,
  CalendarDays,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import { AppContext } from "../context/AppContextDefinition";

function formatDeadline(value) {
  if (!value) return "No deadline";

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function StudentDashboard() {
  const navigate = useNavigate();

  const {
    currentUser,
    courses,
    assignments,
    groups,
  } = useContext(AppContext);

  const enrolledCourses = useMemo(
    () =>
      courses.filter((course) =>
        course.studentIds?.includes(currentUser.id)
      ),
    [courses, currentUser]
  );

  const courseIds = enrolledCourses.map((course) => course.id);

  const myAssignments = useMemo(
    () =>
      assignments
        .filter((assignment) =>
          courseIds.includes(assignment.courseId)
        )
        .sort(
          (a, b) =>
            new Date(a.deadline) - new Date(b.deadline)
        ),
    [assignments, courseIds]
  );

  const getAcknowledgementInfo = (assignment) => {
    const acknowledgements = assignment.acknowledgements || {};

    if (assignment.submissionType !== "group") {
      const acknowledgement = acknowledgements[currentUser.id];

      return {
        acknowledged: Boolean(acknowledgement?.acknowledged),
        acknowledgedAt: acknowledgement?.acknowledgedAt,
        message: acknowledgement?.acknowledged
          ? "Acknowledged"
          : "Pending acknowledgement",
      };
    }

    const group = groups.find(
      (item) =>
        item.courseId === assignment.courseId &&
        item.members?.includes(currentUser.id)
    );

    if (!group) {
      return {
        acknowledged: false,
        message: "Join or create a group",
      };
    }

    const acknowledgement = acknowledgements[group.id];

    return {
      acknowledged: Boolean(acknowledgement?.acknowledged),
      acknowledgedAt: acknowledgement?.acknowledgedAt,
      message: acknowledgement?.acknowledged
        ? "Group acknowledged"
        : group.leaderId === currentUser.id
          ? "Your group acknowledgement is pending"
          : "Waiting for group leader",
      groupName: group.name,
    };
  };

  const acknowledgedCount = myAssignments.filter(
    (assignment) =>
      getAcknowledgementInfo(assignment).acknowledged
  ).length;

  const pendingCount =
    myAssignments.length - acknowledgedCount;

  const progress =
    myAssignments.length > 0
      ? Math.round(
          (acknowledgedCount / myAssignments.length) * 100
        )
      : 0;

  const stats = [
    {
      label: "Total Assignments",
      value: myAssignments.length,
      icon: ClipboardList,
    },
    {
      label: "Acknowledged",
      value: acknowledgedCount,
      icon: CheckCircle2,
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: Clock,
    },
  ];

  return (
    <DashboardLayout
      title="My Dashboard"
      description="Your learning tasks, deadlines and acknowledgement progress."
    >
      {/* Welcome */}
      <section className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-terracotta mb-2">
          Student workspace
        </p>

        <h2 className="text-xl font-semibold">
          Ready to get things done,{" "}
          {currentUser.name.split(" ")[0]}?
        </h2>

        <p className="text-sm text-muted mt-2">
          Stay on top of your assignments and keep making progress.
        </p>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-surface border border-border rounded-xl p-5"
            >
              <div className="flex justify-between items-center mb-5">
                <p className="text-sm text-muted">
                  {stat.label}
                </p>
                <Icon size={20} className="text-olive" />
              </div>

              <p className="text-3xl font-semibold">
                {stat.value}
              </p>
            </div>
          );
        })}
      </section>

      {/* Overall progress */}
      <section className="bg-surface border border-border rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-3 gap-3">
          <div>
            <h3 className="font-semibold">
              Your overall progress
            </h3>

            <p className="text-sm text-muted mt-1">
              {acknowledgedCount} of {myAssignments.length} assignments acknowledged
            </p>
          </div>

          <span className="text-xl font-semibold text-olive">
            {progress}%
          </span>
        </div>

        <div
          className="w-full h-2.5 bg-border rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Assignment acknowledgement progress"
        >
          <div
            className="h-full bg-olive rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      {/* Assignments */}
      <section className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">
              My Assignments
            </h3>

            <p className="text-sm text-muted mt-1">
              Assignments from your enrolled courses.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/student/assignments")}
            className="text-sm font-medium text-olive hover:underline"
          >
            View all assignments
          </button>
        </div>

        {myAssignments.length === 0 ? (
          <div className="py-16 px-5 text-center">
            <ClipboardList
              size={35}
              className="mx-auto text-muted mb-4"
            />

            <h4 className="font-semibold">
              You're all caught up!
            </h4>

            <p className="text-sm text-muted mt-2">
              No assignments have been posted to your courses yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {myAssignments.map((assignment) => {
              const course = courses.find(
                (item) => item.id === assignment.courseId
              );

              const status = getAcknowledgementInfo(assignment);

              const overdue =
                new Date(assignment.deadline) < new Date();

              return (
                <article
                  key={assignment.id}
                  className="p-5"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-olive mb-2">
                        {course?.title || course?.name || "Course"}
                      </p>

                      <h4 className="font-semibold">
                        {assignment.title}
                      </h4>

                      <p className="text-sm text-muted mt-1">
                        {assignment.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          {formatDeadline(assignment.deadline)}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          {assignment.submissionType === "group" ? (
                            <Users size={14} />
                          ) : (
                            <User size={14} />
                          )}

                          {assignment.submissionType === "group"
                            ? "Group"
                            : "Individual"}
                        </span>

                        {overdue && (
                          <span className="text-terracotta font-semibold">
                            Deadline passed
                          </span>
                        )}
                      </div>

                      <div className="mt-3">
                        <span
                          className={`text-xs font-medium ${
                            status.acknowledged
                              ? "text-olive"
                              : "text-terracotta"
                          }`}
                        >
                          {status.acknowledged
                            ? "✓ Acknowledged"
                            : "○ Pending acknowledgement"}
                        </span>

                        <p className="text-xs text-muted mt-1">
                          {status.message}
                        </p>
                      </div>
                    </div>

                    {assignment.oneDriveLink && (
                      <a
                        href={assignment.oneDriveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm hover:bg-canvas shrink-0"
                      >
                        Open resource
                        <ExternalLink size={15} />
                      </a>
                    )}
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

export default StudentDashboard;
