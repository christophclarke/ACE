from django.contrib import admin

# Register your models here.
from .models import Department, Course, Section, Instructor

admin.site.register(Department)
admin.site.register(Course)
admin.site.register(Section)
admin.site.register(Instructor)
