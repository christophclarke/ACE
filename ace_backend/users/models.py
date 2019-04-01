from django.contrib.auth.models import AbstractUser
from django.db import models
from courses.models import Section


class AceUser(AbstractUser):
    sections = models.ManyToManyField(Section)

    def __str__(self):
        return self.username
