import unittest
from API import create_app, db
from API.models import (
    Users,
    Courses,
    UserCurrentCourses,
    CourseScheduleOptions,
    UserCompletedCourses,
    CoursesAvailableForPickup,
)
from flask_login import login_user


class PickupTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(
            test_config={
                "TESTING": True,
                "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
                "WTF_CSRF_ENABLED": False,
                "SECRET_KEY": "test_secret_key",
            }
        )
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()

            # inserting users
            user = Users(id="123456")
            user_2 = Users(id="654321")

            # Create course schedule option
            time = CourseScheduleOptions(days="MW", local_time="12:00", timezone="EST")
            db.session.add(time)

            # Create 5 dummy courses
            course1 = Courses(name="Test Course", code="TEST 101", timeslot_id=time.id)
            course2 = Courses(
                name="Another Test Course", code="TEST 102", timeslot_id=time.id
            )
            course3 = Courses(name="Course 3", code="TEST 103", timeslot_id=time.id)
            course4 = Courses(name="Course 4", code="TEST 104", timeslot_id=time.id)
            course5 = Courses(name="Course 5", code="TEST 105", timeslot_id=time.id)
            course6 = Courses(name="Course 6", code="TEST 106", timeslot_id=time.id)
            # add prerequisites to course 3
            course3.prerequisites.append(course4)
            course3.prerequisites.append(course2)
            course6.prerequisites.append(course1)

            db.session.add_all([course1, course2, course3, course4, course5, course6])
            db.session.commit()

            # Set Course 1 and Course 2 as completed by the user
            user.completed_courses = [
                UserCompletedCourses(user_id=user.id, course_id=course1.id),
                UserCompletedCourses(user_id=user.id, course_id=course2.id),
            ]

            # Set Course 4 as currently being taken by the user
            user.current_courses = [
                UserCurrentCourses(user_id=user.id, course_id=course4.id),
            ]

            available_for_pickup = [
                CoursesAvailableForPickup(course_id=course3.id, count=1),
                CoursesAvailableForPickup(course_id=course1.id, count=1),
                CoursesAvailableForPickup(course_id=course4.id, count=1),
            ]

            db.session.add_all(available_for_pickup)
            db.session.add_all([user, user_2])
            db.session.commit()

    def test_available_pickup_unauthorized(self):
        with self.app.app_context():
            with self.client:
                response = self.client.get("api/availableforpickup")
                self.assertEqual(response.status_code, 401)

    def test_available_pickup_authorized(self):
        with self.app.app_context():
            with self.client:
                user = Users.query.filter_by(id="123456").first()
                with self.app.test_request_context("/"):
                    login_user(user)

            response = self.client.get("api/availableforpickup")
            self.assertEqual(response.status_code, 200)
            json_data = response.json
            self.assertEqual(len(json_data["available_courses"]), 0)

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()


if __name__ == "__main__":
    unittest.main()
