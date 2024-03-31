from rest_framework import serializers

from .models import User


class ReadOnlyUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        exclude=["password","is_superuser","user_permissions","groups","last_login"]

class WriteOnlyUserSerializer(serializers.ModelSerializer):
    
    
    class Meta:
        model = User
        fields='__all__'


