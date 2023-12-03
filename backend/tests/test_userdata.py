# import unittest
# from flask import json
# from API import create_app, db
# from API.models import Users


# class FlaskTestCase(unittest.TestCase):

#     def setUp(self):
#         self.app = create_app({'TESTING': True, 'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:'})
#         self.client = self.app.test_client()
#         with self.app.app_context():
#             db.create_all()
#             test_user = Users(...)
#             db.session.add(test_user)
#             db.session.commit()

#     def tearDown(self):
#         with self.app.app_context():
#             db.session.remove()
#             db.drop_all()

#     def test_register_user(self):
#         response = self.client.post("/userdata", json={...})
#         self.assertEqual(response.status_code, 200)

#     def test_view_user_data(self):
#         response = self.client.get("/view-userdata")
#         self.assertEqual(response.status_code, 200)

#     def test_update_user(self):
#         response = self.client.put("/update-user", json={...})
#         self.assertEqual(response.status_code, 200)


# if __name__ == '__main__':
#     unittest.main()
