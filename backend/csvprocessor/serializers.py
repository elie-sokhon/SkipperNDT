from rest_framework import serializers
from .models import CSVUpload, CSVStats

class CSVUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = CSVUpload
        fields = '__all__'

class CSVStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CSVStats
        fields = '__all__'
