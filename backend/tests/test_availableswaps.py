import unittest
from API import create_app, db
from flask_login import login_user
from API.models import (
    Users,
    Courses,
    CoursesAvailableToSwap,
    UserCurrentCourses,
    UserCompletedCourses,
    CourseScheduleOptions,
)


class AvailableSwapsTestCase(unittest.TestCase):
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

            # create a single user
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
            course3.prerequisites.append(course1)
            course3.prerequisites.append(course2)
            course6.prerequisites.append(course1)

            db.session.add_all([course1, course2, course3, course4, course5, course6])
            db.session.commit()

            # Set Course 1 and Course 2 as completed by the user
            user.completed_courses = [
                UserCompletedCourses(user_id=user.id, course_id=course1.id),
                UserCompletedCourses(user_id=user.id, course_id=course2.id),
            ]

            # Set Course 3 as currently being taken by the user
            user.current_courses = [
                UserCurrentCourses(user_id=user.id, course_id=course4.id),
            ]

            # Set Course 4 as available to swap for the user
            available_swaps = [
                CoursesAvailableToSwap(
                    user_id=user_2.id,
                    giving_course_id=course6.id,
                    wanted_course_id=course4.id,
                ),
            ]
            db.session.add_all(available_swaps)

            # Add the user to the session and commit all changes
            db.session.add(user)
            db.session.add(user_2)
            db.session.commit()

    def test_availableswaps_unauthenticated(self):
        with self.app.app_context():
            with self.client:
                response = self.client.get("api/availableswaps")
                self.assertEqual(response.status_code, 401)

    def test_availableswaps_authenticated(self):
        with self.app.app_context():
            with self.client:
                user = Users.query.filter_by(id="123456").first()
                with self.app.test_request_context("/"):
                    login_user(user)

            response = self.client.get("api/availableswaps")
            self.assertEqual(response.status_code, 200)
            json_data = response.json
            self.assertEqual(len(json_data["available_swaps"]), 1)
            self.assertEqual(
                json_data["available_swaps"][0]["giving_course_name"], "Course 6"
            )
            self.assertEqual(
                json_data["available_swaps"][0]["wanted_course_name"], "Course 4"
            )

    def test_add_availableswap_unauthenticated(self):
        with self.app.app_context():
            with self.client:
                response = self.client.post("api/add_availableswaps")
                self.assertEqual(response.status_code, 401)

    def test_add_availableswap_authorized(self):
        with self.app.app_context():
            with self.client:
                user = Users.query.filter_by(id="123456").first()
                with self.app.test_request_context("/"):
                    login_user(user)

            data = {
                "selectedCourse": {
                    "id": 1,
                    "name": "Test Course",
                    "code": "TEST 101",
                    "course_timeslot": 1,
                    "prerequisites": [],
                },
                "selectedCourses": [
                    {
                        "course_id": 2,
                        "course_name": "Another Test Course",
                        "course_code": "TEST 102",
                        "course_timeslot": 1,
                        "prerequisites": [],
                    }
                ],
            }
            response = self.client.post(
                "api/add_availableswaps", json=data, content_type="application/json"
            )
            self.assertEqual(response.status_code, 200)
            json_data = response.json
            self.assertEqual(json_data["message"], "Available swaps added successfully")

    def test_swap_courses_unauthenticated(self):
        with self.app.app_context():
            with self.client:
                response = self.client.get("api/swap_courses")
                self.assertEqual(response.status_code, 401)

    def test_swap_courses_authenticated(self):
        with self.app.app_context():
            with self.client:
                user = Users.query.filter_by(id="123456").first()
                with self.app.test_request_context("/"):
                    login_user(user)

            response = self.client.get("api/swap_courses")
            self.assertEqual(response.status_code, 200)
            json_data = response.json
            self.assertEqual(len(json_data["all_courses"]), 2)
