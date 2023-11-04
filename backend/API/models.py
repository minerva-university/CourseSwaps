from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# User model


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    courses = db.relationship("UserCourses", backref="user", lazy=True)
    wanted_courses = db.relationship("WantedCourses", backref="user", lazy=True)# noqa

    def __repr__(self):
        return f"User('{self.name}', '{self.email}')"


# Course model
class Courses(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_name = db.Column(db.String(100), nullable=False)
    course_code = db.Column(db.String(50), unique=True, nullable=False)

    def __repr__(self):
        return f"Course('{self.course_name}', '{self.course_code}')"


# UserCourses model (courses that a user is currently taking)
class UserCourses(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)# noqa
    course = db.relationship("Courses")

    def __repr__(self):
        return f"UserCourse(User ID: '{self.user_id}', Course ID: '{self.course_id}')"# noqa


# WantedCourses model (courses that a user wants to take)
class WantedCourses(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)# noqa
    course = db.relationship("Courses")

    def __repr__(self):
        return f"WantedCourse(User ID: '{self.user_id}', Course ID: '{self.course_id}')"# noqa
