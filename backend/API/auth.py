from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user
from .models import Users, db


auth_bp = Blueprint("auth_bp", __name__)


@auth_bp.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    if username and password:
        hashed_password = generate_password_hash(password, method="sha256")
        new_user = Users(name=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Registration successful"}), 200
    return jsonify({"error": "Invalid Input"}), 400


@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    user = Users.query.filter_by(name=username).first()
    if user and check_password_hash(user.password, password):
        # Login logic here, e.g., set a session or token
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"error": "Invalid credentials"}), 400


@auth_bp.route("/api/logout", methods=["POST"])
def logout():
    # Logout logic here, e.g., clear a session or token
    return jsonify({"message": "Logout successful"}), 200
