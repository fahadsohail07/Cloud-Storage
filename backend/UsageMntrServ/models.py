from django.db import models

import datetime
from django.conf import settings
import pytz
import uuid

def get_timestamp():
    return datetime.datetime.now(tz=pytz.UTC).timestamp()

class UsageMonitor(models.Model):
    id = models.UUIDField(default=uuid.uuid4,unique=True,primary_key=True,editable=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,editable=False)
    created_on = models.FloatField(default=get_timestamp,editable=False)
    size = models.FloatField(default=0,null=False)

