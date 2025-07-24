from django.db import models

class Bid(models.Model):
    product_id = models.CharField(max_length=200, blank=False)
    seller_id = models.CharField(max_length=200, blank=False)
    shipment_id = models.CharField(max_length=200, blank=False)
    bidder_id = models.CharField(max_length=200,blank=False)
    current_bid = models.CharField(max_length=200, blank=False)
    timestamp = models.DateTimeField(auto_now=True)
