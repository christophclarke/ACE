# Generated by Django 2.1.5 on 2019-02-09 04:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0005_auto_20190207_2231'),
    ]

    operations = [
        migrations.AlterField(
            model_name='section',
            name='available_seats',
            field=models.IntegerField(null=True),
        ),
    ]
