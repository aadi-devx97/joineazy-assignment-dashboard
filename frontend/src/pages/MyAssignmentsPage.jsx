
import { useContext, useMemo, useState } from "react";
import {
  ClipboardList,
  ExternalLink,
  CheckCircle2,
  Clock,
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

function formatAcknowledgement(value) {
  if (!value) return "";

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function MyAssignmentsPage() {
  const {
    currentUser,
    courses,
    assignments,
    setAssignments,
    groups,
    users,
  } = useContext(AppContext);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const enrolledCourses = useMemo(
    () =>
      courses.filter((course) =>
        course.studentIds?.includes(currentUser?.id)
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

  const getCourse = (courseId) =>
    courses.find((course) => course.id === courseId);

  const getMyGroup = (courseId) =>
    groups.find(
      (group) =>
        group.courseId === courseId &&
        group.members?.includes(currentUser.id)
    );

  const getUserName = (userId) =>
    users.find((user) => user.id === userId)?.name ||
    "Unknown student";

  const getAcknowledgementInfo = (assignment) => {
    const acknowledgements = assignment.acknowledgements || {};

    if (assignment.submissionType === "individual") {
      const acknowledgement = acknowledgements[currentUser.id];

      return {
        acknowledged: Boolean(acknowledgement?.acknowledged),
        acknowledgedAt: acknowledgement?.acknowledgedAt,
        canAcknowledge: !acknowledgement?.acknowledged,
        message: acknowledgement?.acknowledged
          ? "You acknowledged this assignment."
          : "You haven't acknowledged this assignment yet.",
      };
    }

    const group = getMyGroup(assignment.courseId);

    if (!group) {
      return {
        group: null,
        acknowledged: false,
        canAcknowledge: false,
        message: "Create or join a group to participate.",
      };
    }

    const acknowledgement = acknowledgements[group.id];
    const isLeader = group.leaderId === currentUser.id;

    return {
      group,
      acknowledged: Boolean(acknowledgement?.acknowledged),
      acknowledgedAt: acknowledgement?.acknowledgedAt,
      canAcknowledge:
        isLeader && !acknowledgement?.acknowledged,
      isLeader,
      leaderName: getUserName(group.leaderId),
      message: acknowledgement?.acknowledged
        ? `${getUserName(group.leaderId)} acknowledged this assignment.`
        : isLeader
          ? "You are the group leader. You can acknowledge this assignment."
          : `Waiting for ${getUserName(group.leaderId)} to acknowledge.`,
    };
  };

  const handleAcknowledge = (assignment) => {
    setSuccess("");
    setError("");

    const group =
      assignment.submissionType === "group"
        ? getMyGroup(assignment.courseId)
        : null;

    if (
      assignment.submissionType === "group" &&
      (!group || group.leaderId !== currentUser.id)
    ) {
      setError("Only your group leader can acknowledge this assignment.");
      return;
    }

    const acknowledgementKey =
      assignment.submissionType === "group"
        ? group.id
        : currentUser.id;

    const existingAcknowledgement =
      assignment.acknowledgements?.[acknowledgementKey];

    if (existingAcknowledgement?.acknowledged) {
      setError("This assignment has already been acknowledged.");
      return;
    }

    setAssignments((previous) =>
      previous.map((item) => {
        if (item.id !== assignment.id) return item;

        return {
          ...item,
          acknowledgements: {
            ...(item.acknowledgements || {}),
            [acknowledgementKey]: {
              acknowledged: true,
              acknowledgedBy: currentUser.id,
              acknowledgedAt: new Date().toISOString(),
            },
          },
        };
      })
    );

    setSuccess(
      assignment.submissionType === "group"
        ? "Your group has acknowledged the assignment."
        : "Assignment acknowledged successfully."
    );
  };

  const acknowledgedCount = myAssignments.filter((assignment) =>
    getAcknowledgementInfo(assignment).acknowledged
  ).length;

  const pendingCount = myAssignments.length - acknowledgedCount;

  return (
    <DashboardLayout
      title="My Assignments"
      description="Review your coursework, deadlines and acknowledgement status."
    >
      {/* Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
        {[
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
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="bg-surface border border-border rounded-xl p-5"
            >
              <div className="flex justify-between items-center mb-5">
                <p className="text-sm text-muted">{item.label}</p>
                <Icon size={20} className="text-olive" />
              </div>

              <p className="text-3xl font-semibold">
                {item.value}
              </p>
            </div>
          );
        })}
      </section>

      {success && (
        <div
          className="mb-5 p-4 rounded-lg bg-olive/10 text-olive text-sm"
          role="status"
        >
          {success}
        </div>
      )}

      {error && (
        <div
          className="mb-5 p-4 rounded-lg bg-terracotta/10 text-terracotta text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Assignment list */}
      <section className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-lg">
            Your Assignments
          </h3>

          <p className="text-sm text-muted mt-1">
            {myAssignments.length} assignments found.
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
              Assignments from your enrolled courses will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {myAssignments.map((assignment) => {
              const course = getCourse(assignment.courseId);
              const status = getAcknowledgementInfo(assignment);

              const isOverdue =
                new Date(assignment.deadline) < new Date();

              const isGroup =
                assignment.submissionType === "group";

              return (
                <article
                  key={assignment.id}
                  className="p-5"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-olive mb-2">
                        {course?.title || course?.name || "Course"}
                      </p>

                      <h4 className="font-semibold text-lg">
                        {assignment.title}
                      </h4>

                      <p className="text-sm text-muted mt-2">
                        {assignment.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays size={15} />
                          {formatDeadline(assignment.deadline)}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          {isGroup ? (
                            <Users size={15} />
                          ) : (
                            <User size={15} />
                          )}

                          {isGroup ? "Group" : "Individual"}
                        </span>

                        {isOverdue && (
                          <span className="text-terracotta font-semibold">
                            Deadline passed
                          </span>
                        )}
                      </div>

                      {isGroup && status.group && (
                        <div className="mt-4 p-3 rounded-lg bg-canvas border border-border">
                          <p className="text-sm font-medium">
                            Group: {status.group.name || "Your group"}
                          </p>

                          <p className="text-xs text-muted mt-1">
                            Leader: {status.leaderName}
                          </p>
                        </div>
                      )}

                      <div className="mt-4">
                        <p
                          className={`text-sm font-medium ${
                            status.acknowledged
                              ? "text-olive"
                              : "text-terracotta"
                          }`}
                        >
                          {status.acknowledged
                            ? "✓ Acknowledged"
                            : "○ Not acknowledged"}
                        </p>

                        <p className="text-xs text-muted mt-1">
                          {status.message}
                        </p>

                        {status.acknowledgedAt && (
                          <p className="text-xs text-muted mt-1">
                            Acknowledged on:{" "}
                            {formatAcknowledgement(
                              status.acknowledgedAt
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      {assignment.oneDriveLink && (
                        <a
                          href={assignment.oneDriveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 border border-border px-3 py-2 rounded-lg text-sm hover:bg-canvas"
                        >
                          Open resource
                          <ExternalLink size={15} />
                        </a>
                      )}

                      {status.canAcknowledge && (
                        <button
                          type="button"
                          onClick={() =>
                            handleAcknowledge(assignment)
                          }
                          className="px-4 py-2.5 bg-olive text-white text-sm font-medium rounded-lg hover:bg-olive-dark"
                        >
                          Acknowledge
                        </button>
                      )}
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

export default MyAssignmentsPage;
