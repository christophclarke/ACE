from django.urls import include, path, re_path
from rest_framework_nested import routers
import rest_framework.routers
from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'departments', views.DepartmentViewSet, base_name='departments')

department_router = routers.NestedSimpleRouter(router, r'departments', lookup='department')
department_router.register(r'courses', views.CourseViewSet, base_name='courses')

course_router = routers.NestedSimpleRouter(department_router, r'courses', lookup='course')
course_router.register(r'sections', views.SectionViewSet, base_name='sections')

direct_router = rest_framework.routers.SimpleRouter()
direct_router.register(r"sections", views.DirectSectionViewSet, base_name='sections_direct')

# sections_router = routers.NestedSimpleRouter(course_router, r'sections', lookup='section')
# sections_router.register(r'labs', views.SectionViewSet, base_name='labs')

app_name = "api"
urlpatterns = [
    re_path(r'^', include(router.urls)),
    re_path(r'^', include(department_router.urls)),
    re_path(r'^', include(course_router.urls)),
    # re_path(r'^', include(sections_router.urls))
    re_path("^auth/register/$", views.RegistrationAPI.as_view()),
    re_path("^auth/login/$", views.LoginAPI.as_view()),
    re_path("^auth/user/$", views.UserAPI.as_view()),
]

urlpatterns += direct_router.urls
