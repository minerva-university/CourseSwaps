import unittest
from API import create_app, db
from API.models import (
    Users,
    Courses,
    UserCurrentCourses,
    CourseScheduleOptions,
)
from flask_login import login_user


class MyCoursesTestCase(unittest.TestCase):
    def setUp(self):
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
            # Create and insert a test user with only the Google ID, as that's what your model stores
            user = Users(id="123456")
            course1 = Courses(
                name="Test Course",
                code="TEST 101",
                timeslot_id=1,
            )

            course2 = Courses(
                name="Another Test Course",
                code="TEST 102",
                timeslot_id=1,
            )

            # add a time option to the course
            time = CourseScheduleOptions(
                days="MW",
                local_time="12:00",
                timezone="EST",
            )

            course1.prerequisites.append(course2)

            db.session.add(user)
            db.session.add(course1)
            db.session.add(course2)
            db.session.add(time)
            db.session.commit()

    def test_mycourses_unauthenticated(self):
        with self.app.app_context():
            with self.client:
                response = self.client.get("api/mycourses")
                self.assertEqual(response.status_code, 401)

    def test_mycourses_authenticated(self):
        with self.app.app_context():
            with self.client:
                user = Users.query.filter_by(id="123456").first()
                with self.app.test_request_context("/"):
                    login_user(user)

                # Test when a user does not have a current course - should return an empty list
                response = self.client.get("api/mycourses")
                self.assertEqual(response.status_code, 200)
                self.assertEqual(len(response.json["current_courses"]), 0)

                # Test when a user has a current course
                current_course = UserCurrentCourses(
                    user_id="123456",
                    course_id=1,
                )

                # add time to the course
                db.session.add(current_course)
                db.session.commit()
                response = self.client.get("api/mycourses")
                self.assertEqual(response.status_code, 200)
                json_data = response.json
                print(json_data)
                self.assertEqual(len(json_data["current_courses"]), 1)

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()


if __name__ == "__main__":
    unittest.main()
