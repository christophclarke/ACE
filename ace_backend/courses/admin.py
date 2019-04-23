from django.contrib import admin

# Register your models here.
from .models import Course, Department, Instructor, Section

admin.site.register(Department)
admin.site.register(Course)
admin.site.register(Section)
admin.site.register(Instructor)
