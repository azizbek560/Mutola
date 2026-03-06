from django.contrib import admin
from .models import Comment

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("book","user","rating","created_at")
    list_filter = ("rating",)
    search_fields = ("book__title","user__username","text")
