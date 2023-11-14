import os
from dotenv import load_dotenv
from flask import Flask, make_response, jsonify, request, session
from flask_login import LoginManager
from .blueprints.auth import auth_bp
from .blueprints.mycourses import mycourses_bp
from .blueprints.availableswaps import availableswaps_bp
from .blueprints.availableforpickup import availableforpickup_bp
from .models import Users

# from .populate_db import populate_db
from .models import db


load_dotenv()

login_manager = LoginManager()


def create_app(test_config=None):
    app = Flask(__name__)
    from .blueprints.auth import oauth

    oauth.init_app(app)
    login_manager.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(mycourses_bp, url_prefix="/api")
    app.register_blueprint(availableswaps_bp, url_prefix="/api")
    app.register_blueprint(availableforpickup_bp, url_prefix="/api")

    # Configuration
    app.config.from_mapping(
        SQLALCHEMY_DATABASE_URI=os.environ.get("DATABASE_URL"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SESSION_COOKIE_SAMESITE="None",
        SESSION_COOKIE_SECURE=True,
        SECRET_KEY=os.environ.get("SECRET_KEY"),
    )

    # Override config with test config if passed
    if test_config:
        app.config.update(test_config)

    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)

    with app.app_context():
        db.create_all()
        # populate_db()

    @app.after_request
    def after_request(response):
        # Define allowed origins
        allowed_origins = ["http://localhost:5173"]

        # Get the origin of the request
        origin = request.headers.get("Origin")

        # If the origin is in our list of allowed origins, set the CORS headers
        if origin in allowed_origins:
            response.headers.add("Access-Control-Allow-Origin", origin)
            response.headers.add("Vary", "Origin")

        # Specify which headers are allowed in requests
        response.headers.add(
            "Access-Control-Allow-Headers",
            "Content-Type,Authorization,X-Requested-With",
        )

        # Specify which methods are allowed
        response.headers.add(
            "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        )

        # Allow cookies and other credentials
        response.headers.add("Access-Control-Allow-Credentials", "true")

        return response

    @app.route("/")
    def index():
        return "Welcome to the backend!"

    @login_manager.user_loader
    def load_user(user_id):
        return Users.query.get(user_id)

    @app.route("/api/test", methods=["GET"])
    def test():
        try:
            return jsonify("test")
        except Exception as e:
            app.logger.error(f"Unexpected error: {e}", exc_info=True)
            return make_response(
                jsonify({"error": "Internal Server Error"}), 500
            )  # noqa

    return app
