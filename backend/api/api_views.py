from django.db.models import Count, F, Q, Avg
from django.utils import timezone
from django.contrib.auth import authenticate
from rest_framework import generics
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Genre, Book
from core.models import SiteLink
from accounts.models import Subscription
from reviews.models import Comment
from api.serializers import (
    GenreSerializer, BookSerializer, SiteLinkSerializer,
    SubscriptionSerializer, CommentSerializer,
    RegisterSerializer, LoginSerializer
)

def _get_donate_url():
    link = SiteLink.objects.filter(key="donate").first()
    return link.url if link else ""

def _is_premium(user):
    if not user or not user.is_authenticated:
        return False
    sub = getattr(user, "subscription", None)
    return bool(sub and sub.is_premium)

class GenreList(generics.ListAPIView):
    serializer_class = GenreSerializer
    def get_queryset(self):
        return Genre.objects.annotate(books_count=Count("books"))

class BookList(generics.ListAPIView):
    serializer_class = BookSerializer
    def get_queryset(self):
        qs = Book.objects.select_related("genre").annotate(
            rating_avg=Avg("comments__rating"),
            rating_count=Count("comments"),
        )
        genre = self.request.query_params.get("genre")
        q = (self.request.query_params.get("q") or "").strip()
        premium_only = self.request.query_params.get("premium")
        if genre:
            qs = qs.filter(genre__slug=genre)
        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(author__icontains=q) | Q(genre__name__icontains=q))
        if premium_only in ("1","true","True"):
            qs = qs.filter(is_premium=True)
        return qs.order_by("-views","-created_at")

class BookDetail(generics.RetrieveAPIView):
    serializer_class = BookSerializer
    queryset = Book.objects.select_related("genre").annotate(
        rating_avg=Avg("comments__rating"),
        rating_count=Count("comments"),
    )
    lookup_field = "id"

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        Book.objects.filter(id=obj.id).update(views=F("views")+1)
        obj.refresh_from_db(fields=["views"])
        return Response(self.get_serializer(obj).data)

class BookPdf(APIView):
    def get(self, request, id):
        book = Book.objects.filter(id=id).first()
        if not book:
            return Response({"detail":"Not found"}, status=404)
        if book.is_premium and not _is_premium(request.user):
            return Response({"detail":"Siz premiumga obuna bo'lmagansiz.", "donate_url": _get_donate_url()}, status=403)
        if not book.pdf:
            return Response({"detail":"PDF mavjud emas"}, status=404)
        return Response({"pdf_url": request.build_absolute_uri(book.pdf.url)})

class BookAudio(APIView):
    def get(self, request, id):
        book = Book.objects.filter(id=id).first()
        if not book:
            return Response({"detail":"Not found"}, status=404)
        if not _is_premium(request.user):
            return Response({"detail":"Siz premiumga obuna bo'lmagansiz.", "donate_url": _get_donate_url()}, status=403)
        if not book.audio:
            return Response({"detail":"Audiokitob mavjud emas"}, status=404)
        return Response({"audio_url": request.build_absolute_uri(book.audio.url)})

class SiteLinks(APIView):
    def get(self, request):
        return Response(SiteLinkSerializer(SiteLink.objects.all(), many=True).data)

class Me(APIView):
    def get(self, request):
        return Response({"username": request.user.username, "is_premium": _is_premium(request.user)})

class Register(APIView):
    def post(self, request):
        s = RegisterSerializer(data=request.data)
        if not s.is_valid():
            return Response(s.errors, status=400)
        user = s.save()
        token = Token.objects.get(user=user)
        return Response({"token": token.key, "username": user.username, "is_premium": False})

class Login(APIView):
    def post(self, request):
        s = LoginSerializer(data=request.data)
        if not s.is_valid():
            return Response(s.errors, status=400)
        user = authenticate(username=s.validated_data["username"], password=s.validated_data["password"])
        if not user:
            return Response({"detail":"Login yoki parol noto'g'ri"}, status=400)
        sub, _ = Subscription.objects.get_or_create(user=user)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": user.username, "is_premium": sub.is_premium})

class Logout(APIView):
    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        Token.objects.create(user=request.user)
        return Response({"detail":"Logged out"})

class Subscribe(APIView):
    def post(self, request):
        sub, _ = Subscription.objects.get_or_create(user=request.user)
        sub.is_premium = True
        sub.activated_at = timezone.now()
        sub.save()
        return Response({"detail":"Premium activated", "subscription": SubscriptionSerializer(sub).data})

class CommentListCreate(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, book_id):
        qs = Comment.objects.filter(book_id=book_id)
        return Response(CommentSerializer(qs, many=True).data)
    def post(self, request, book_id):
        try:
            rating = int(request.data.get("rating", 0))
        except:
            rating = 0
        text = (request.data.get("text") or "").strip()
        if rating < 1 or rating > 5:
            return Response({"detail":"Rating 1-5 bo'lishi kerak"}, status=400)
        book = Book.objects.filter(id=book_id).first()
        if not book:
            return Response({"detail":"Not found"}, status=404)
        c = Comment.objects.create(user=request.user, book=book, rating=rating, text=text)
        return Response(CommentSerializer(c).data, status=201)
