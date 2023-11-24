from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()


# User model
class Users(db.Model, UserMixin):
    id = db.Column(db.String, primary_key=True)
    current_courses = db.relationship("UserCurrentCourses", backref="user", lazy=True)
    completed_courses = db.relationship(
        "UserCompletedCourses", backref="user", lazy=True
    )

    def __repr__(self):
        return f"User('{self.id}. Current Courses: '{self.current_courses}', Completed Courses: '{self.completed_courses}', Courses Available to Swap:"  # noqa


course_prerequisites = db.Table(
    "course_prerequisites",
    db.Column("course_id", db.Integer, db.ForeignKey("courses.id"), primary_key=True),
    db.Column(
        "prerequisite_id", db.Integer, db.ForeignKey("courses.id"), primary_key=True
    ),
)


class Courses(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(50), unique=True, nullable=False)
    timeslot_id = db.Column(
        db.Integer, db.ForeignKey("course_schedule_options.id")
    )  # Assuming CourseScheduleOptions is converted to 'course_schedule_options'
    prerequisites = db.relationship(
        "Courses",
        secondary=course_prerequisites,
        primaryjoin=(course_prerequisites.c.course_id == id),
        secondaryjoin=(course_prerequisites.c.prerequisite_id == id),
        backref=db.backref("prerequisite_for", lazy="dynamic"),
        lazy="dynamic",
    )

    def __repr__(self):
        return f"Course('{self.name}', '{self.code}')"

    def to_dict(self):
        return {"name": self.name, "code": self.code, "timeslot": self.timeslot_id}


class CourseScheduleOptions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    days = db.Column(db.String(50), nullable=False)
    local_time = db.Column(db.String(10), nullable=False)
    timezone = db.Column(db.String(50), nullable=False)
    courses = db.relationship("Courses", backref="timeslot", lazy=True)


# CoursesAvailableToSwap model (table that will contain all the courses that users have indicated they want to swap)
class CoursesAvailableToSwap(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # user_id will be the id of the user that wants to swap the course
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    # giving_course_id will be the id of the course that the user wants to swap
    giving_course_id = db.Column(
        db.Integer, db.ForeignKey("courses.id"), nullable=False
    )
    # wanted_course_id will be the id of the course that the user wants to swap for
    wanted_course_id = db.Column(
        db.Integer, db.ForeignKey("courses.id"), nullable=False
    )

    def __repr__(self):
        # return the user id, the course id that the user wants to swap (with its respective time), and the course id that the user wants to swap for (with its respective time)# noqa 
        return f"CourseAvailableToSwap(User ID: '{self.user_id}', Giving Course ID: '{self.giving_course_id}', Wanted Course ID: '{self.wanted_course_id}')"# noqa 


# UserCourses model (courses that a user is currently taking)
class UserCurrentCourses(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)
    course = db.relationship("Courses")

    def __repr__(self):
        return f"UserCurrentCourses(User ID: '{self.user_id}', Course ID: '{self.course_id}')"


# UserCompletedCourses model (courses that a user has completed)
class UserCompletedCourses(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)
    course = db.relationship("Courses")

    def __repr__(self):
        return (
            f"CompletedCourse(User ID: '{self.user_id}', Course ID: '{self.course_id}')"
        )


# Available courses to just pickup
class CoursesAvailableForPickup(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)
    course = db.relationship("Courses")

    def __repr__(self):
        # add time of the course with the course id
        return f"CourseAvailableForPickup(Course ID: '{self.course_id}')"


# InitializationFlag model (table that will contain a single row that will indicate whether the database has been initialized or not)# noqa 
class InitializationFlag(db.Model):
    __tablename__ = "initialization_flag"
    id = db.Column(db.Integer, primary_key=True)
    is_initialized = db.Column(db.Boolean, default=False)
