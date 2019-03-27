from django.contrib.auth.models import User, Group
from courses.models import Department, Course, Section
from django.shortcuts import get_object_or_404
from knox.models import AuthToken
from rest_framework import viewsets, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from . import serializers


class MultipleFieldLookupMixin(object):
    """
    Apply this mixin to any view or viewset to get multiple field filtering
    based on a `lookup_fields` attribute, instead of the default single field filtering.
    """
    def get_object(self):
        queryset = self.get_queryset()             # Get the base queryset
        queryset = self.filter_queryset(queryset)  # Apply any filter backends
        filter = {}
        for field in self.lookup_fields:
            if self.kwargs[field]: # Ignore empty fields.
                filter[field] = self.kwargs[field]
        obj = get_object_or_404(queryset, **filter)  # Lookup the object
        self.check_object_permissions(self.request, obj)
        return obj


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = serializers.UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    serializer_class = serializers.DepartmentSerializer

    def get_queryset(self):
        return Department.objects.filter()

    # def list(self, request, ):
    #     queryset = Department.objects.filter()
    #     serializer = serializers.DepartmentSerializer(queryset, many=True, context={'request': request})
    #     return Response(serializer.data)
    #
    # def retrieve(self, request, pk=None):
    #     queryset = Department.objects.filter()
    #     client = get_object_or_404(queryset, abbr=pk)
    #     serializer = serializers.DepartmentSerializer(client, context={'request': request})
    #     return Response(serializer.data)


class CourseViewSet(viewsets.ViewSet):
    serializer_class = serializers.CourseSerializer

    # def get_queryset(self):
    #     print(self.kwargs)
    #     return Course.objects.filter(department=self.kwargs['department_pk'])

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


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = serializers.UserSerializer

    def get_object(self):
        return self.request.user
