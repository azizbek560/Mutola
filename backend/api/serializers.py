from rest_framework import serializers
from django.contrib.auth import get_user_model
from catalog.models import Genre, Book
from core.models import SiteLink
from accounts.models import Subscription, Profile
from reviews.models import Comment
from bookmarks.models import Bookmark
from notifications.models import Notification

User = get_user_model()

class GenreSerializer(serializers.ModelSerializer):
    books_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = Genre
        fields = ("id", "name", "slug", "order", "books_count")

class BookSerializer(serializers.ModelSerializer):
    genre_name = serializers.CharField(source="genre.name", read_only=True)
    genre_slug = serializers.CharField(source="genre.slug", read_only=True)
    cover_url = serializers.SerializerMethodField()
    pdf_url = serializers.SerializerMethodField()
    audio_url = serializers.SerializerMethodField()
    rating_avg = serializers.FloatField(read_only=True)
    rating_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Book
        fields = ("id","title","slug","author","description","genre_name","genre_slug",
                  "cover_url","pdf_url","audio_url","is_premium","views","created_at",
                  "rating_avg","rating_count")

    def get_cover_url(self, obj):
        req = self.context.get("request")
        if obj.cover and req:
            return req.build_absolute_uri(obj.cover.url)
        return None

    def get_pdf_url(self, obj):
        req = self.context.get("request")
        if obj.pdf and req:
            return req.build_absolute_uri(obj.pdf.url)
        return None

    def get_audio_url(self, obj):
        return bool(obj.audio)

class SiteLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteLink
        fields = ("id", "key", "url")

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ("is_premium", "activated_at")

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    avatar_url = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    bookmarks_count = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ("username", "full_name", "bio", "avatar_url", "comments_count", "bookmarks_count")

    def get_avatar_url(self, obj):
        req = self.context.get("request")
        if obj.avatar and req:
            return req.build_absolute_uri(obj.avatar.url)
        return None

    def get_comments_count(self, obj):
        return obj.user.comments.count()

    def get_bookmarks_count(self, obj):
        return obj.user.bookmarks.count()

class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)
    book_title = serializers.CharField(source="book.title", read_only=True)
    book_id = serializers.IntegerField(source="book.id", read_only=True)

    class Meta:
        model = Comment
        fields = ("id", "user_name", "book_id", "book_title", "rating", "text", "created_at")

class BookmarkSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)

    class Meta:
        model = Bookmark
        fields = ("id", "book", "created_at")

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ("id", "message", "is_read", "created_at")

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(min_length=4)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Bu username band.")
        return value

    def save(self):
        user = User.objects.create_user(
            username=self.validated_data["username"],
            password=self.validated_data["password"]
        )
        from rest_framework.authtoken.models import Token
        Token.objects.get_or_create(user=user)
        Subscription.objects.get_or_create(user=user)
        Profile.objects.get_or_create(user=user)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
