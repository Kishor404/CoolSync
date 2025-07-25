# Generated by Django 5.1.3 on 2024-12-01 12:20

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Shipment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('seller_id', models.CharField(max_length=200)),
                ('product_id', models.CharField(max_length=200)),
                ('device_id', models.CharField(max_length=200)),
                ('driver_id', models.CharField(max_length=200)),
                ('route_id', models.CharField(max_length=200)),
                ('status', models.CharField(choices=[('SC', 'sc'), ('DA', 'da'), ('SS', 'ss'), ('OP', 'op'), ('DR', 'dr'), ('SV', 'sv'), ('PC', 'pc')], default='unset', max_length=20)),
            ],
        ),
    ]
