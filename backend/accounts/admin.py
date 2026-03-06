from django.contrib import admin
from .models import Subscription

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ("user","is_premium","activated_at")
    list_filter = ("is_premium",)
    search_fields = ("user__username","user__email")
