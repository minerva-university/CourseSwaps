from flask import Blueprint, jsonify, request, current_app
from flask_login import login_required, current_user
from flask_cors import CORS

from ..models import db, Courses, UserCurrentCourses, UserCompletedCourses, Users

userdata_bp = Blueprint("userdata_bp", __name__)
CORS(userdata_bp, supports_credentials=True)


@userdata_bp.route("/userdata", methods=["POST"])
@login_required
def register():
    if not current_user.is_authenticated:
        return jsonify({"error": "User not logged in"}), 401

    try:
        data = request.get_json()
        class_year = data["class"]
        major = data["major"]
        currently_assigned = set(data["currentClasses"])
        completed_courses = set(data["previousCourses"])
        minerva_id = data.get("minervaID")
        minor = data.get("minor", None)

        user = Users.query.filter_by(id=current_user.id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        concentration = data.get("concentration", user.concentration)

        user.class_year = class_year
        user.major = major
        user.minerva_id = minerva_id
        user.concentration = concentration
        user.minor = minor

        # Remove current courses not in the new data
        for user_course in user.current_courses:
            if user_course.course.code not in currently_assigned:
                db.session.delete(user_course)

        # Add new current courses
        for current_course_code in currently_assigned:
            course = Courses.query.filter_by(code=current_course_code).first()
            if course:
                # Check if the course-user pair already exists
                if not UserCurrentCourses.query.filter_by(
                    user_id=current_user.id, course_id=course.id
                ).first():
                    user.current_courses.append(
                        UserCurrentCourses(
                            user_id=current_user.id,
                            course_id=course.id,
                        )
                    )
            else:
                return (
                    jsonify({"error": f"Course {current_course_code} not found"}),
                    404,
                )

        # Remove completed courses not in the new data
        for user_completed_course in user.completed_courses:
            if user_completed_course.course.code not in completed_courses:
                db.session.delete(user_completed_course)

        # Add new completed courses
        for completed_course_code in completed_courses:
            course = Courses.query.filter_by(code=completed_course_code).first()
            if course:
                # Check if the course-user pair already exists
                if not UserCompletedCourses.query.filter_by(
                    user_id=current_user.id, course_id=course.id
                ).first():
                    user.completed_courses.append(
                        UserCompletedCourses(
                            user_id=current_user.id,
                            course_id=course.id,
                        )
                    )
            else:
                return (
                    jsonify({"error": f"Course {completed_course_code} not found"}),
                    404,
                )

        db.session.commit()
        return jsonify({"success": "Profile updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error in register: {e}")
        return jsonify({"error": str(e)}), 500


# endpoint to get user data for the update profile page
@userdata_bp.route("/view-userdata", methods=["GET"])
@login_required
def get_user_data():
    try:
        user = Users.query.filter_by(id=current_user.id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        user_data = {
            "class": user.class_year,
            "major": user.major,
            "minervaID": user.minerva_id,
            "concentration": user.concentration,
            "minor": user.minor,
            "currentClasses": [course.course.code for course in user.current_courses],
            "previousCourses": [
                course.course.code for course in user.completed_courses
            ],
        }
        return jsonify(user_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# endpoint to update user data for the update profile page
@userdata_bp.route("/update-user", methods=["PUT"])
@login_required
def update_user():
    try:
        data = request.get_json()
        user = Users.query.filter_by(id=current_user.id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Update basic user data
        user.class_year = data.get("class", user.class_year)
        user.major = data.get("major", user.major)
        user.minerva_id = data.get("minervaID", user.minerva_id)
        user.concentration = data.get("concentration", user.concentration)
        user.minor = data.get("minor", user.minor)

        # Update current courses
        new_current_courses = set(data.get("currentClasses", []))

        # Remove old current courses
        for user_course in user.current_courses[:]:
            if (
                user_course.course is None
                or user_course.course.code not in new_current_courses
            ):
                db.session.delete(user_course)

        # Add new current courses
        for course_code in new_current_courses:
            if all(
                course_code != user_course.course.code
                for user_course in user.current_courses
                if user_course.course is not None
            ):
                course = Courses.query.filter_by(code=course_code).first()
                if course:
                    user.current_courses.append(
                        UserCurrentCourses(user_id=user.id, course_id=course.id)
                    )

        # Update previous courses
        new_previous_courses = set(data.get("previousCourses", []))

        # Remove old previous courses
        for user_completed_course in user.completed_courses[:]:
            if (
                user_completed_course.course is None
                or user_completed_course.course.code not in new_previous_courses
            ):
                db.session.delete(user_completed_course)

        # Add new previous courses
        for course_code in new_previous_courses:
            if all(
                course_code != user_completed_course.course.code
                for user_completed_course in user.completed_courses
                if user_completed_course.course is not None
            ):
                course = Courses.query.filter_by(code=course_code).first()
                if course:
                    user.completed_courses.append(
                        UserCompletedCourses(user_id=user.id, course_id=course.id)
                    )

        db.session.commit()
        return jsonify({"success": "Profile updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error in update_user: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500
