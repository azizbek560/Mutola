from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.db.models import Avg, Count

from catalog.models import Genre, Book
from core.models import SiteLink
from accounts.models import Subscription
from reviews.models import Comment

class GenreSerializer(serializers.ModelSerializer):
    books_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Genre
        fields = ["id","name","slug","order","books_count"]

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
        fields = [
            "id","title","slug","author","description",
            "genre_name","genre_slug",
            "cover_url","pdf_url","audio_url",
            "is_premium","views","created_at",
            "rating_avg","rating_count",
        ]

    def _abs(self, req, url):
        return req.build_absolute_uri(url) if req else url

    def get_cover_url(self, obj):
        req = self.context.get("request")
        if obj.cover and hasattr(obj.cover, "url"):
            return self._abs(req, obj.cover.url)
        return None

    def get_pdf_url(self, obj):
        req = self.context.get("request")
        if obj.pdf and hasattr(obj.pdf, "url"):
            return self._abs(req, obj.pdf.url)
        return None

    def get_audio_url(self, obj):
        return bool(obj.audio)

class SiteLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteLink
        fields = ["key","title","url"]

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ["is_premium","activated_at"]

class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Comment
        fields = ["id","user_name","rating","text","created_at"]

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=4)

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
        )
        Subscription.objects.create(user=user, is_premium=False)
        Token.objects.create(user=user)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
