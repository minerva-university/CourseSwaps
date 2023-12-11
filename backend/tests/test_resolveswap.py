import unittest
from API import create_app, db
from API.models import Users, Roles, Courses, UserCurrentCourses, CoursesAvailableToSwap
from flask_login import login_user, logout_user, login_manager


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
                user_id="567",
                giving_course_id=course2.id,
                wanted_course_id=course1.id,
            )
            db.session.add(swap)

            db.session.commit()

    def login_user(self, user_id):
        with self.app.app_context():
            user = Users.query.filter_by(id=user_id).first()
            with self.client:
                login_user(user)

    def test_confirm_swap_unauthenticated(self):
        response = self.client.post("/confirm_swap", json={"selectedSwap": 1})
        self.assertEqual(response.status_code, 401)

    def test_confirm_swap_swap_not_found(self):
        self.login_user("1162634048916661")
        response = self.client.post("/confirm_swap", json={"selectedSwap": 99})
        self.assertEqual(response.status_code, 404)
        logout_user()

    def test_confirm_swap_successful(self):
        self.login_user("1162634048916661")
        response = self.client.post("/confirm_swap", json={"selectedSwap": 1})
        self.assertEqual(response.status_code, 200)

        user1_course = UserCurrentCourses.query.filter_by(
            user_id="1162634048916661"
        ).first()
        user2_course = UserCurrentCourses.query.filter_by(user_id="567").first()
        self.assertEqual(user1_course.course_id, 3)
        self.assertEqual(user2_course.course_id, 20)

        swap = CoursesAvailableToSwap.query.get(1)
        self.assertIsNone(swap)
        logout_user()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()


if __name__ == "__main__":
    unittest.main()
