# Generated by Django 5.1.3 on 2024-12-01 08:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('drivers', '0004_alter_driver_route_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='driver',
            name='route_id',
            field=models.CharField(default='0', max_length=200),
        ),
    ]
