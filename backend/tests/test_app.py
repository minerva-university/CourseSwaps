import unittest
from flask_login import LoginManager
from werkzeug.security import generate_password_hash
from API import create_app, db
from API.models import Users


class APITestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(
            test_config={
                "TESTING": True,
                "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
                "WTF_CSRF_ENABLED": False,
            }
        )
        self.client = self.app.test_client()

        # Initialize the Flask-Login manager
        self.login_manager = LoginManager()
        self.login_manager.init_app(self.app)

        # Create the database and tables
        with self.app.app_context():
            db.create_all()
            # Create and insert a test user with a hashed password
            hashed_password = generate_password_hash("testpassword", method="pbkdf2")
            user = Users(
                name="testuser", email="testuser@example.com", password=hashed_password
            )
            db.session.add(user)
            db.session.commit()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_index(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.decode("utf-8"), "Welcome to the backend!")

    def test_auth_register(self):
        response = self.client.post(
            "/api/register",
            json={
                "username": "newuser",
                "password": "newpassword",
                "email": "newemail@gmail.com",
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "Registration successful")

    def test_auth_login(self):
        # Attempt to login with the test user credentials
        response = self.client.post(
            "/api/login", json={"username": "testuser", "password": "testpassword"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "Login successful")

    def test_auth_logout(self):
        # Login the user first
        login_response = self.client.post(
            "/api/login", json={"username": "testuser", "password": "testpassword"}
        )
        self.assertEqual(login_response.status_code, 200)

        # Then, attempt to logout
        logout_response = self.client.post("/api/logout")
        self.assertEqual(logout_response.status_code, 200)
        self.assertEqual(logout_response.json["message"], "Logout successful")
