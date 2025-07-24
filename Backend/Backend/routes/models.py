from django.db import models
from django.core.exceptions import ValidationError

def validate_coordinates(value):
    if not isinstance(value, dict) or 'lon' not in value or 'lat' not in value:
        raise ValidationError("Invalid coordinates format. Expected {'lon': <value>, 'lat': <value>}.")

def validate_halt_data(value):
    if not isinstance(value, dict) or 'data' not in value or not isinstance(value['data'], list):
        raise ValidationError("Invalid halt format. Expected {'data': [{'lon': <value>, 'lat': <value>}]}.")

class Routes(models.Model):
    source = models.JSONField(blank=False, validators=[validate_coordinates])
    destination = models.JSONField(blank=False, validators=[validate_coordinates])
    current_location = models.JSONField(blank=False, validators=[validate_coordinates])
    halt = models.JSONField(blank=False, validators=[validate_halt_data])
    updated = models.DateTimeField(auto_now=True)
