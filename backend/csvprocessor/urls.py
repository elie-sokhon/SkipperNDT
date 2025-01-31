from django.urls import path
from .views import upload_csv, get_stats

urlpatterns = [
    path('upload/', upload_csv, name='upload_csv'),
    path('stats/', get_stats, name='get_stats'),
]
