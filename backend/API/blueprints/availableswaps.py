from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user

from ..models import (
    db,
    Courses,
    CoursesAvailableToSwap,
    UserCurrentCourses,
    UserCompletedCourses
)

availableswaps_bp = Blueprint("availableswaps_bp", __name__)


@availableswaps_bp.route("/availableswaps", methods=["GET"])
@login_required
def availableswaps():
    print("Current user: ", current_user)
    if not current_user.is_authenticated:
        return jsonify({"error": "User not logged in"}), 401

    try:
        # Fetch completed course codes for the current user
        completed_courses = (
            db.session.query(Courses.code)
            .join(UserCompletedCourses, UserCompletedCourses.course_id == Courses.id)
            .filter(UserCompletedCourses.user_id == current_user.id)
            .all()
        )
        completed_course_codes = {course.code for course in completed_courses}

        # Get all courses available to swap, filtering by prerequisites
        available_swaps = (
            db.session.query(CoursesAvailableToSwap)
            .join(Courses, Courses.id == CoursesAvailableToSwap.giving_course_id)
            .outerjoin(UserCurrentCourses, (UserCurrentCourses.course_id == Courses.id) & (UserCurrentCourses.user_id == current_user.id))
            .outerjoin(UserCompletedCourses, (UserCompletedCourses.course_id == Courses.id) & (UserCompletedCourses.user_id == current_user.id))
            .filter(UserCurrentCourses.id.is_(None))
            .filter(UserCompletedCourses.id.is_(None))
            .filter(~Courses.prerequisites.in_(completed_course_codes))
            .all()
        )

        swap_data = [
            {
                "id": swap.giving_course_id,  
                "name": swap.courses.name, 
                "code": swap.courses.code,  
                "time": swap.courses.time,  
                "prerequisites": swap.courses.prerequisites 
            }
            for swap in available_swaps
        ]
        return jsonify({"available_swaps": swap_data}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Something went wrong"}), 500
    
@availableswaps_bp.route("/availableswaps", methods=["POST"])
@login_required
def add_available_swap():
    print("Current user: ", current_user)
    if not current_user.is_authenticated:
        return jsonify({"error": "User not logged in"}), 401

    try:
        data = request.get_json()
        user_id = data.get("user_id")
        giving_course_id = data.get("giving_course_id")
        wanted_course_id = data.get("wanted_course_id")

        if user_id and giving_course_id and wanted_course_id:
            new_available_swap = CoursesAvailableToSwap(
                user_id=user_id,
                giving_course_id=giving_course_id,
                wanted_course_id=wanted_course_id,
            )
            db.session.add(new_available_swap)
            db.session.commit()
            return jsonify({"message": "Available swap added successfully"}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Invalid Input"}), 400
