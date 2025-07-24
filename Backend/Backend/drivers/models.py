from django.db import models

class Driver(models.Model):
    user_id = models.CharField(max_length=200, blank=False)
    route_id = models.CharField(max_length=200, default="0")
    license_number = models.CharField(max_length=200, unique=True, blank=False)
    experience = models.IntegerField(blank=False)
    status = models.CharField(
        max_length=20,
        blank=False,
        default="assigned",
        choices=[
            ("available", "Available"),
            ("assigned", "Assigned"),
        ]
    )
