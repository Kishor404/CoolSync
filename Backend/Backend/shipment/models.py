from django.db import models

class Shipment(models.Model):
    seller_id = models.CharField(max_length=200, blank=False)
    buyer_id = models.CharField(max_length=200, blank=False)
    product_id = models.CharField(max_length=200, blank=False)
    device_id= models.CharField(max_length=200, blank=False)
    driver_id= models.CharField(max_length=200, blank=False)
    route_id= models.CharField(max_length=200, blank=False)
    status= models.CharField(
        max_length=20,
        blank=False,
        default="unset",
        choices=[
            ("SC", "sc"),
            ("DA", "da"),
            ("SS", "ss"),
            ("OP", "op"),
            ("DR", "dr"),
            ("SV", "sv"),
            ("PC", "pc"),
            ("OB", "ob"),
            ("BC", "bc"),
        ]
    )

    # SC - Seller Created
    # DA - Driver Approved
    # SS - Seller Started
    # OP - On Progress
    # DR - Desitination Reached
    # SV - Seller Verified
    # PC - Process Completed
    # OB - On Bidding
    # BC - Bidding Completed


    # 00 - No Bidding
    # 01 - Buyer Only Accepted
    # 10 - Seller Only Accepted
    # 11 - Bidding