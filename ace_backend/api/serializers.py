from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from courses.models import Department, Course, Section, LabSection, AdditionalDepartmentInfo
from rest_framework import serializers
from rest_framework.relations import HyperlinkedIdentityField
from rest_framework.serializers import ListSerializer
from rest_framework_nested.relations import NestedHyperlinkedRelatedField
from users.models import AceUser

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
        model = AceUser
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = AceUser.objects.create_user(validated_data['username'],
                                           None,
                                           validated_data['password'])
        return user


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('course_number', 'course_title', 'credit_hours', 'course_description', 'department')

    # sections = NestedHyperlinkedRelatedField(
    #     many=True,
    #     read_only=True,   # Or add a queryset
    #     view_name='department-courses-sections-detail',
    #     parent_lookup_kwargs={'course_pk': 'course__pk'}
    # )


class LabSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabSection
        fields = '__all__'


class SectionSerializer(serializers.ModelSerializer):
    instructor = serializers.SlugRelatedField(read_only=True,
                                              slug_field='name')
    course = CourseSerializer(read_only=True)
    lab_section = LabSectionSerializer(read_only=True)

    class Meta:
        model = Section
        # fields = ("available_seats",
        #           "enrolled_students",
        #           "section_type",
        #           "section_number",
        #           "time_begin",
        #           "time_end",
        #           "monday",
        #           "tuesday",
        #           "wednesday",
        #           "thursday",
        #           "friday",
        #           "saturday",
        #           "room",
        #           "special_enrollment",
        #           "additional_info",
        #           "course",
        #           "instructor",
        #           "lab_section")
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    sections = serializers.PrimaryKeyRelatedField(queryset=Section.objects.all(), many=True)

    class Meta:
        model = AceUser
        fields = ('id', 'username', 'sections')


class AdditionalDepartmentInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdditionalDepartmentInfo
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    # url = serializers.HyperlinkedIdentityField(view_name="api:department-detail")
    additional_info = AdditionalDepartmentInfoSerializer(many=True, read_only=True)

    class Meta:
        model = Department
        fields = ('abbreviation', 'full_name', 'additional_info')

    # courses = NestedHyperlinkedRelatedField(
    #     many=True,
    #     read_only=True,   # Or add a queryset
    #     view_name='department-courses-detail',
    #     parent_lookup_kwargs={'department_pk': 'department__pk'}
    # )


class DirectSectionSerializer(serializers.ModelSerializer):
    pass
