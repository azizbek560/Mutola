from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import status

from .models import Comment
from api.serializers import CommentSerializer


class CommentListCreateView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, book_id: int):
        qs = Comment.objects.filter(book_id=book_id).select_related("user").order_by("-created_at")
        return Response(CommentSerializer(qs, many=True).data)

    def post(self, request, book_id: int):
        ser = CommentSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ser.save(user=request.user, book_id=book_id)
        return Response(ser.data, status=status.HTTP_201_CREATED)
