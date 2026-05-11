from django.db import models
from django.conf import settings

# Create your models here.
# Physician model
class Physician(models.Model):
    SPECIALTY_CHOICES = [
        ("pediatrician", "Pediatrician"),
        ("cardiologist", "Cardiologist"),
        ("dermatologist", "Dermatologist"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="physician_profile"
    )

    specialty = models.CharField(max_length=100, choices=SPECIALTY_CHOICES)

    bio = models.TextField(blank=True)

    def __str__(self):
        return f"Dr. {self.user.first_name} {self.user.last_name}"