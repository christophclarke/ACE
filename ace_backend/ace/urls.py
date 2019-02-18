from django.urls import include, path

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('api/', include(('api.urls', 'api'), namespace='api')),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
