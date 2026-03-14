from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers
from bookmarks.models import Bookmark
from catalog.models import Book
from api.serializers import BookmarkSerializer

class BookmarkListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    @extend_schema(responses={200: BookmarkSerializer(many=True)})
    def get(self, request):
        bookmarks = Bookmark.objects.filter(user=request.user).select_related("book__genre")
        return Response(BookmarkSerializer(bookmarks, many=True, context={"request": request}).data)
    @extend_schema(request=inline_serializer("BookmarkCreateRequest", fields={"book_id": serializers.IntegerField()}), responses={201: BookmarkSerializer})
    def post(self, request):
        book_id = request.data.get("book_id")
        book = Book.objects.filter(id=book_id).first()
        if not book:
            return Response({"detail": "Kitob topilmadi"}, status=404)
        bookmark, created = Bookmark.objects.get_or_create(user=request.user, book=book)
        if not created:
            return Response({"detail": "Allaqachon saqlangan"}, status=400)
        return Response(BookmarkSerializer(bookmark, context={"request": request}).data, status=201)

class BookmarkDeleteView(APIView):
    permission_classes = [IsAuthenticated]
    @extend_schema(responses={200: inline_serializer("BookmarkDeleteResponse", fields={"detail": serializers.CharField()})})
    def delete(self, request, id):
        bookmark = Bookmark.objects.filter(user=request.user, id=id).first()
        if not bookmark:
            return Response({"detail": "Topilmadi"}, status=404)
        bookmark.delete()
        return Response({"detail": "Ochirildi"})
