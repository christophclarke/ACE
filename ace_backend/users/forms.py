from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from .models import AceUser


class AceUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm):
        model = AceUser
        fields = ('username', 'email')


class AceUserChangeForm(UserChangeForm):

    class Meta:
        model = AceUser
        fields = ('username', 'email')
