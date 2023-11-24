from .models import db
import json
from .models import (
    Users,
    Courses,
    CourseScheduleOptions,
    CoursesAvailableToSwap,
    UserCurrentCourses,
    UserCompletedCourses,
    CoursesAvailableForPickup,
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


def create_fake_users(num_of_users):
    for user_id in range(1, num_of_users):
        new_user = Users(id=str(user_id))
        db.session.add(new_user)

    db.session.commit()
    return "Users added successfully!"


def assign_user_courses():
    users = Users.query.all()
    courses = Courses.query.all()

    for user in users:
        # Assign 3 random courses to each user
        for _ in range(3):
            random_course = faker.random.choice(courses)
            if random_course.prerequisites:
                # If the course has prerequisites, add them to the user's current courses
                for prereq in random_course.prerequisites:
                    new_user_course = UserCompletedCourses(
                        user_id=user.id, course_id=prereq.id
                    )
                    db.session.add(new_user_course)
            new_user_course = UserCurrentCourses(
                user_id=user.id, course_id=random_course.id
            )
            db.session.add(new_user_course)

        # Assign 3 random completed courses to each user
        for _ in range(3):
            random_course = faker.random.choice(courses)
            if random_course.prerequisites:
                # If the course has prerequisites, add them to the user's current courses
                for prereq in random_course.prerequisites:
                    new_user_course = UserCompletedCourses(
                        user_id=user.id, course_id=prereq.id
                    )
                    db.session.add(new_user_course)
            new_user_course = UserCompletedCourses(
                user_id=user.id, course_id=random_course.id
            )
            db.session.add(new_user_course)

    db.session.commit()
    return "User courses assigned successfully!"


def main():
    # Check if initialization has already been done
    flag = InitializationFlag.query.first()
    if flag and flag.is_initialized:
        return "Initialization already done."

    # Load JSON data for courses
    courses_json_data = load_json_data("API/courses_data/courses.json")

    # Populate courses and their prerequisites
    print(populate_courses(courses_json_data))

    # Create a specified number of fake users
    num_of_users = 5  # Modify as needed
    print(create_fake_users(num_of_users))

    # Assign courses to users
    print(assign_user_courses())

    # Set the flag after initialization
    if not flag:
        flag = InitializationFlag(is_initialized=True)
        db.session.add(flag)
    else:
        flag.is_initialized = True
    db.session.commit()

    return "Initialization completed."
