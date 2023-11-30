from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user

from ..models import (
    db,
    Courses,
    CoursesAvailableToSwap,
)

availableswaps_bp = Blueprint("availableswaps_bp", __name__)


@availableswaps_bp.route("/availableswaps", methods=["GET"])
@login_required
def availableswaps():
    print("Current user: ", current_user)
    if not current_user.is_authenticated:
        return jsonify({"error": "User not logged in"}), 401

    # Get all courses available to swap. Return all data
    try:
        available_swaps = db.session.query(CoursesAvailableToSwap).join(Courses).all()
        print("User's available swaps: ", available_swaps)
        return (
            jsonify(
                {
                    "available_swaps": [
                        {
                            "user_id": available_swap.user_id,
                            "giving_course_id": available_swap.giving_course_id,
                            # figure out how to return time here as well
                            "wanted_course_id": available_swap.wanted_course_id,
                            # figure out how to return time here as well
                        }
                        for available_swap in available_swaps
                    ]
                }
            ),
            200,
        )

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
