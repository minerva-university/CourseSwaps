from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from flask_cors import CORS
from ..models import (
    db,
    Courses,
    CoursesAvailableToSwap,
    UserCurrentCourses,
    UserCompletedCourses,
)

availableswaps_bp = Blueprint("availableswaps_bp", __name__)
CORS(availableswaps_bp, supports_credentials=True)


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
                and swap.wanted_course_id in current_courses_ids
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
                        "wanted_course_name": Courses.query.get(
                            swap.wanted_course_id
                        ).name,
                        "wanted_course_code": Courses.query.get(
                            swap.wanted_course_id
                        ).code,
                        "course_time": course_schedule.local_time
                        if course_schedule
                        else None,
                    }
                    eligible_swaps.append(swap_details)
        return jsonify({"available_swaps": eligible_swaps}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "An unexpected error occurred"}), 500


@availableswaps_bp.route("/add_availableswaps", methods=["POST"])
@login_required
def add_available_swap():
    if not current_user.is_authenticated:
        return jsonify({"error": "User not logged in"}), 401

    try:
        data = request.get_json()
        user_id = current_user.id
        giving_course = data.get("selectedCourse")
        wanted_courses = data.get("selectedCourses")

        if not giving_course or not wanted_courses:
            return jsonify({"error": "Missing course data"}), 400

        giving_course_id = giving_course.get("id")
        added_swaps = []

        for wanted_course in wanted_courses:
            wanted_course_id = wanted_course.get("course_id")

            # Check if the swap already exists
            existing_swap = CoursesAvailableToSwap.query.filter_by(
                user_id=user_id,
                giving_course_id=giving_course_id,
                wanted_course_id=wanted_course_id,
            ).first()

            if not existing_swap:
                new_available_swap = CoursesAvailableToSwap(
                    user_id=user_id,
                    giving_course_id=giving_course_id,
                    wanted_course_id=wanted_course_id,
                )
                db.session.add(new_available_swap)
                added_swaps.append(
                    {
                        "giving_course_id": giving_course_id,
                        "wanted_course_id": wanted_course_id,
                    }
                )

        db.session.commit()
        return (
            jsonify(
                {
                    "message": "Available swaps added successfully",
                    "added_swaps": added_swaps,
                }
            ),
            200,
        )
    except Exception as e:
        print(e)
        return jsonify({"error": "Invalid Input"}), 400


@availableswaps_bp.route("/swap_courses", methods=["GET"])
@login_required
def all_courses():
    if not current_user.is_authenticated:
        return jsonify({"error": "Unauthorized access"}), 401

    try:
        all_courses = Courses.query.all()
        # filter out completed courses and current courses
        completed_courses_ids = [
            c.course_id
            for c in UserCompletedCourses.query.filter_by(user_id=current_user.id)
        ]
        current_courses_ids = [
            c.course_id
            for c in UserCurrentCourses.query.filter_by(user_id=current_user.id)
        ]
        courses = []

        for course in all_courses:
            if (
                course.id not in completed_courses_ids
                and course.id not in current_courses_ids
            ):
                if course.prerequisites and any(
                    prerequisite_id in completed_courses_ids
                    for prerequisite_id in [
                        prerequisite.id for prerequisite in course.prerequisites
                    ]
                ):
                    course_details = {
                        "course_id": course.id,
                        "course_name": course.name,
                        "course_code": course.code,
                        "course_timeslot": course.timeslot_id,
                        "prerequisites": [
                            {"name": prerequisite.name, "code": prerequisite.code}
                            for prerequisite in course.prerequisites
                        ],
                    }
                    courses.append(course_details)

        return jsonify({"all_courses": courses}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "An unexpected error occurred"}), 500


@availableswaps_bp.route("/my_swaps", methods=["GET"])
@login_required
def my_swaps():
    """
    Get all swap requests made by the current user.
    """
    if not current_user.is_authenticated:
        return jsonify({"error": "Unauthorized access"}), 401
    try:
        user_swaps = CoursesAvailableToSwap.query.filter_by(
            user_id=current_user.id
        ).all()
        swaps_data = [
            {
                "swap_id": swap.id,
                "giving_course_id": swap.giving_course_id,
                "wanted_course_id": swap.wanted_course_id,
            }
            for swap in user_swaps
        ]
        return jsonify({"my_swaps": swaps_data}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "An unexpected error occurred"}), 500


@availableswaps_bp.route("/cancel_swap/<int:swap_id>", methods=["POST"])
@login_required
def cancel_swap(swap_id):
    """
    Cancel a swap request made by the current user.
    """
    if not current_user.is_authenticated:
        return jsonify({"error": "Unauthorized access"}), 401
    try:
        swap_to_cancel = CoursesAvailableToSwap.query.filter_by(
            id=swap_id, user_id=current_user.id
        ).first()
        print(swap_to_cancel)
        if swap_to_cancel:
            db.session.delete(swap_to_cancel)
            db.session.commit()
            return jsonify({"message": "Swap request cancelled successfully"}), 200
        else:
            return (
                jsonify(
                    {
                        "error": "Swap request not found or you don't have permission to cancel this swap"
                    }
                ),
                404,
            )
    except Exception as e:
        print(e)
        return jsonify({"error": "An unexpected error occurred"}), 500


@availableswaps_bp.route("/edit_swap/<int:swap_id>", methods=["POST"])
@login_required
def edit_swap(swap_id):
    """
    Edit a swap request made by the current user.
    """
    data = request.get_json()
    new_giving_course_id = data.get("newGivingCourseId")
    new_wanted_course_id = data.get("newWantedCourseId")

    if not current_user.is_authenticated:
        return jsonify({"error": "Unauthorized access"}), 401
    try:
        swap_to_edit = CoursesAvailableToSwap.query.filter_by(
            id=swap_id, user_id=current_user.id
        ).first()
        if swap_to_edit:
            swap_to_edit.giving_course_id = (
                new_giving_course_id or swap_to_edit.giving_course_id
            )
            swap_to_edit.wanted_course_id = (
                new_wanted_course_id or swap_to_edit.wanted_course_id
            )
            db.session.commit()
            return jsonify({"message": "Swap request updated successfully"}), 200
        else:
            return (
                jsonify(
                    {
                        "error": "Swap request not found or you don't have permission to edit this swap"
                    }
                ),
                404,
            )
    except Exception as e:
        print(e)
        return jsonify({"error": "An unexpected error occurred"}), 500
