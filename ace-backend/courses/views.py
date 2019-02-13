from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404

from .models import Course, Department, Section


def index(request):
    return render(request, "courses/index.html")


def department_list(request):
    data = list(Department.objects.values_list("abbreviation", flat=True))
    return JsonResponse(data, safe=False)


def course_list(request, dept="all"):
    ret_dict = {}
    if dept == "all":
        q_set = Department.objects.all()
    else:
        q_set = Department.objects.filter(abbreviation=dept)

    for department in q_set:
        dept_list = Course.objects.filter(department=department)
        dept_list = [str(course) for course in dept_list]
        ret_dict[department.abbreviation] = dept_list

    return JsonResponse(ret_dict)


def course_info(request, dept, course_number):
    course = get_object_or_404(Course, department=dept, course_number=int(course_number))
    sections = list(Section.objects.filter(course=course))
    return render(request, "courses/course_info.html", {"course": course, "sections": sections})
