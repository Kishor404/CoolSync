# Generated by Django 5.1.3 on 2024-12-07 00:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('routes', '0004_alter_routes_product_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='routes',
            name='product_id',
        ),
        migrations.RemoveField(
            model_name='routes',
            name='seller_id',
        ),
    ]
