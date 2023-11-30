from flask import Blueprint, request, jsonify, session
from flask_login import login_user, current_user
from ..models import Users, db, UserCurrentCourses, Courses, UserCompletedCourses
from authlib.integrations.flask_client import OAuth
import os

auth_bp = Blueprint("auth_bp", __name__)
oauth = OAuth()

google = oauth.register(
    name="google",
    client_id=os.environ.get("GOOGLE_CLIENT_ID"),
    client_secret=os.environ.get("GOOGLE_CLIENT_SECRET"),
    access_token_url="https://accounts.google.com/o/oauth2/token",
    access_token_params=None,
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    authorize_params=None,
    api_base_url="https://www.googleapis.com/oauth2/v1/",
    client_kwargs={"scope": "openid profile email"},
)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    class_year = data["class"]
    major = data["major"]
    currently_assigned = data["currentClasses"]
    completed_courses = data["previousCourses"]

    try:
        user = Users.query.filter_by(id=current_user.id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        user.class_year = class_year
        user.major = major

        for current_course in currently_assigned:
            course = Courses.query.filter_by(code=current_course).first()
            if course:
                user.current_courses.append(
                    UserCurrentCourses(
                        user_id=current_user.id,
                        course_id=course.id,
                    )
                )
            else:
                return jsonify({"error": f"Course {current_course} not found"}), 404

        for completed_course in completed_courses:
            course = Courses.query.filter_by(code=completed_course).first()
            if course:
                user.completed_courses.append(
                    UserCompletedCourses(
                        user_id=current_user.id,
                        course_id=course.id,
                    )
                )
            else:
                return jsonify({"error": f"Course {completed_course} not found"}), 404

        db.session.commit()
        return jsonify({"success": "Profile updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/auth/google", methods=["POST"])
def login():
    data = request.get_json()
    access_token = data.get("access_token")

    google = oauth.create_client("google")

    resp = google.get("userinfo", token=access_token)
    user_info = resp.json()

    user_id = user_info["id"]
    given_name = user_info["given_name"]
    picture = user_info["picture"]

    user = Users.query.filter_by(id=user_id).first()

    if not user:
        user = Users(id=user_id)
        db.session.add(user)
        db.session.commit()
        new_user = True
    else:
        new_user = False

    login_user(user)
    session["profile"] = resp.json()

    return (
        jsonify(
            {
                "user": {
                    "id": user_id,
                    "given_name": given_name,
                    "picture": picture,
                    "new_user": new_user,
                },
                "message": "Login successful",
            }
        ),
        200,
    )


@auth_bp.route("/logout", methods=["POST"])
def logout():
    # Logout logic here, e.g., clear a session or token
    return jsonify({"message": "Logout successful"}), 200
