
import { useContext } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, ArrowUpRight } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import { AppContext } from "../context/AppContextDefinition";

function CoursesPage() {
  const { currentUser, courses, users } = useContext(AppContext);

  const isProfessor = currentUser.role === "professor";

  const myCourses = courses.filter((course) =>
    isProfessor
      ? course.professorId === currentUser.id
      : course.studentIds?.includes(currentUser.id)
  );

  return (
    <DashboardLayout
      title="My Courses"
      description={
        isProfessor
          ? "Manage the courses you teach."
          : "Explore your enrolled courses and assignments."
      }
    >
      <section className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-terracotta mb-2">
          {isProfessor ? "Teaching workspace" : "Learning workspace"}
        </p>

        <h2 className="text-xl font-semibold">
          {myCourses.length} {myCourses.length === 1 ? "Course" : "Courses"}
        </h2>

        <p className="text-sm text-muted mt-1">
          {isProfessor
            ? "Select a course to manage its assignments and students."
            : "Select a course to view its assignments and group activities."}
        </p>
      </section>

      {myCourses.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl py-16 px-5 text-center">
          <BookOpen size={36} className="mx-auto text-muted mb-4" />

          <h3 className="font-semibold">No courses available</h3>

          <p className="text-sm text-muted mt-2">
            Your courses will appear here when they become available.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {myCourses.map((course) => {
            const professor = users.find(
              (user) => user.id === course.professorId
            );

            const studentCount = course.studentIds?.length || 0;

            const coursePath = isProfessor
              ? `/professor/courses/${course.id}`
              : `/student/courses/${course.id}`;

            return (
              <article
                key={course.id}
                className="bg-surface border border-border rounded-xl p-5 hover:border-olive transition-colors"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-olive/10 text-olive flex items-center justify-center">
                    <BookOpen size={22} />
                  </div>

                  <span className="text-xs font-medium bg-canvas border border-border rounded-md px-2.5 py-1">
                    {course.code}
                  </span>
                </div>

                <h3 className="font-semibold text-lg">
                  {course.title}
                </h3>

                <p className="text-sm text-muted mt-2 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <div className="text-xs text-muted space-y-1">
                    {isProfessor ? (
                      <p className="flex items-center gap-1.5">
                        <Users size={14} />
                        {studentCount} enrolled students
                      </p>
                    ) : (
                      <p>
                        Professor: {professor?.name || "Not assigned"}
                      </p>
                    )}
                  </div>

                  <Link
                    to={coursePath}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-olive hover:underline"
                  >
                    Open course
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </DashboardLayout>
  );
}

export default CoursesPage;
