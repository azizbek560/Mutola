from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from reviews.models import Comment
from catalog.models import Book
from api.serializers import CommentSerializer

class CommentListCreateView(APIView):
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
            return Response({"detail": "Rating 1-5 bolishi kerak"}, status=400)
        book = Book.objects.filter(id=book_id).first()
        if not book:
            return Response({"detail": "Not found"}, status=404)
        c = Comment.objects.create(user=request.user, book=book, rating=rating, text=text)
        return Response(CommentSerializer(c).data, status=201)

class MyReviewsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        comments = Comment.objects.filter(user=request.user).select_related("book")
        return Response(CommentSerializer(comments, many=True).data)

class CommentDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, id):
        comment = Comment.objects.filter(id=id, user=request.user).first()
        if not comment:
            return Response({"detail": "Topilmadi"}, status=404)
        try:
            rating = int(request.data.get("rating", comment.rating))
        except:
            rating = comment.rating
        if rating < 1 or rating > 5:
            return Response({"detail": "Rating 1-5 bolishi kerak"}, status=400)
        comment.rating = rating
        comment.text = request.data.get("text", comment.text)
        comment.save()
        return Response(CommentSerializer(comment).data)
    def delete(self, request, id):
        comment = Comment.objects.filter(id=id, user=request.user).first()
        if not comment:
            return Response({"detail": "Topilmadi"}, status=404)
        comment.delete()
        return Response({"detail": "Izoh ochirildi"})
