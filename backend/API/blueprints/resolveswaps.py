from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from flask_cors import CORS
from ..models import (
    db,
    CoursesAvailableToSwap,
    UserCurrentCourses,
)

# Blueprint for available swaps functionality
resolveswaps_bp = Blueprint("resolveswaps_bp", __name__)
CORS(resolveswaps_bp, supports_credentials=True)


# Endpoint to confirm a course swap
@resolveswaps_bp.route("/confirm_swap", methods=["POST"])
@login_required
def confirm_swap():
    # Ensure the user is authenticated
    if not current_user.is_authenticated:
        return jsonify({"error": "Unauthorized access"}), 401

    try:
        data = request.get_json()
        print(data)
        swap_id = data.get("selectedSwap")
        swap = CoursesAvailableToSwap.query.get(swap_id)

        # Check if the swap exists in the database
        if not swap:
            return jsonify({"error": "Swap not found"}), 404

        # Extract user IDs and course IDs from the swap details
        user1_id = current_user.id
        user2_id = swap.user_id
        user1_course_id = swap.wanted_course_id
        user2_course_id = swap.giving_course_id

        # Check if User 1 has the course they want to swap
        user1_has_course = (
            UserCurrentCourses.query.filter_by(
                user_id=user1_id, course_id=user1_course_id
            ).first()
            is not None
        )

        # Check if User 2 has the course they are offering
        user2_has_course = (
            UserCurrentCourses.query.filter_by(
                user_id=user2_id, course_id=user2_course_id
            ).first()
            is not None
        )

        if not user1_has_course or not user2_has_course:
            return (
                jsonify(
                    {
                        "error": "One or both users do not have the required courses for the swap"
                    }
                ),
                400,
            )

        # Transaction to update course assignments
        with db.session.begin_nested():
            # Update courses for user1
            UserCurrentCourses.query.filter_by(
                user_id=user1_id, course_id=user1_course_id
            ).delete()
            new_course_for_user1 = UserCurrentCourses(
                user_id=user1_id, course_id=user2_course_id
            )
            db.session.add(new_course_for_user1)

            # Update courses for user2
            UserCurrentCourses.query.filter_by(
                user_id=user2_id, course_id=user2_course_id
            ).delete()
            new_course_for_user2 = UserCurrentCourses(
                user_id=user2_id, course_id=user1_course_id
            )
            db.session.add(new_course_for_user2)

            # Remove the swap request as it has been completed
            db.session.delete(swap)

        # Commit the transaction
        db.session.commit()
        return jsonify({"message": "Swap confirmed successfully"}), 200

    except Exception as e:
        # Rollback in case of error
        print(e)
        db.session.rollback()
        return jsonify({"error": "An error occurred during the swap"}), 500
