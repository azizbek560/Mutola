from django.db import models
from django.utils.text import slugify

class Genre(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Book(models.Model):
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE, related_name="books")
    title = models.CharField(max_length=220)
    slug = models.SlugField(max_length=240, blank=True)
    author = models.CharField(max_length=180, blank=True)
    description = models.TextField(blank=True)

    cover = models.ImageField(upload_to="covers/", blank=True, null=True)
    pdf = models.FileField(upload_to="pdfs/", blank=True, null=True)
    audio = models.FileField(upload_to="audio/", blank=True, null=True)

    is_premium = models.BooleanField(default=False)
    views = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["-views"]),
            models.Index(fields=["title"]),
            models.Index(fields=["author"]),
            models.Index(fields=["is_premium"]),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:200] or "book"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
