from django.db import models

class User(models.Model):
    name = models.CharField(max_length=200, default="None")
    phone = models.CharField(max_length=10, unique=True, blank=False)
    password = models.CharField(max_length=128, blank=False)
    location = models.JSONField(default={"lon":"0","lat":"0"})
    role = models.CharField(
        max_length=20,
        blank=False,
        default="customer",
        choices=[
            ("buyer", "Buyer"),
            ("seller", "Seller"),
            ("driver", "Driver"),
            ("customer", "Customer"),
            ("hub manager", "Hub Manager")
        ]
    )
