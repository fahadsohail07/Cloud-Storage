from django.db import models
from django.db.models.signals import post_delete,pre_save
from django.dispatch import receiver
from django.conf import settings


import datetime
import pytz
import uuid


def get_timestamp():
    return datetime.datetime.now(tz=pytz.UTC).timestamp()

def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    after_name = ""
    if instance.folder:
        after_name = f"/{instance.folder.name}"

    return f'{instance.created_by.id}{after_name}/{filename}'

class Folder(models.Model):
    id = models.UUIDField(default=uuid.uuid4,unique=True,primary_key=True,editable=False)
    name = models.TextField()
    parent = models.ForeignKey('StorageMgmtServ.Folder',null=True,blank=True,on_delete=models.CASCADE)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,editable=False)
    created_on = models.FloatField(default=get_timestamp,editable=False)

class StorageFile(models.Model):
    id = models.UUIDField(default=uuid.uuid4,unique=True,primary_key=True,editable=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,editable=False)
    created_on = models.FloatField(default=get_timestamp,editable=False)
    modified_on = models.FloatField(default=get_timestamp,editable=False)
    file = models.FileField(upload_to=user_directory_path, null=False, blank=False )
    name = models.TextField()
    size = models.FloatField(default=0,null=False)
    folder = models.ForeignKey(Folder,null=True,blank=True,on_delete=models.CASCADE)


""" Whenever ANY model is deleted, if it has a file field on it, delete the associated file too"""
@receiver(post_delete)
def delete_files_when_row_deleted_from_db(sender, instance, **kwargs):
    for field in sender._meta.concrete_fields:
        if isinstance(field,models.FileField):
            instance_file_field = getattr(instance,field.name)
            instance_file_field.delete(False)
            
""" Delete the file if something else get uploaded in its place"""
@receiver(pre_save)
def delete_files_when_file_changed(sender,instance, **kwargs):
    # Don't run on initial save
    if not instance.pk:
        return
    for field in sender._meta.concrete_fields:
        if isinstance(field,models.FileField):
            #its got a file field. Let's see if it changed
            try:
                instance_in_db = sender.objects.get(pk=instance.pk)
            except sender.DoesNotExist:
                # We are probably in a transaction and the PK is just temporary
                # Don't worry about deleting attachments if they aren't actually saved yet.
                return
            instance_in_db_file_field = getattr(instance_in_db,field.name)
            instance_file_field = getattr(instance,field.name)
            if instance_in_db_file_field.name != instance_file_field.name:
                instance_in_db_file_field.delete(False)

