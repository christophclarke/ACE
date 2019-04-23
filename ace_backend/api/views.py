from courses.models import Course, Department, Section
from django.contrib.auth.models import Group
from django.shortcuts import get_object_or_404
from knox.models import AuthToken
from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from users.models import AceUser

from . import serializers


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed.
    """
    queryset = AceUser.objects.all().order_by('-date_joined')
    serializer_class = serializers.UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows departments to be viewed.
    """
    serializer_class = serializers.DepartmentSerializer

    def get_queryset(self):
        return Department.objects.filter()


class CourseViewSet(viewsets.ViewSet):
    serializer_class = serializers.CourseSerializer

    def list(self, request, department_pk=None):
        queryset = Course.objects.filter(department=department_pk)
        serializer = serializers.CourseSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, department_pk=None, pk=None):
        queryset = Course.objects.filter(department=department_pk)
        course = get_object_or_404(queryset, course_number=pk)
        serializer = serializers.CourseSerializer(course)
        return Response(serializer.data)


class SectionViewSet(viewsets.ViewSet):
    serializer_class = serializers.SectionSerializer

    def list(self, request, department_pk=None, course_pk=None):
        print(self.kwargs)
        queryset = Section.objects.filter(course__department=department_pk, course__course_number=course_pk)
        serializer = serializers.SectionSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, department_pk=None, course_pk=None):
        queryset = Section.objects.filter(course__department=department_pk, course__course_number=course_pk, section_number=pk)
        section = get_object_or_404(queryset)
        serializer = serializers.SectionSerializer(section)
        return Response(serializer.data)


class DirectSectionViewSet(viewsets.ViewSet):
    serializer_class = serializers.SectionSerializer

    def retrieve(self, request, pk=None):
        queryset = Section.objects.filter(pk=pk)
        section = get_object_or_404(queryset)
        serializer = serializers.SectionSerializer(section)
        return Response(serializer.data)


class RegistrationAPI(generics.GenericAPIView):
    serializer_class = serializers.CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": serializers.UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)
        })


class LoginAPI(generics.GenericAPIView):
    serializer_class = serializers.LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": serializers.UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)
        })


class UserAPI(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    queryset = AceUser.objects.all()
    serializer_class = serializers.UserSerializer

    def get_object(self):
        return self.request.user


