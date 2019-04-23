from courses.models import AdditionalDepartmentInfo, Course, Department, LabSection, Section
from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from rest_framework import serializers
from users.models import AceUser


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
    additional_info = AdditionalDepartmentInfoSerializer(many=True, read_only=True)

    class Meta:
        model = Department
        fields = ('abbreviation', 'full_name', 'additional_info')


class DirectSectionSerializer(serializers.ModelSerializer):
    pass
