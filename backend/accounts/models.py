from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

# User model
class User(AbstractUser):
    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("physician", "Physician"),
        ("patient", "Patient"),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)




