from API import create_app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=7070)
