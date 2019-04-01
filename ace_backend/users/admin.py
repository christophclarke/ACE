from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from .forms import AceUserCreationForm, AceUserChangeForm
from .models import AceUser

# class AceUserAdmin(UserAdmin):
#     add_form = AceUserCreationForm
#     form = AceUserChangeForm
#     model = AceUser
#     list_display = ['email', 'username',]

admin.site.register(AceUser, UserAdmin)
