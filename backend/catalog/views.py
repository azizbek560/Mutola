from django.db.models import Count, F, Q, Avg
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from catalog.models import Genre, Book
from core.models import SiteLink
from accounts.models import Subscription
from api.serializers import GenreSerializer, BookSerializer, SiteLinkSerializer

def _is_premium(user):
    if not user or not user.is_authenticated:
        return False
    sub = getattr(user, "subscription", None)
    return bool(sub and sub.is_premium)

def _get_donate_url():
    link = SiteLink.objects.filter(key="donate").first()
    return link.url if link else ""

class GenreListView(generics.ListAPIView):
    serializer_class = GenreSerializer
    def get_queryset(self):
        return Genre.objects.annotate(books_count=Count("books"))

class BookListView(generics.ListAPIView):
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

class BookDetailView(generics.RetrieveAPIView):
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

class BookTopView(generics.ListAPIView):
    serializer_class = BookSerializer
    def get_queryset(self):
        return Book.objects.select_related("genre").annotate(
            rating_avg=Avg("comments__rating"),
            rating_count=Count("comments"),
        ).order_by("-views")[:10]

class BookNewView(generics.ListAPIView):
    serializer_class = BookSerializer
    def get_queryset(self):
        return Book.objects.select_related("genre").annotate(
            rating_avg=Avg("comments__rating"),
            rating_count=Count("comments"),
        ).order_by("-created_at")[:10]

class BookRelatedView(APIView):
    def get(self, request, id):
        book = Book.objects.filter(id=id).first()
        if not book:
            return Response({"detail": "Not found"}, status=404)
        related = Book.objects.filter(genre=book.genre).exclude(id=id).annotate(
            rating_avg=Avg("comments__rating"),
            rating_count=Count("comments"),
        )[:6]
        return Response(BookSerializer(related, many=True, context={"request": request}).data)

class BookPdfView(APIView):
    def get(self, request, id):
        book = Book.objects.filter(id=id).first()
        if not book:
            return Response({"detail": "Not found"}, status=404)
        if book.is_premium and not _is_premium(request.user):
            return Response({"detail": "Siz premiumga obuna bolmagansiz.", "donate_url": _get_donate_url()}, status=403)
        if not book.pdf:
            return Response({"detail": "PDF mavjud emas"}, status=404)
        return Response({"pdf_url": request.build_absolute_uri(book.pdf.url)})

class BookAudioView(APIView):
    def get(self, request, id):
        book = Book.objects.filter(id=id).first()
        if not book:
            return Response({"detail": "Not found"}, status=404)
        if not _is_premium(request.user):
            return Response({"detail": "Siz premiumga obuna bolmagansiz.", "donate_url": _get_donate_url()}, status=403)
        if not book.audio:
            return Response({"detail": "Audiokitob mavjud emas"}, status=404)
        return Response({"audio_url": request.build_absolute_uri(book.audio.url)})

class SiteLinksView(APIView):
    def get(self, request):
        return Response(SiteLinkSerializer(SiteLink.objects.all(), many=True).data)
