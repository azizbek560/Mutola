from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers
from notifications.models import Notification
from api.serializers import NotificationSerializer

class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]
    @extend_schema(responses={200: NotificationSerializer(many=True)})
    def get(self, request):
        notifications = Notification.objects.filter(user=request.user)
        return Response(NotificationSerializer(notifications, many=True).data)

class NotificationReadView(APIView):
    permission_classes = [IsAuthenticated]
    @extend_schema(responses={200: inline_serializer("NotificationReadResponse", fields={"detail": serializers.CharField()})})
    def post(self, request, id):
        notification = Notification.objects.filter(id=id, user=request.user).first()
        if not notification:
            return Response({"detail": "Topilmadi"}, status=404)
        notification.is_read = True
        notification.save()
        return Response({"detail": "Oqildi deb belgilandi"})

class NotificationReadAllView(APIView):
    permission_classes = [IsAuthenticated]
    @extend_schema(responses={200: inline_serializer("NotificationReadAllResponse", fields={"detail": serializers.CharField()})})
    def post(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({"detail": "Barcha bildirishnomalar oqildi"})
