from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from flask_cors import CORS
from ..models import db, Courses, UserCurrentCourses, UserCompletedCourses, Users

userdata_bp = Blueprint("userdata_bp", __name__)
CORS(userdata_bp, supports_credentials=True)


@userdata_bp.route("/userdata", methods=["POST"])
@login_required
def register():
    data = request.get_json()
    class_year = data["class"]
    major = data["major"]
    currently_assigned = set(data["currentClasses"])  # Use sets for easier comparison
    completed_courses = set(data["previousCourses"])

    try:
        user = Users.query.filter_by(id=current_user.id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        user.class_year = class_year
        user.major = major

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
        return jsonify({"error": str(e)}), 500
