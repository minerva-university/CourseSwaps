import unittest
from unittest.mock import patch
from API import create_app, db
from API.models import Users, Courses, UserCurrentCourses, UserCompletedCourses
import json
import os
from flask_sqlalchemy import SQLAlchemy
from unittest.mock import patch, MagicMock, Mock
from API.course_builder import (
    load_json_data,
    populate_courses,
    create_fake_users,
    assign_user_courses,
)


class TestLoadJsonData(unittest.TestCase):
    def test_valid_json_file(self):
        # Assuming you have a test JSON file in the same directory
        test_json_path = os.path.join(os.path.dirname(__file__), "test_data.json")
        with open(test_json_path, "w") as f:
            json.dump({"courses": []}, f)

        data = load_json_data(test_json_path)
        self.assertEqual(data, {"courses": []})

        # Clean up
        os.remove(test_json_path)

    def test_invalid_json_file(self):
        with self.assertRaises(FileNotFoundError):
            load_json_data("non_existent_file.json")


class TestPopulateCourses(unittest.TestCase):
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
            user = Users(id="test_google_id")
            db.session.add(user)
            db.session.commit()

    def tearDown(self):
        # Drop the database and tables
        self.db.session.remove()
        self.db.drop_all()
        self.app_context.pop()