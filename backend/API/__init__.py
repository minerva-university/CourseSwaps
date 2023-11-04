import os
from dotenv import load_dotenv
from flask import Flask
from flask_login import LoginManager
from .blueprints.auth import auth_bp
from .blueprints.mycourses import mycourses_bp
from .blueprints.availableswaps import availableswaps_bp
from .blueprints.availableforpickup import availableforpickup_bp
from .populate_db import populate_db
from .models import db

load_dotenv()

login_manager = LoginManager()


def create_app(test_config=None):
    app = Flask(__name__)

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
        populate_db()

    @app.route("/")
    def index():
        return "Welcome to the backend!"

    return app
