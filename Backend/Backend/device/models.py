from django.db import models

class Device(models.Model):
    name = models.CharField(max_length=200)
    reading_temperature = models.CharField(max_length=200)
    reading_humidity = models.CharField(max_length=200)
    ethylene_level = models.CharField(max_length=200)
    co2_level = models.CharField(max_length=200)
    remaining_distance = models.CharField(max_length=200)
    quality = models.IntegerField(default=10)
    status = models.CharField(max_length=200,default='stop')
    
