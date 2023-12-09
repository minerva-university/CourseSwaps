import unittest
from API import create_app, db
from API.models import (
    Users,
    Courses,
    UserCurrentCourses,
    CourseScheduleOptions,
    CoursesAvailableForPickup,
    UserCompletedCourses
)
from flask_login import login_user


class PickupCoursesTestCase(unittest.TestCase):
    def setup():
        self.app = create_app(
            test_config={
                "TESTING": True,
                "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
                "WTF_CSRF_ENABLED": False,
            }
        )
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()
             user = Users(id="123456")
            




