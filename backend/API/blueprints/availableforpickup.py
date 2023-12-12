from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from flask_cors import CORS
from ..models import (
    db,
    Courses,
    UserCurrentCourses,
    UserCompletedCourses,
    CoursesAvailableForPickup,
    CoursesAvailableToSwap,
)

availableforpickup_bp = Blueprint("availableforpickup_bp", __name__)
CORS(availableforpickup_bp, supports_credentials=True)


@availableforpickup_bp.route("/availableforpickup", methods=["GET"])
@login_required
def available_for_pickup():
    """
    Get all courses available for pickup for the current user
    """
    if not current_user.is_authenticated:
        return jsonify({"error": "Unauthorized access"}), 401
    try:
        completed_course_ids = [
            c.course_id
            for c in UserCompletedCourses.query.filter_by(user_id=current_user.id)
        ]
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
            .filter(
                # Ensuring all prerequisites are met
                ~Courses.prerequisites.any(~Courses.id.in_(completed_course_ids))
            )
            .all()
        )

        course_data = [
            {"id": course.id, "name": course.name, "code": course.code, "count": count}
            for course, count in available_courses
        ]

        print(course_data)
        return jsonify({"available_courses": course_data}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Something went wrong"}), 500


@availableforpickup_bp.route("/pickupcourse", methods=["POST"])
@login_required
def pickup_course():
    """
    Add courses to the current user
    """
    data = request.get_json()
    course_id = data.get("courseId")

    if not current_user.is_authenticated:
        return jsonify({"error": "User not logged in"}), 401

    try:
        # If the user already has 4 courses in their current courses return an error
        if len(current_user.current_courses) >= 4:
            return (
                jsonify(
                    {
                        "error": "You already have 4 courses in your current courses. "
                        "Please drop a course to add another one. "
                    }
                ),
                400,
            )

        # Fetching the course that is available for pickup
        course = (
            db.session.query(Courses, CoursesAvailableForPickup.count)
            .join(
                CoursesAvailableForPickup,
                Courses.id == CoursesAvailableForPickup.course_id,
            )
            .filter(Courses.id == course_id)
            .first()
        )

        # If the course is not available for pickup
        if not course:
            return (
                jsonify(
                    {
                        "error": "Course not available for pickup. Someone might have picked it up already."
                    }
                ),
                400,
            )

        # If the course count is 0
        if course.count == 0:
            return (
                jsonify(
                    {"error": "Course has already been picked up by someone else. "}
                ),
                400,
            )

        # If the user has already completed the course or has it in their current courses
        if (
            db.session.query(UserCompletedCourses)
            .filter(
                (UserCompletedCourses.course_id == course_id)
                & (UserCompletedCourses.user_id == current_user.id)
            )
            .first()
        ) or (
            db.session.query(UserCurrentCourses)
            .filter(
                (UserCurrentCourses.course_id == course_id)
                & (UserCurrentCourses.user_id == current_user.id)
            )
            .first()
        ):
            return jsonify({"error": "Course already taken"}), 400

        # If the course is available for pickup
        # Add the course to the current user
        user_current_course = UserCurrentCourses(
            user_id=current_user.id, course_id=course_id
        )
        db.session.add(user_current_course)
        db.session.commit()

        # Decrement the count of the course available for pickup
        course_available_for_pickup = (
            db.session.query(CoursesAvailableForPickup)
            .filter(CoursesAvailableForPickup.course_id == course_id)
            .first()
        )
        course_available_for_pickup.count -= 1

        # If the count is 0, delete the course from the available for pickup table
        if course_available_for_pickup.count == 0:
            db.session.delete(course_available_for_pickup)

        db.session.commit()

        return jsonify({"message": "Course added to current courses"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Something went wrong"}), 500


@availableforpickup_bp.route("/dropcourse", methods=["POST"])
@login_required
def drop_course():
    """
    Drop courses from the current user and update associated course swaps.
    """
    data = request.get_json()
    course_id = data.get("courseId")

    if not current_user.is_authenticated:
        return jsonify({"error": "User not logged in"}), 401

    try:
        # Remove the course from the current user
        user_current_course = (
            db.session.query(UserCurrentCourses)
            .filter(
                (UserCurrentCourses.course_id == course_id)
                & (UserCurrentCourses.user_id == current_user.id)
            )
            .first()
        )
        if user_current_course:
            db.session.delete(user_current_course)

        # Additionally, remove any swap requests for the dropped course
        swap_requests = (
            db.session.query(CoursesAvailableToSwap)
            .filter_by(giving_course_id=course_id)
            .all()
        )
        for swap_request in swap_requests:
            db.session.delete(swap_request)

        db.session.commit()
        return jsonify({"message": "Course dropped and associated swaps updated"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Something went wrong"}), 500
