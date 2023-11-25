from .models import db
import json
from .models import (
    Courses,
    course_prerequisites,
    InitializationFlag,
)


from faker import Faker


faker = Faker()


def load_json_data(file_path):
    with open(file_path, "r") as json_file:
        data = json.load(json_file)
    return data


def populate_courses(json_data):
    # First, create all courses if they don't exist
    for course_data in json_data["courses"]:
        course_code = course_data["courseId"]
        existing_course = Courses.query.filter_by(code=course_code).first()

        if not existing_course:
            new_course = Courses(
                name=course_data["courseName"],
                code=course_code,
                # Set other fields as necessary
            )
            db.session.add(new_course)

    db.session.commit()

    # Then, add prerequisites if they don't exist
    for course_data in json_data["courses"]:
        course = Courses.query.filter_by(code=course_data["courseId"]).first()
        if course:
            for prereq_group in course_data["preReqs"]:
                for prereq_code in prereq_group:
                    if prereq_code != "None":
                        prereq_course = Courses.query.filter_by(
                            code=prereq_code
                        ).first()
                        if prereq_course:
                            # Check if the prerequisite relation already exists
                            existing_prerequisite = (
                                db.session.query(course_prerequisites)
                                .filter_by(
                                    course_id=course.id,
                                    prerequisite_id=prereq_course.id,
                                )
                                .first()
                            )
                            if not existing_prerequisite:
                                # Insert into the association table
                                insert_prerequisite = (
                                    course_prerequisites.insert().values(
                                        course_id=course.id,
                                        prerequisite_id=prereq_course.id,
                                    )
                                )
                                db.session.execute(insert_prerequisite)
            db.session.commit()

    return "Courses and prerequisites added successfully!"


def main():
    # Check if initialization has already been done
    flag = InitializationFlag.query.first()
    if flag and flag.is_initialized:
        return "Initialization already done."

    # Load JSON data for courses
    courses_json_data = load_json_data("API/courses_data/courses.json")

    # Populate courses and their prerequisites
    print(populate_courses(courses_json_data))
    # Set the flag after initialization
    if not flag:
        flag = InitializationFlag(is_initialized=True)
        db.session.add(flag)
    else:
        flag.is_initialized = True
    db.session.commit()

    return "Initialization completed."
