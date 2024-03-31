from django.contrib import admin
from django.urls import path

from rest_framework import routers
from rest_framework.authtoken import views

from . import views as vw


app_name = "IdntyAccMgmtServ"
router = routers.SimpleRouter()

router.register(r'user',vw.UserViewSet,basename = "users")

urlpatterns = []

urlpatterns += router.urls