from .models import db
from .models import (
    Users,
    Courses,
    UserCurrentCourses,
    UserCompletedCourses,
    CoursesAvailableToSwap,
)

from sqlalchemy.exc import IntegrityError


def clear_data():
    # This will clear all data from the tables
    # Be careful with this in a production environment!
    db.session.query(UserCurrentCourses).delete()
    db.session.query(CoursesAvailableToSwap).delete()
    db.session.query(UserCompletedCourses).delete()
    db.session.query(Users).delete()
    db.session.query(Courses).delete()
    db.session.commit()


def populate_db():
    # Clear existing data first (optional, use with caution!)
    clear_data()

    # Add Users
    users = [
        Users(
            name="John Doe", email="john.doe@example.com", password="hashedpassword123"
        ),
        Users(
            name="Jane Smith",
            email="jane.smith@example.com",
            password="hashedpassword456",
        ),
        Users(
            name="Alice Johnson",
            email="alice.johnson@example.com",
            password="hashedpassword789",
        ),
        Users(
            name="Bob Williams",
            email="bob.williams@example.com",
            password="hashedpassword101112",
        ),
        # Add more users as needed
    ]

    for user in users:
        if not Users.query.filter_by(email=user.email).first():
            db.session.add(user)

    # Add Courses
    courses = [
        Courses(name="Introduction to Programming", code="CS101", time="9:00 AM"),
        Courses(
            name="Data Structures", code="CS201", time="10:00 AM", prerequisites="CS101"
        ),
        Courses(
            name="Algorithms", code="CS301", time="11:00 AM", prerequisites="CS201"
        ),
        Courses(
            name="Computer Networks",
            code="CS401",
            time="1:00 PM",
            prerequisites="CS301",
        ),
        Courses(
            name="Operating Systems",
            code="CS501",
            time="2:00 PM",
            prerequisites="CS201",
        ),
        # Add more courses as needed
    ]

    for course in courses:
        if not Courses.query.filter_by(code=course.code).first():
            db.session.add(course)

        # Add UserCurrentCourses
    user_current_courses = [
        # Assuming user_id and course_id are correct and exist
        UserCurrentCourses(user_id=1, course_id=1),
        UserCurrentCourses(user_id=1, course_id=2),
        # ... add more as needed
    ]

    for user_course in user_current_courses:
        existing_user_course = UserCurrentCourses.query.filter_by(
            user_id=user_course.user_id, course_id=user_course.course_id
        ).first()
        if not existing_user_course:
            db.session.add(user_course)

    # Add UserCompletedCourses
    user_completed_courses = [
        # Assuming user_id and course_id are correct and exist
        UserCompletedCourses(user_id=1, course_id=3),
        UserCompletedCourses(user_id=2, course_id=4),
        # ... add more as needed
    ]

    for user_course in user_completed_courses:
        existing_user_course = UserCompletedCourses.query.filter_by(
            user_id=user_course.user_id, course_id=user_course.course_id
        ).first()
        if not existing_user_course:
            db.session.add(user_course)

    # Add CoursesAvailableToSwap
    courses_available_to_swap = [
        # Assuming user_id, giving_course_id, and wanted_course_id are correct and exist
        CoursesAvailableToSwap(user_id=1, giving_course_id=2, wanted_course_id=3),
        CoursesAvailableToSwap(user_id=2, giving_course_id=1, wanted_course_id=2),
    ]

    for swap in courses_available_to_swap:
        existing_swap = CoursesAvailableToSwap.query.filter_by(
            user_id=swap.user_id,
            giving_course_id=swap.giving_course_id,
            wanted_course_id=swap.wanted_course_id,
        ).first()
        if not existing_swap:
            db.session.add(swap)

    # Try to commit changes to the database
    try:
        db.session.commit()
        print("Database populated with data successfully!")
    except IntegrityError as e:
        db.session.rollback()
        print(f"An error occurred: {e}")
