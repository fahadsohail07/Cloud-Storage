import os
from storages.backends.azure_storage import AzureStorage


class AzureMediaStorage(AzureStorage):
    account_name = os.getenv('AZURE_ACCOUNT_NAME',"droppystore")
    account_key = os.getenv('AZURE_ACCOUNT_KEY',"3ajnOpU00uvHPk39QLRzZ9zlnBECutlFtnKzsa6mwKgMbOWKiqjftm6YQZN8gHDBcxHE/jCyHiSu+AStRPlHtA==")
    azure_container = 'media'
    expiration_secs = None


class AzureStaticStorage(AzureStorage):
    account_name = os.getenv('AZURE_ACCOUNT_NAME',"droppystore")
    account_key = os.getenv('AZURE_ACCOUNT_KEY',"3ajnOpU00uvHPk39QLRzZ9zlnBECutlFtnKzsa6mwKgMbOWKiqjftm6YQZN8gHDBcxHE/jCyHiSu+AStRPlHtA==")
    azure_container = 'static'
    expiration_secs = None