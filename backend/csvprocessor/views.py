import pandas as pd
import numpy as np
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import CSVUpload, CSVStats
from .serializers import CSVStatsSerializer

@api_view(['POST'])
def upload_csv(request):
    file = request.FILES.get('file')
    if not file:
        return Response({"error": "No file provided"}, status=400)

    csv_upload = CSVUpload.objects.create(file=file)

    # Read CSV properly
    df = pd.read_csv(csv_upload.file)

    # Ensure column names match exactly
    required_columns = {'timestamp', 'x', 'y', 'z'}
    if not required_columns.issubset(df.columns):
        return Response({"error": "Invalid CSV format"}, status=400)

    # Convert data to floats (to avoid any parsing errors)
    df['x'] = df['x'].astype(float)
    df['y'] = df['y'].astype(float)
    df['z'] = df['z'].astype(float)

    # Compute statistics
    stats = CSVStats.objects.create(
        csv_file=csv_upload,
        min_x=df['x'].min(), max_x=df['x'].max(),
        mean_x=df['x'].mean(), median_x=df['x'].median(), std_x=df['x'].std(),
        min_y=df['y'].min(), max_y=df['y'].max(),
        mean_y=df['y'].mean(), median_y=df['y'].median(), std_y=df['y'].std(),
        min_z=df['z'].min(), max_z=df['z'].max(),
        mean_z=df['z'].mean(), median_z=df['z'].median(), std_z=df['z'].std(),
        norm=np.linalg.norm(df[['x', 'y', 'z']], axis=1).mean(),  # Compute the norm correctly
    )

    return Response({"message": "File processed successfully"}, status=201)

@api_view(['GET'])
def get_stats(request):
    stats = CSVStats.objects.all()
    serializer = CSVStatsSerializer(stats, many=True)
    return Response(serializer.data)