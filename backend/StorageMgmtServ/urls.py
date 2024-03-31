from rest_framework import routers
from rest_framework.authtoken import views

from . import views as vw

app_name = "StorageMgmtServ"
router = routers.SimpleRouter()

router.register(r'file',vw.FileViewSet,basename = "storage")
router.register(r'folder',vw.FolderViewSet,basename = "folder")

urlpatterns = []

urlpatterns += router.urls