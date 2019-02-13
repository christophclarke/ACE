from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("courses/<str:dept>/<int:course_number>", views.course_info, name="course_info"),
    path("course-list", views.course_list, name="full_course_list"),
    path("course-list/<str:dept>", views.course_list, name="course_list"),
    path("department-list", views.department_list, name="department_list")
]
