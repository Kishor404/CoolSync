# Generated by Django 5.1.3 on 2024-12-01 07:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('drivers', '0003_alter_driver_route_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='driver',
            name='route_id',
            field=models.CharField(max_length=200),
        ),
    ]
