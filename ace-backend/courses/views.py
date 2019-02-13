from django.http import JsonResponse
from django.shortcuts import render

from .models import Course, Department


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
