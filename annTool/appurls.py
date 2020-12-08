from django.conf.urls import url
from annTool import views

urlpatterns = [
    url(r'^label/$', views.label),
]
