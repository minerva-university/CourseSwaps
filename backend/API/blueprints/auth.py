from flask import Blueprint, request, jsonify, url_for, redirect, session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user
from ..models import Users, db
from authlib.integrations.flask_client import OAuth
import os

auth_bp = Blueprint("auth_bp", __name__)
oauth = OAuth()

google = oauth.register(
    name="google",
    client_id=os.environ.get("GOOGLE_CLIENT_ID"),
    client_secret=os.environ.get("GOOGLE_CLIENT_SECRET"),
    access_token_url="https://accounts.google.com/o/oauth2/token",
    access_token_params=None,
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    authorize_params=None,
    api_base_url="https://www.googleapis.com/oauth2/v1/",
    client_kwargs={"scope": "openid profile email"},
)


@auth_bp.route("/register", methods=["POST"])
def register():
    #  TODO : needs refactoring to cater for the now changed auth login.
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")
    if username and password:
        hashed_password = generate_password_hash(password, method="pbkdf2")
        new_user = Users(name=username, password=hashed_password, email=email)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Registration successful"}), 200
    return jsonify({"error": "Invalid Input"}), 400


@auth_bp.route("/auth/google", methods=["POST"])
def login():
    data = request.get_json()
    access_token = data.get("access_token")

    google = oauth.create_client("google")

    resp = google.get("userinfo", token=access_token)
    user_info = resp.json()

    user_id = user_info["id"]
    given_name = user_info["given_name"]
    picture = user_info["picture"]

    user = Users.query.filter_by(id=user_id).first()

    if not user:
        user = Users(id=user_id)
        db.session.add(user)
        db.session.commit()

    login_user(user)
    session["profile"] = resp.json()

    return (
        jsonify(
            {
                "user": {
                    "id": user_id,
                    "given_name": given_name,
                    "picture": picture,
                },
                "message": "Login successful",
            }
        ),
        200,
    )


@auth_bp.route("/logout", methods=["POST"])
def logout():
    # Logout logic here, e.g., clear a session or token
    return jsonify({"message": "Logout successful"}), 200
