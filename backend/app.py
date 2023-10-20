from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite"


db = SQLAlchemy(app)


@app.route("/")
def hello():
    return "Hello World!"


if __name__ == "__main__":
    app.run(port=9000, debug=True)