from courses.models import Section
from django.contrib.auth.models import AbstractUser
from django.db import models


class AceUser(AbstractUser):
    sections = models.ManyToManyField(Section)

    def __str__(self):
        return self.username
