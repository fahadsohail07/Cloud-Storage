from django.shortcuts import render

# Create your views here.

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import viewsets,status
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import UsageMonitor
from .serializer import ReadOnlyUsageMonitorSerializer,WriteOnlyUsageMonitorSerializer


class UsageMonitorViewSet(viewsets.ModelViewSet):

    def get_queryset(self):
        user = self.get_user()
        querySet = UsageMonitor.objects.filter(created_by=user)
        return querySet.order_by("created_on")
    
    def get_serializer_class(self):
        if self.action in ['create','update','partial_update']:
            return WriteOnlyUsageMonitorSerializer
        return ReadOnlyUsageMonitorSerializer
    
    def get_user(self):
        user = self.request.user
        return user
    
    def perform_create(self, serializer):
        user = self.get_user()
        serializer.save(created_by=user)
        