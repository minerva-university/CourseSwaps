from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user

from ..models import Users, db, Courses, UserCurrentCourses, UserCompletedCourses, CoursesAvailableToSwap

availableforpickup_bp = Blueprint("availableforpickup_bp", __name__)

availableforpickup_bp.route("/availableforpickup", methods=["GET"])
@login_required

def availableforpickup():
    print("Current user: ", current_user)
    if not current_user.is_authenticated:
        return jsonify({"error": "User not logged in"}), 401
    
    # Get all courses available for pickup. Return all data
    try:
        pass
        # logic still has to be figured out
        
    except Exception as e:
        print(e)
        return jsonify({"error": "Something went wrong"}), 500