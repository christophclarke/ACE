# Generated by Django 2.1.7 on 2019-04-11 05:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0003_additionaldepartmentinfo'),
    ]

    operations = [
        migrations.AddField(
            model_name='additionaldepartmentinfo',
            name='title',
            field=models.CharField(blank=True, max_length=225),
        ),
    ]