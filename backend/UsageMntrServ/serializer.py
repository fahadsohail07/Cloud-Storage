from rest_framework import serializers

from .models import UsageMonitor


class ReadOnlyUsageMonitorSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = UsageMonitor
        depth = 1
        fields='__all__'

class WriteOnlyUsageMonitorSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = UsageMonitor
        fields='__all__'