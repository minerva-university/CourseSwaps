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
                            "time": course.timeslot_id,
                            "prerequisites": [
                                {"name": prerequisite.name, "code": prerequisite.code}
                                for prerequisite in course.prerequisites
                            ],
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


@mycourses_bp.route("/check_courses/<course_id>", methods=["POST"])
@login_required
def check_current_course(course_id):
    """
    Check if a course is in the current user's courses
    """
    if not current_user.is_authenticated:
        return jsonify({"error": "User not logged in"}), 401

    # Get current courses
    try:
        current_course_ids = (
            db.session.query(UserCurrentCourses.course_id)
            .filter(UserCurrentCourses.user_id == current_user.id)
            .all()
        )

        # Extracting course IDs from the result
        current_course_ids = [course_id for (course_id,) in current_course_ids]
        for current_course_id in current_course_ids:
            if current_course_id == int(course_id):
                return jsonify({"is_current_course": True}), 200

        return jsonify({"is_current_course": False}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Something went wrong"}), 500
