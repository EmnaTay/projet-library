from django.contrib.auth.models import AbstractUser
from django.db import models

# Choices for dropdown fields
MAJOR_CHOICES = [
    ("Business", "Business"),
    ("Finance", "Finance"),
    ("Marketing", "Marketing"),
    ("BI", "BI"),
]

YEAR_CHOICES = [
    ("1st Year", "1st Year"),
    ("2nd Year", "2nd Year"),
    ("3rd Year", "3rd Year"),
    ("Master 1st", "Master 1st"),
    ("Master 2nd", "Master 2nd"),
]


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    major = models.CharField(choices=MAJOR_CHOICES, max_length=50)
    year = models.CharField(choices=YEAR_CHOICES, max_length=10)

    def save(self, *args, **kwargs):
        # Ensure email ends with @ihec.ucar.tn
        if not self.email.endswith("@ihec.ucar.tn"):
            raise ValueError("Email must end with @ihec.ucar.tn")
        super().save(*args, **kwargs)
