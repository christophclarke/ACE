from django.db import models


class Department(models.Model):
    abbreviation = models.CharField(max_length=8, primary_key=True)
    full_name = models.CharField(max_length=255)

    def __str__(self):
        return self.full_name


class Instructor(models.Model):
    # Auto Generated InstructorID
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, blank=True)
    website = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name


class Course(models.Model):
    # Auto Generated CourseID
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    course_number = models.IntegerField()
    course_title = models.CharField(max_length=255)
    credit_hours = models.IntegerField()

    def __str__(self):
        return self.department.abbreviation + " " + str(self.course_number)


class Section(models.Model):
    # Auto Generated SectionID
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    available_seats = models.IntegerField()
    enrolled_students = models.IntegerField()
    section_type = models.CharField(max_length=255, blank=True)
    section_number = models.IntegerField()
    time_begin = models.TimeField()
    time_end = models.TimeField()
    monday = models.BooleanField()
    tuesday = models.BooleanField()
    wednesday = models.BooleanField()
    thursday = models.BooleanField()
    friday = models.BooleanField()
    saturday = models.BooleanField()
    sunday = models.BooleanField()
    room = models.CharField(max_length=255)
    special_enrollment = models.CharField(max_length=255, blank=True)
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE)

    def __str__(self):
        return self.course.__str__() + " [" + str(self.section_number) + "]"
