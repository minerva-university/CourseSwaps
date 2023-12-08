from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user


from ..models import (
    db,
    Courses,
    CoursesAvailableToSwap,
    UserCurrentCourses,
    UserCompletedCourses,
)

availableswaps_bp = Blueprint("availableswaps_bp", __name__)


@availableswaps_bp.route("/availableswaps", methods=["GET"])
@login_required
def available_swaps():
    if not current_user.is_authenticated:
        return jsonify({"error": "Unauthorized access"}), 401
    try:
        # Use the current logged-in user's ID
        user_id = current_user.id

        # Filter out courses the user has completed
        completed_courses_ids = [
            c.course_id for c in UserCompletedCourses.query.filter_by(user_id=user_id)
        ]

        # Filter out courses the user is currently taking
        current_courses_ids = [
            c.course_id for c in UserCurrentCourses.query.filter_by(user_id=user_id)
        ]

        # Get all courses available to swap
        available_swaps = CoursesAvailableToSwap.query.all()

        eligible_swaps = []
        for swap in available_swaps:
            # Check if the giving course is neither completed nor currently taken by the user
            if (
                swap.giving_course_id not in completed_courses_ids
                and swap.giving_course_id not in current_courses_ids
            ):
                # Check if user has completed at least one of the prerequisites
                giving_course = Courses.query.get(swap.giving_course_id)
                prerequisites = giving_course.prerequisites
                if any(prereq.id in completed_courses_ids for prereq in prerequisites):
                    course_schedule = giving_course.timeslot
                    swap_details = {
                        "swap_id": swap.id,
                        "user_id": swap.user_id,
                        "giving_course_id": swap.giving_course_id,
                        "giving_course_name": giving_course.name,
                        "giving_course_code": giving_course.code,
                        "wanted_course_id": swap.wanted_course_id,
                        "course_time": course_schedule.local_time
                        if course_schedule
                        else None,
                        # Add more fields as needed
                    }
                    eligible_swaps.append(swap_details)

        return jsonify({"available_swaps": eligible_swaps}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "An unexpected error occurred"}), 500


@availableswaps_bp.route("/availableswaps", methods=["POST"])
@login_required
def add_available_swap():
    print("Current user: ", current_user)
    if not current_user.is_authenticated:
        return jsonify({"error": "User not logged in"}), 401

    try:
        data = request.get_json()
        user_id = current_user.id
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
