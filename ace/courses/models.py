from django.db import models
from datetime import time
import logging


class Department(models.Model):
    abbreviation: str = models.CharField(max_length=8, primary_key=True)
    full_name: str = models.CharField(max_length=255)
    logger: logging.Logger = logging.getLogger("Department")

    def __str__(self) -> str:
        return self.abbreviation

    @classmethod
    def get_department(cls, abbreviation, full_name):
        """
        Returns the predefined department, will create one if necessary
        Throws: Department.MultipleObjectsReturned
        """
        dept, created = Department.objects.get_or_create(abbreviation=abbreviation,
                                                         defaults={'full_name': full_name})
        if created:
            cls.logger.debug(f"Department Created: {dept.__str__()}")

        return dept


class Instructor(models.Model):
    # Auto Generated InstructorID
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, blank=True)
    website = models.CharField(max_length=255, blank=True)
    logger = logging.getLogger("Instructor")

    def __str__(self):
        return self.name

    @classmethod
    def get_instructor(cls, name):
        """
        Returns the predefined instructor, will create one if necessary
        Throws: Instructor.MultipleObjectsReturned
        """
        inst, created = Instructor.objects.get_or_create(name=name)
        if created:
            cls.logger.debug(f"Instructor Created: {inst.__str__()}")

        return inst


class Course(models.Model):
    # Auto Generated CourseID
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    course_number = models.IntegerField()
    course_title = models.CharField(max_length=255)
    credit_hours = models.IntegerField()
    logger = logging.getLogger("Course")

    def __str__(self):
        return self.department.abbreviation + " " + str(self.course_number)

    @classmethod
    def get_course(cls, department: Department, course_number: int, course_title: str, credit_hours: int):
        """
        Returns the predefined course, will create one if necessary
        Throws: Course.MultipleObjectsReturned
        """
        course, created = Course.objects.get_or_create(department=department,
                                                       course_number=course_number,
                                                       defaults={'course_title': course_title,
                                                                 'credit_hours': credit_hours})
        if created:
            cls.logger.debug(f"Course Created: {course.__str__()}")

        return course


class Section(models.Model):
    # Auto Generated SectionID
    course: Course = models.ForeignKey(Course, on_delete=models.CASCADE)
    available_seats: int = models.IntegerField()
    enrolled_students: int = models.IntegerField()
    section_type: str = models.CharField(max_length=255, blank=True)
    section_number: int = models.IntegerField()
    time_begin: time = models.TimeField()
    time_end: time = models.TimeField()
    monday: bool = models.BooleanField()
    tuesday: bool = models.BooleanField()
    wednesday: bool = models.BooleanField()
    thursday: bool = models.BooleanField()
    friday: bool = models.BooleanField()
    saturday: bool = models.BooleanField()
    room: str = models.CharField(max_length=255)
    special_enrollment: str = models.CharField(max_length=255, blank=True)
    instructor: Instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE)

    logger = logging.getLogger("Section")

    def __str__(self):
        return self.course.__str__() + " [" + str(self.section_number) + "]"

    @classmethod
    def get_section(cls, course: Course, section_number: int, available: int, enrolled: int, sec_type: str,
                    time_b: time, time_e: time, days: (bool, bool, bool, bool, bool, bool), room: str,
                    special: str, inst: Instructor):
        """
        Returns the predefined section, will create one if necessary
        Throws: Section.MultipleObjectsReturned
        """
        section, created = Section.objects.get_or_create(course=course,
                                                         section_number=section_number,
                                                         section_type=sec_type,
                                                         defaults={'available_seats': available,
                                                                   'enrolled_students': enrolled,
                                                                   'time_begin': time_b,
                                                                   'time_end': time_e,
                                                                   'monday': days[0],
                                                                   'tuesday': days[1],
                                                                   'wednesday': days[2],
                                                                   'thursday': days[3],
                                                                   'friday': days[4],
                                                                   'saturday': days[5],
                                                                   'room': room,
                                                                   'special_enrollment': special,
                                                                   'instructor': inst})
        if created:
            cls.logger.debug(f"Section Created: {section.__str__()}")

        return section
