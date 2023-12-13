import unittest
from API import create_app, db
from API.models import Users, Courses, UserCurrentCourses, CoursesAvailableToSwap
from flask_login import login_user


class ConfirmSwapTestCase(unittest.TestCase):
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

            # Creating test users
            user1 = Users(
                id="123",
                major="Computational",
                class_year="M25",
                minerva_id="123456",
                concentration="Computer",
                role_id=1,
            )
            user2 = Users(
                id="321",
                major="Computational",
                class_year="M25",
                minerva_id="876543",
                concentration="Computer",
                role_id=1,
            )
            db.session.add_all([user1, user2])

            # Creating test courses
            course1 = Courses(id=20, name="Chemical Struct...", code="NS113")
            course2 = Courses(id=3, name="Physics of the U...", code="NS110U")
            db.session.add_all([course1, course2])

            # Assigning current courses to users
            user1_current_course = UserCurrentCourses(
                user_id="123", course_id=course1.id
            )
            user2_current_course = UserCurrentCourses(
                user_id="321", course_id=course2.id
            )
            db.session.add_all([user1_current_course, user2_current_course])

            # Creating a course available to swap
            swap = CoursesAvailableToSwap(
                id=1,
                user_id="321",
                giving_course_id=course2.id,
                wanted_course_id=course1.id,
            )
            db.session.add(swap)

            db.session.commit()

    def test_confirm_swap_unauthenticated(self):
        # Test unauthorized access
        with self.app.app_context():
            with self.client:
                response = self.client.post(
                    "api/confirm_swap", json={"selectedSwap": 1}
                )
                self.assertEqual(response.status_code, 401)

    def test_confirm_swap_swap_not_found(self):
        with self.app.app_context():
            with self.client:
                user = Users.query.filter_by(id="123").first()
                with self.app.test_request_context("/"):
                    login_user(user)
            response = self.client.post("api/confirm_swap", json={"selectedSwap": 99})
            self.assertEqual(response.status_code, 404)

    def test_confirm_swap_course_not_available(self):
        with self.app.app_context():
            with self.client:
                # Log in as user1
                user = Users.query.filter_by(id="123").first()
                with self.app.test_request_context("/"):
                    login_user(user)

                # Remove the course that user1 wants to swap from their current courses
                UserCurrentCourses.query.filter_by(user_id="123", course_id=20).delete()
                db.session.commit()

                # Attempt to confirm the swap
                response = self.client.post(
                    "api/confirm_swap", json={"selectedSwap": 1}
                )
                self.assertEqual(response.status_code, 400)
                self.assertIn(
                    "One or both users do not have the required courses for the swap",
                    response.get_json()["error"],
                )

    def test_confirm_swap_successful(self):
        with self.app.app_context():
            with self.client:
                user = Users.query.filter_by(id="123").first()
                with self.app.test_request_context("/"):
                    login_user(user)
            response = self.client.post("api/confirm_swap", json={"selectedSwap": 1})
            self.assertEqual(response.status_code, 200)

            # Verifying Database Updates
            user1_course = UserCurrentCourses.query.filter_by(user_id="123").first()
            user2_course = UserCurrentCourses.query.filter_by(user_id="321").first()
            self.assertEqual(user1_course.course_id, 3)
            self.assertEqual(user2_course.course_id, 20)

            # Verifying Swap Deletion
            swap = CoursesAvailableToSwap.query.get(1)
            self.assertIsNone(swap)

    def tearDown(self):
        # Clean up the database after each test
        with self.app.app_context():
            db.session.remove()
            db.drop_all()


if __name__ == "__main__":
    unittest.main()
