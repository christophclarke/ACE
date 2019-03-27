from django.contrib.auth import authenticate
from django.contrib.auth.models import User, Group
from courses.models import Department, Course, Section
from rest_framework import serializers
from rest_framework_nested.relations import NestedHyperlinkedRelatedField


# class UserSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = User
#         fields = ('url', 'username', 'email', 'groups')

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials.")


class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'],
                                        None,
                                        validated_data['password'])
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class DepartmentSerializer(serializers.ModelSerializer):
    # url = serializers.HyperlinkedIdentityField(view_name="api:department-detail")

    class Meta:
        model = Department
        fields = '__all__'

    # courses = NestedHyperlinkedRelatedField(
    #     many=True,
    #     read_only=True,   # Or add a queryset
    #     view_name='department-courses-detail',
    #     parent_lookup_kwargs={'department_pk': 'department__pk'}
    # )


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('course_number', 'course_title', 'credit_hours', 'department')

    # sections = NestedHyperlinkedRelatedField(
    #     many=True,
    #     read_only=True,   # Or add a queryset
    #     view_name='department-courses-sections-detail',
    #     parent_lookup_kwargs={'course_pk': 'course__pk'}
    # )


class SectionSerializer(serializers.ModelSerializer):
    instructor = serializers.SlugRelatedField(read_only=True,
                                              slug_field='name')
    course = serializers.StringRelatedField()

    class Meta:
        model = Section
        fields = ("available_seats",
                  "enrolled_students",
                  "section_type",
                  "section_number",
                  "time_begin",
                  "time_end",
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                  "room",
                  "special_enrollment",
                  "additional_info",
                  "course",
                  "instructor",
                  "lab_section")
