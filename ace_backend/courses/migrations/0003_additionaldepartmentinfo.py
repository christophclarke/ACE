# Generated by Django 2.1.7 on 2019-04-11 04:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0002_course_course_description'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdditionalDepartmentInfo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(blank=True, max_length=255)),
                ('info', models.TextField(blank=True)),
                ('department', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='additional_info', to='courses.Department')),
            ],
        ),
    ]