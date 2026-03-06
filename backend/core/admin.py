from django.contrib import admin
from .models import SiteLink

@admin.register(SiteLink)
class SiteLinkAdmin(admin.ModelAdmin):
    list_display = ("key","title","url")
