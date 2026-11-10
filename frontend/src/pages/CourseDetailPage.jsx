
import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ExternalLink,
  FileText,
  Users,
  Crown,
  UserPlus,
  Plus,
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
    setGroups,
  } = useContext(AppContext);

  const [groupName, setGroupName] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const isProfessor = currentUser?.role === "professor";

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

  const myGroup = courseGroups.find((group) =>
    group.members?.includes(currentUser.id)
  );

  const getUserName = (userId) =>
    users.find((user) => user.id === userId)?.name ||
    "Unknown student";

  const backPath = isProfessor
    ? "/professor/courses"
    : "/student/courses";

  const assignmentPath = isProfessor
    ? "/professor/assignments"
    : "/student/assignments";

  const handleCreateGroup = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedName = groupName.trim();

    if (!trimmedName) {
      setError("Please enter a group name.");
      return;
    }

    if (myGroup) {
      setError("You already belong to a group in this course.");
      return;
    }

    const newGroup = {
      id: crypto.randomUUID(),
      courseId: course.id,
      name: trimmedName,
      leaderId: currentUser.id,
      members: [currentUser.id],
      createdAt: new Date().toISOString(),
    };

    setGroups((previous) => [...previous, newGroup]);

    setGroupName("");
    setSuccess("Your group has been created successfully.");
  };

  const handleJoinGroup = (groupId) => {
    setError("");
    setSuccess("");

    if (myGroup) {
      setError("You already belong to a group in this course.");
      return;
    }

    setGroups((previous) =>
      previous.map((group) => {
        if (group.id !== groupId) return group;

        if (group.members?.includes(currentUser.id)) {
          return group;
        }

        return {
          ...group,
          members: [...(group.members || []), currentUser.id],
        };
      })
    );

    setSuccess("You have successfully joined the group.");
  };

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

      {/* Group management */}
      {!isProfessor && (
        <section className="bg-surface border border-border rounded-xl p-5 mb-7">
          <div className="mb-5">
            <h3 className="font-semibold text-lg">
              Course Groups
            </h3>
            <p className="text-sm text-muted mt-1">
              Create a group or join an existing one for group assignments.
            </p>
          </div>

          {success && (
            <div
              className="mb-4 p-3 rounded-lg bg-olive/10 text-olive text-sm"
              role="status"
            >
              {success}
            </div>
          )}

          {error && (
            <div
              className="mb-4 p-3 rounded-lg bg-terracotta/10 text-terracotta text-sm"
              role="alert"
            >
              {error}
            </div>
          )}

          {myGroup ? (
            <div className="mb-6 p-4 border border-olive/30 rounded-xl bg-olive/5">
              <div className="flex items-center gap-2 mb-3">
                <Users size={19} className="text-olive" />
                <h4 className="font-semibold">
                  Your group: {myGroup.name}
                </h4>
              </div>

              <p className="text-sm text-muted mb-4">
                {myGroup.members?.length || 0} members
              </p>

              <div className="space-y-3">
                {(myGroup.members || []).map((memberId) => {
                  const isLeader = memberId === myGroup.leaderId;

                  return (
                    <div
                      key={memberId}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center font-semibold">
                          {getUserName(memberId).charAt(0)}
                        </div>

                        <div>
                          <p className="text-sm font-medium">
                            {getUserName(memberId)}
                            {memberId === currentUser.id && " (You)"}
                          </p>

                          {isLeader && (
                            <span className="text-xs text-olive font-medium">
                              Group Leader
                            </span>
                          )}
                        </div>
                      </div>

                      {isLeader && (
                        <Crown
                          size={17}
                          className="text-terracotta"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">
                You haven't joined a group yet.
              </p>

              <form
                onSubmit={handleCreateGroup}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="text"
                  value={groupName}
                  onChange={(event) =>
                    setGroupName(event.target.value)
                  }
                  placeholder="Enter a new group name"
                  maxLength={40}
                  className="flex-1 bg-canvas border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-olive"
                />

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-olive text-white text-sm font-medium rounded-lg hover:bg-olive-dark"
                >
                  <Plus size={17} />
                  Create group
                </button>
              </form>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-sm mb-3">
              {myGroup ? "Other groups" : "Available groups"}
            </h4>

            {courseGroups.filter(
              (group) => group.id !== myGroup?.id
            ).length === 0 ? (
              <p className="text-sm text-muted py-3">
                No other groups have been created in this course yet.
              </p>
            ) : (
              <div className="space-y-3">
                {courseGroups
                  .filter((group) => group.id !== myGroup?.id)
                  .map((group) => {
                    const alreadyMember =
                      group.members?.includes(currentUser.id);

                    return (
                      <div
                        key={group.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-border rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">
                            {group.name}
                          </p>

                          <p className="text-xs text-muted mt-1">
                            Leader: {getUserName(group.leaderId)}
                          </p>

                          <p className="text-xs text-muted mt-1">
                            {group.members?.length || 0} members
                          </p>
                        </div>

                        {!myGroup && (
                          <button
                            type="button"
                            onClick={() => handleJoinGroup(group.id)}
                            disabled={alreadyMember}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-canvas disabled:opacity-50"
                          >
                            <UserPlus size={16} />
                            Join group
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Professor group overview */}
      {isProfessor && (
        <section className="bg-surface border border-border rounded-xl p-5 mb-7">
          <h3 className="font-semibold text-lg mb-4">
            Course Groups
          </h3>

          {courseGroups.length === 0 ? (
            <p className="text-sm text-muted">
              No student groups have been created yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courseGroups.map((group) => (
                <div
                  key={group.id}
                  className="p-4 border border-border rounded-lg"
                >
                  <h4 className="font-semibold">
                    {group.name}
                  </h4>

                  <p className="text-xs text-muted mt-1">
                    Leader: {getUserName(group.leaderId)}
                  </p>

                  <p className="text-xs text-muted mt-1">
                    {group.members?.length || 0} members
                  </p>

                  <div className="mt-3 space-y-1">
                    {(group.members || []).map((memberId) => (
                      <p
                        key={memberId}
                        className="text-sm text-muted"
                      >
                        • {getUserName(memberId)}
                      </p>
                    ))}
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
