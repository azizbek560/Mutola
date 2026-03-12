from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.views import APIView
from catalog.models import Book, Genre
from reviews.models import Comment
from accounts.models import Subscription
from bookmarks.models import Bookmark
from notifications.models import Notification

User = get_user_model()

class StatsView(APIView):
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
