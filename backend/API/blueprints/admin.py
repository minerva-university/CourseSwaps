from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from ..models import Users 

admin_bp = Blueprint("admin_bp", __name__)

admin_bp.route("/admin/available-to-pickup", methods=["GET"])


@login_required
def add_availableforpickup():
    print(f"User {current_user} is trying to add available for pickup")
    if not current_user.is_authenticated or current_user.role.name != "admin":
        return jsonify({"error": "User not logged in or is not authorized"}), 401
    # Get all courses available for pickup. Return all data
    try:
        # to available to pickup add the course and increase the count of the course


    except Exception as e:
        print(e)
        return jsonify({"error": "Something went wrong"}), 500
