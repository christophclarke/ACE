from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import AceUser

admin.site.register(AceUser, UserAdmin)
