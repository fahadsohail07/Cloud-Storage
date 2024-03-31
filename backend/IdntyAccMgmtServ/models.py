from __future__ import unicode_literals

from rest_framework.authtoken.models import Token

from django.db import models
from django.core.mail import send_mail
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.db.models.signals import post_save
from django.dispatch import receiver


from .managers import UserManager


import uuid
import datetime
import pytz


def get_timestamp():
    return datetime.datetime.now(tz=pytz.UTC).timestamp()

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(default=uuid.uuid4,unique=True,primary_key=True,editable=False)
    email = models.EmailField('email address', unique=True)
    name = models.CharField('name', max_length=50, blank=True)
    created_at = models.FloatField(default=get_timestamp,editable=False)
    is_active = models.BooleanField('active', default=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(null=True, blank=True,default="")
    is_staff = models.BooleanField(default=False,null=False)
    storage_limit = models.IntegerField(default=10,null=False)


    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'

    def get_full_name(self):
        '''
        Returns the name .
        '''
        return self.name

    def email_user(self, subject, message, from_email=None, **kwargs):
        '''
        Sends an email to this User.
        '''
        send_mail(subject, message, from_email, [self.email], **kwargs)


@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.get_or_create(user=instance)