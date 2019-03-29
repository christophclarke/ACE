from django.contrib.auth.models import AbstractUser
from django.db import models


class AceUser(AbstractUser):
    def __str__(self):
        return self.username
    # add additional fields in here
