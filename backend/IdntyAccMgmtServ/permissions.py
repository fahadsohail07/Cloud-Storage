from rest_framework import permissions

class SelfUser(permissions.BasePermission):
    message = 'You are not authorized to access this resource.'

    def has_permission(self, request, view):
        if view.kwargs.get('pk',None):
            return str(request.user.id) == view.kwargs.get('pk',None)
        return False