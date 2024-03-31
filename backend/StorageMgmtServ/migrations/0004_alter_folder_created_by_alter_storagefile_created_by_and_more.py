# Generated by Django 5.0.3 on 2024-03-09 19:29

import StorageMgmtServ.models
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('StorageMgmtServ', '0003_folder_created_by_folder_created_on'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='folder',
            name='created_by',
            field=models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='storagefile',
            name='created_by',
            field=models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='storagefile',
            name='file',
            field=models.FileField(upload_to=StorageMgmtServ.models.user_directory_path),
        ),
        migrations.AlterField(
            model_name='storagefile',
            name='folder',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='StorageMgmtServ.folder'),
        ),
    ]
