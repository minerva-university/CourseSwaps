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


@availableswaps_bp.route("/add_availableswaps", methods=["POST"])
@login_required
def add_available_swap():
    print("A user is trying to add an available swap")
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
        for wanted_course in wanted_courses:
            wanted_course_id = wanted_course.get("course_id")
            if giving_course_id and wanted_course_id:
                new_available_swap = CoursesAvailableToSwap(
                    user_id=user_id,
                    giving_course_id=giving_course_id,
                    wanted_course_id=wanted_course_id,
                )
                db.session.add(new_available_swap)

        db.session.commit()
        return jsonify({"message": "Available swaps added successfully"}), 200
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
