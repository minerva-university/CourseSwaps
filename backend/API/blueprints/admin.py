from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models import db, CoursesAvailableForPickup, Courses
from flask_cors import CORS

admin_bp = Blueprint("admin_bp", __name__)
CORS(admin_bp, supports_credentials=True, origins=["http://localhost:5173"])


@admin_bp.route("/availabletopickup", methods=["GET"])
@login_required
def get_availableforpickup():
    return jsonify("Not implemented"), 200


@admin_bp.route("/availabletopickup", methods=["POST"])
@login_required
def add_availableforpickup():
    print(f"User {current_user} is trying to add available for pickup")
    if not current_user.is_authenticated or current_user.role.name != "admin":
        return jsonify({"error": "User not logged in or is not authorized"}), 401

    data = request.get_json()
    course_code = data.get("courseCode", "")
    quantity = data.get("quantity", 0)

    if not course_code:
        return jsonify({"error": "Invalid course code"}), 400

    try:
        # Check if the course exists
        course_id = Courses.query.filter_by(code=course_code).first().id
        course = Courses.query.get(course_id)
        if not course:
            return jsonify({"error": "Course not found"}), 402
        # Check if the course is already available for pickup
        pickup_course = CoursesAvailableForPickup.query.filter_by(
            course_id=course_id
        ).first()
        if pickup_course:
            # If the course is already available, increment the count by the specified quantity
            pickup_course.count += quantity
        else:
            # If the course is not available, create a new entry with the specified quantity
            new_pickup_course = CoursesAvailableForPickup(
                course_id=course_id, count=quantity
            )
            db.session.add(new_pickup_course)

        db.session.commit()
        return (
            jsonify(
                {"message": f"Added {quantity} {course.name} to available for pickup"}
            ),
            200,
        )

    except Exception as e:
        print(e)
        return jsonify({"error": f"Something went wrong: {e}"}), 500
