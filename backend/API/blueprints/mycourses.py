from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from flask_cors import CORS
from ..models import (
    db,
    Courses,
    UserCurrentCourses,
)

mycourses_bp = Blueprint("mycourses_bp", __name__)
CORS(mycourses_bp, supports_credentials=True)


@mycourses_bp.route("/mycourses", methods=["GET"])
@login_required
def mycourses():
    """
    Get all courses for the current user
    """
    print("A user is trying to get their courses")
    if not current_user.is_authenticated:
        return jsonify({"error": "User not logged in"}), 401

    # Get current courses
    try:
        current_courses = (
            db.session.query(Courses)
            .join(UserCurrentCourses)
            .filter(UserCurrentCourses.user_id == current_user.id)
            .all()
        )

        return (
            jsonify(
                {
                    "current_courses": [
                        {
                            "name": course.name,
                            "code": course.code,
                            "id": course.id,
                        }
                        for course in current_courses
                    ]
                }
            ),
            200,
        )
    except Exception as e:
        print(e)
        return jsonify({"error": "Something went wrong"}), 500
