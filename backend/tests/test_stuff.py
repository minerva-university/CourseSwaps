import unittest
from flask import url_for
from backend.API.app import create_app, db
from backend.API.models.models import User


class APITestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(
            test_config={
                "TESTING": True,
                "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
            }
        )
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_index(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, b"Welcome to the backend!")

    def test_register(self):
        response = self.client.post(
            "/api/register", json={"username": "testuser", "password": "testpassword"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"message": "Registration successful"})

        with self.app.app_context():
            user = User.query.filter_by(username="testuser").first()
            self.assertIsNotNone(user)
            self.assertTrue(user.check_password("testpassword"))

    def test_login(self):
        with self.app.app_context():
            user = User(username="testuser")
            user.set_password("testpassword")
            db.session.add(user)
            db.session.commit()

        response = self.client.post(
            "/api/login", json={"username": "testuser", "password": "testpassword"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"message": "Login successful"})

    def test_logout(self):
        response = self.client.post("/api/logout")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"message": "Logout successful"})
