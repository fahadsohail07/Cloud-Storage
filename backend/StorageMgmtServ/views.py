from django.shortcuts import render
from django.db.models import Sum 

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import viewsets,status
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import StorageFile,Folder,get_timestamp
from .serailizer import WriteOnlyFileSerializer,ReadOnlyFileSerializer,WriteOnlyFolderSerializer,ReadOnlyFolderSerializer
from UsageMntrServ.models import UsageMonitor

from datetime import datetime, time
import pytz
class FileViewSet(viewsets.ModelViewSet):

    def get_queryset(self):
        user = self.get_user()
        parent = self.request.query_params.get('parent',None)
        querySet = StorageFile.objects.filter(created_by=user)
        if parent:
            querySet = querySet.filter(folder__id=parent)
        else:
            querySet = querySet.filter(folder=None)
        return querySet.order_by("created_on")

    def get_serializer_class(self):
        if self.action in ['create','update','partial_update']:
            return WriteOnlyFileSerializer
        return ReadOnlyFileSerializer
    
    def create(self, request):
        user = self.get_user()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        name =  serializer.data['name'] 
        size = serializer.data['size']
        folder = serializer.data['folder']
        minus_load = 0

        if StorageFile.objects.filter(created_by=user,name=name,folder=folder).exists():
            minus_load += StorageFile.objects.filter(created_by=user,name=name,folder=folder)[0].size

        total_size = StorageFile.objects.filter(created_by = user).aggregate(total_size=Sum("size")).get('total_size',0)
        start_of_day = datetime.combine(datetime.now(tz=pytz.UTC), time.min).timestamp()
        total_band = UsageMonitor.objects.filter(created_by=user,created_on__gte=start_of_day).aggregate(total_size=Sum("size")).get('total_size',0)
        if not total_size:
            total_size = 0

        if not total_band:
            total_band = 0 

        if ((size + total_size)-minus_load) > user.storage_limit:
            return Response({"message":"Not Enough Space"},status=405)
        
        if (size + total_band) > 25:
            return Response({"message":"Daily limit reached"},status=405)
        
        if StorageFile.objects.filter(created_by=user,name=name,folder=folder).exists():
            data = StorageFile.objects.filter(created_by=user,name=name,folder=folder)[0]
            data.name = name
            data.size = size
            data.modified_on = get_timestamp()
            data.file.save(name,request.data['file'])
            data.save()
            return Response(self.get_serializer_class()(data).data)

        return super(FileViewSet, self).create(request)
    

    def partial_update(self, request, pk=None):
        user = self.get_user()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        minus_load = StorageFile.objects.get(id=pk).size
        size = serializer.data['size']
        total_size = StorageFile.objects.filter(created_by = user).aggregate(total_size=Sum("size")).get('total_size',0)
        start_of_day = datetime.combine(datetime.now(tz=pytz.UTC), time.min).timestamp()
        total_band = UsageMonitor.objects.filter(created_by=user,created_on__gte=start_of_day).aggregate(total_size=Sum("size")).get('total_size',0)
        if not total_size:
            total_size = 0

        if not total_band:
            total_band = 0 

        print((size + total_size)-minus_load)

        if ((size + total_size)-minus_load) > user.storage_limit:
            return Response({"message":"Not Enough Space"},status=405)
        
        if (size + total_band) > 25:
            return Response({"message":"Daily limit reached"},status=405)


        return super(FileViewSet, self).perform_update(request)
    
    def get_user(self):
        user = self.request.user
        return user
    
    def perform_create(self, serializer):
        user = self.get_user()
        serializer.save(created_by=user)
        UsageMonitor.objects.create(created_by=user,size=serializer.data['size'])

    def perform_update(self, serializer):
        user = self.get_user()
        instance = serializer.save(modified_on=get_timestamp())
        UsageMonitor.objects.create(created_by=user,size=instance.size)

class FolderViewSet(viewsets.ModelViewSet):

    def get_queryset(self):
        user = self.get_user()
        parent = self.request.query_params.get('parent',None)
        querySet = Folder.objects.filter(created_by=user)
        if parent:
            querySet = querySet.filter(parent__id=parent)
        else:
            querySet = querySet.filter(parent=None)
        return querySet.order_by("created_on")
    
    def get_user(self):
        user = self.request.user
        return user
    

    def create(self, request):
        user = self.get_user()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        name =  serializer.data['name'].strip()
        if Folder.objects.filter(created_by=user,name=name).exists():
            data = Folder.objects.filter(created_by=user,name=name)[0]
            return Response(self.get_serializer_class()(data).data)

        return super(FolderViewSet, self).create(request)
    
    def perform_create(self, serializer):
        user = self.get_user()
        serializer.save(created_by=user)

    def get_serializer_class(self):
        if self.action in ['create','update','partial_update']:
            return WriteOnlyFolderSerializer
        return ReadOnlyFolderSerializer
