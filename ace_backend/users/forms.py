from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import AceUser


class AceUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm):
        model = AceUser
        fields = ('username', 'email')


class AceUserChangeForm(UserChangeForm):

    class Meta:
        model = AceUser
        fields = ('username', 'email')
