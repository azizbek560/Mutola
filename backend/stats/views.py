from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers
from catalog.models import Book, Genre
from reviews.models import Comment
from accounts.models import Subscription
from bookmarks.models import Bookmark
from notifications.models import Notification

User = get_user_model()

class StatsView(APIView):
    @extend_schema(responses={200: inline_serializer("StatsResponse", fields={
        "total_books": serializers.IntegerField(),
        "total_genres": serializers.IntegerField(),
        "total_users": serializers.IntegerField(),
        "total_comments": serializers.IntegerField(),
        "total_premium_users": serializers.IntegerField(),
        "total_bookmarks": serializers.IntegerField(),
        "total_notifications": serializers.IntegerField(),
    })})
    def get(self, request):
        return Response({
            "total_books": Book.objects.count(),
            "total_genres": Genre.objects.count(),
            "total_users": User.objects.count(),
            "total_comments": Comment.objects.count(),
            "total_premium_users": Subscription.objects.filter(is_premium=True).count(),
            "total_bookmarks": Bookmark.objects.count(),
            "total_notifications": Notification.objects.count(),
        })
