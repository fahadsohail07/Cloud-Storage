from django.shortcuts import render
from django.contrib.auth import authenticate
from django.db.models import Sum

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import viewsets,status
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response

from datetime import datetime, time
import pytz


from .serializer import WriteOnlyUserSerializer,ReadOnlyUserSerializer
from .models import User,get_timestamp
from .permissions import SelfUser

from StorageMgmtServ.models import StorageFile
from UsageMntrServ.models import UsageMonitor

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.action in ['create','signup','set_password']:
            return WriteOnlyUserSerializer
        return ReadOnlyUserSerializer

    def get_permissions(self):
        if self.action in ['create','signup','login']:
            self.permission_classes = []
        if self.action == 'list':
            self.permission_classes = [IsAdminUser]
        if self.action in ['retrieve','update','partial_update','destroy','set_password']:
            self.permission_classes = self.permission_classes +   [SelfUser|IsAdminUser]
        return super(UserViewSet, self).get_permissions()
        
    @action(detail=False, methods=['POST'])
    def signup(self,request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.create_user(email=serializer.data.get("email"),password=serializer.data.get("password"))
        token,_ = Token.objects.get_or_create(user=user)
        user_data = ReadOnlyUserSerializer(user).data
        user_data['token'] = token.key
        return Response({
            'user' : user_data
        },status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['POST'])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request,email=email, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            user_data = ReadOnlyUserSerializer(user).data
            user_data['token'] = token.key
            return Response({
            'user' : user_data
            })
        return Response({
            'error':"email or password is incorrect"
        },status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def set_password(self, request, pk=None):
        user = User.objects.get(id=pk)
        password = self.request.data.get('password',None)
        if password:
            user.set_password(password)
            user.save()
            return Response({'status': 'password set'})
        else:
            return Response("password is required",status=status.HTTP_400_BAD_REQUEST)
        

    @action(detail=True, methods=['get'])
    def get_storage(self, request, pk=None):
        user = User.objects.get(id=pk)
        total_size = StorageFile.objects.filter(created_by=user).aggregate(total_size=Sum("size")).get('total_size',0)
        start_of_day = datetime.combine(datetime.now(tz=pytz.UTC), time.min).timestamp()
        total_band = UsageMonitor.objects.filter(created_by=user,created_on__gte=start_of_day).aggregate(total_size=Sum("size")).get('total_size',0)
        if not total_size:
            total_size = 0

        if not total_band:
            total_band = 0

        print(total_band)

        
        return Response({'total_storage': user.storage_limit,"used_storage":total_size,"band_used":total_band,"total_band":25})
