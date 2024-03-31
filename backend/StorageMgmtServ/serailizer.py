from rest_framework import serializers

from .models import StorageFile,Folder


class ReadOnlyFileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = StorageFile
        depth = 1
        fields='__all__'

class WriteOnlyFileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = StorageFile
        fields='__all__'


class ReadOnlyFolderSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Folder
        depth = 1
        fields='__all__'

class WriteOnlyFolderSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Folder
        fields='__all__'

