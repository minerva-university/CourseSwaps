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
        return f"User('{self.id}. Current Courses: '{self.current_courses}', Completed Courses: '{self.completed_courses}', Courses Available to Swap:"# noqa 


# Course model (contains all the courses in the database)
class Courses(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(50), unique=True, nullable=False)  # cs110
    time = db.Column(db.String(50), nullable=False)  # 9:00 am
    # course prerequisite that will contain course codes of the courses that are prerequisites for this course (e.g. cs110, cs111)
    prerequisites = db.Column(db.String(100), nullable=True)

    def __repr__(self):
        return f"Course('{self.name}', '{self.code}', '{self.time}', '{self.prerequisites}')"


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
        # return the user id, the course id that the user wants to swap (with its respective time), and the course id that the user wants to swap for (with its respective time)
        return f"CourseAvailableToSwap(User ID: '{self.user_id}', Giving Course ID: '{self.giving_course_id}', Wanted Course ID: '{self.wanted_course_id}')"


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
