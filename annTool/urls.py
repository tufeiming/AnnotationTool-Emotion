from annTool import views
from django.urls import path

urlpatterns = [
    path('', views.label),
    path('label/', views.label, name='label'),
]
