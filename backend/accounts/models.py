from django.conf import settings
from django.db import models

class Subscription(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="subscription")
    is_premium = models.BooleanField(default=False)
    activated_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}: {'premium' if self.is_premium else 'free'}"
