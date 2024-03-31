from rest_framework import routers
from rest_framework.authtoken import views

from . import views as vw

app_name = "UsageMntrServ"
router = routers.SimpleRouter()

router.register(r'usageMonitor',vw.UsageMonitor,basename = "usageMonitor")

urlpatterns = []

urlpatterns += router.urls