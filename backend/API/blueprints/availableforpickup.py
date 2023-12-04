from flask import Blueprint, jsonify
from flask_login import current_user, login_required
from ..models import (
    db,
    Courses,
    UserCurrentCourses,
    UserCompletedCourses,
    CoursesAvailableForPickup,
)

availableforpickup_bp = Blueprint("availableforpickup_bp", __name__)


@availableforpickup_bp.route("/availableforpickup", methods=["GET"])
@login_required
def available_for_pickup():
    """
    Get all courses available for pickup for the current user
    """
    print('User getting available courses')
    try:
        # Fetching courses that are available for pickup and not taken or completed by the user
        available_courses = (
            db.session.query(Courses, CoursesAvailableForPickup.count)
            .join(
                CoursesAvailableForPickup,
                Courses.id == CoursesAvailableForPickup.course_id,
            )
            .outerjoin(
                UserCurrentCourses,
                (UserCurrentCourses.course_id == Courses.id)
                & (UserCurrentCourses.user_id == current_user.id),
            )
            .outerjoin(
                UserCompletedCourses,
                (UserCompletedCourses.course_id == Courses.id)
                & (UserCompletedCourses.user_id == current_user.id),
            )
            .filter(UserCurrentCourses.id.is_(None))
            .filter(UserCompletedCourses.id.is_(None))
            .all()
        )

        course_data = [
            {
                "id": course.id,
                "name": course.name,
                "code": course.code,
                "count": count
            }
            for course, count in available_courses
        ]

        return jsonify({"available_courses": course_data}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Something went wrong"}), 500
