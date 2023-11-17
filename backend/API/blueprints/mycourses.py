from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user

from ..models import Users, db, Courses, UserCurrentCourses, UserCompletedCourses, CoursesAvailableForPickup

mycourses_bp = Blueprint("mycourses_bp", __name__)


@mycourses_bp.route("/mycourses", methods=["GET"])
@login_required
def mycourses():
    """
    Get all courses for the current user
    """
    print("Current user: ", current_user)
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
        print("User's current courses: ", current_courses)
        return (
            jsonify(
                {
                    "current_courses": [
                        {
                            "name": course.name,
                            "code": course.code,
                            "time": course.time,
                            # "prerequisites": course.prerequisites,
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


@mycourses_bp.route("/mycourses", methods=["POST"])
@login_required
def add_current_courses():
    """
    Add courses to the current user
    """

    print("Current user: ", current_user)


    if not current_user.is_authenticated:
        return jsonify({"error": "User not logged in"}), 401

    try:
        pass
        # other things have to be figured out before this
    except Exception as e:
        print(e)
        return jsonify({"error": "Something went wrong"}), 500


@mycourses_bp.route("/for_pickup", methods=["GET"])
def available_for_pickup():
    """
    Get all courses available for pickup for the current user
    """
    try:
        # Fetching courses that are available for pickup and not taken or completed by the user
        available_courses = (
            db.session.query(Courses)
            .join(CoursesAvailableForPickup, Courses.id == CoursesAvailableForPickup.course_id)
            .outerjoin(UserCurrentCourses, (UserCurrentCourses.course_id == Courses.id) & (UserCurrentCourses.user_id == current_user.id))
            .outerjoin(UserCompletedCourses, (UserCompletedCourses.course_id == Courses.id) & (UserCompletedCourses.user_id == current_user.id))
            .filter(UserCurrentCourses.id.is_(None))
            .filter(UserCompletedCourses.id.is_(None))
            .all()
        )

        course_data = [
            {
                "id": course.id,
                "name": course.name,
                "code": course.code,
                "time": course.time,
                "prerequisites": course.prerequisites
            }
            for course in available_courses
        ]

        return jsonify({"available_courses": course_data}), 200

    except Exception as e:
        # Log the exception for debugging
        print(f"Error: {e}")
        return jsonify({"error": "Something went wrong"}), 500