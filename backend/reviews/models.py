from django.conf import settings
from django.db import models
from catalog.models import Book

class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments")
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="comments")
    rating = models.PositiveSmallIntegerField()  
    text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["book", "-created_at"]),
            models.Index(fields=["book", "rating"]),
        ]

    def __str__(self):
        return f"{self.book.title} - {self.rating} by {self.user.username}"
