import unittest
from unittest.mock import patch
from API import create_app, db
from API.models import Users
from flask_login import login_user


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

        with self.app.app_context():
            db.create_all()
            # Create and insert a test user with only the Google ID, as that's what your model stores
            user = Users(id="test_google_id")
            db.session.add(user)
            db.session.commit()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_index(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data.decode("utf-8"), "Welcome to the backend!"
        )  # noqa

    @patch("API.blueprints.auth.oauth.create_client")
    def test_auth_google_login(self, mock_oauth_client):
        # Mock the OAuth client and its response
        mock_resp = mock_oauth_client.return_value.get.return_value
        mock_resp.json.return_value = {
            "id": "test_google_id",
            "given_name": "Test User",
            "picture": "test_picture_url",
        }

        # Perform the mock login
        response = self.client.post(
            "/api/auth/google", json={"access_token": "dummy_token"}
        )
        self.assertEqual(response.status_code, 200)
        # Check if user is in database
        with self.app.app_context():
            user = Users.query.filter_by(id="test_google_id").first()
            self.assertIsNotNone(user)

        self.assertIn("Login successful", response.json["message"])

    def test_auth_logout(self):
        with self.app.app_context():
            # Create a mock user instance
            user = Users(id="1234567")
            # Assuming you have a way to add and commit this user to your database, do that
            with self.app.app_context():
                db.session.add(user)
                db.session.commit()

            # Log in the user using Flask-Login
            user = Users.query.get("1234567")
            # Use the test client to create a request context
            # Use the test client to create a request context

            with self.client:
                # Log in the user within the request context
                with self.app.test_request_context("/"):
                    login_user(user)

                # Now, test the logout functionality
                response = self.client.post("/api/auth/logout")
                self.assertEqual(response.status_code, 200)
                self.assertIn("Logout successful", response.json["message"])

if __name__ == "__main__":
    unittest.main()
