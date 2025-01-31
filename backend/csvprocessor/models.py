from django.db import models

class CSVUpload(models.Model):
    file = models.FileField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

class CSVStats(models.Model):
    csv_file = models.ForeignKey(CSVUpload, on_delete=models.CASCADE)
    min_x = models.FloatField()
    max_x = models.FloatField()
    mean_x = models.FloatField()
    median_x = models.FloatField()
    std_x = models.FloatField()
    min_y = models.FloatField()
    max_y = models.FloatField()
    mean_y = models.FloatField()
    median_y = models.FloatField()
    std_y = models.FloatField()
    min_z = models.FloatField()
    max_z = models.FloatField()
    mean_z = models.FloatField()
    median_z = models.FloatField()
    std_z = models.FloatField()
    norm = models.FloatField()
