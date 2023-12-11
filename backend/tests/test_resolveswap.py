import unittest
from API import create_app, db
from API.models import Users, Courses, UserCurrentCourses, CoursesAvailableToSwap
from flask_login import login_user, logout_user

course1 = Course(id=1, name="Course 1", code="C001", timeslot_id=1)
course2 = Course(id=2, name="Course 2", code="C002", timeslot_id=2)
db.session.add(course1)
db.session.add(course2)
db.session.commit()


class ConfirmSwapTestCase(unittest.TestCase):
    def setUp(self):
        # Configuration and Test Client Setup
        self.app = create_app(
            test_config={
                "TESTING": True,
                "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
                "WTF_CSRF_ENABLED": False,
                "SECRET_KEY": "test_secret_key",
            }
        )
        self.client = self.app.test_client()

        # Database Setup with Test Data
        with self.app.app_context():
            db.create_all()
            # Creating Users
            user1 = Users(id="user1")
            user2 = Users(id="user2")
            db.session.add_all([user1, user2])

            # Creating Courses
            course1 = Courses(id=1, name="Course 1")
            course2 = Courses(id=2, name="Course 2")
            db.session.add_all([course1, course2])

            # Creating User Courses
            user_course1 = UserCurrentCourses(user_id="user1", course_id=1)
            user_course2 = UserCurrentCourses(user_id="user2", course_id=2)
            db.session.add_all([user_course1, user_course2])

            # Creating Swap Request
            swap = CoursesAvailableToSwap(
                id=1, user_id="user2", wanted_course_id=1, giving_course_id=2
            )
            db.session.add(swap)

            db.session.commit()

    def test_confirm_swap_unauthenticated(self):
        # Test unauthorized access
        response = self.client.post("/confirm_swap", json={"selectedSwap": 1})
        self.assertEqual(response.status_code, 401)

    def test_confirm_swap_swap_not_found(self):
        with self.app.app_context():
            login_user(Users.query.get("user1"))
            response = self.client.post("/confirm_swap", json={"selectedSwap": 99})
            self.assertEqual(response.status_code, 404)
            logout_user()

    def test_confirm_swap_successful(self):
        with self.app.app_context():
            login_user(Users.query.get("user1"))
            response = self.client.post("/confirm_swap", json={"selectedSwap": 1})
            self.assertEqual(response.status_code, 200)

            # Verifying Database Updates
            user1_course = UserCurrentCourses.query.filter_by(user_id="user1").first()
            user2_course = UserCurrentCourses.query.filter_by(user_id="user2").first()
            self.assertEqual(user1_course.course_id, 2)
            self.assertEqual(user2_course.course_id, 1)

            # Verifying Swap Deletion
            swap = CoursesAvailableToSwap.query.get(1)
            self.assertIsNone(swap)

            logout_user()

    def tearDown(self):
        # Clean up the database after each test
        with self.app.app_context():
            db.session.remove()
            db.drop_all()


if __name__ == "__main__":
    unittest.main()
