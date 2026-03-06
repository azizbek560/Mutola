from django.contrib import admin
from .models import Genre, Book

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ("id","name","slug","order")
    list_editable = ("order",)
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ("id","title","author","genre","is_premium","views","created_at")
    list_filter = ("genre","is_premium")
    search_fields = ("title","author","description")
    prepopulated_fields = {"slug": ("title",)}
    autocomplete_fields = ("genre",)
