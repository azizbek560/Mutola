from django.db import models

class SiteLink(models.Model):
    key = models.CharField(max_length=40, unique=True)  
    title = models.CharField(max_length=120)
    url = models.URLField()

    def __str__(self):
        return self.key
