from django.urls import path
from api import api_views

urlpatterns = [
    path("genres/", api_views.GenreList.as_view(), name="api-genres"),
    path("books/", api_views.BookList.as_view(), name="api-books"),
    path("books/<int:id>/", api_views.BookDetail.as_view(), name="api-book-detail"),
    path("books/<int:id>/pdf/", api_views.BookPdf.as_view(), name="api-book-pdf"),
    path("books/<int:id>/audio/", api_views.BookAudio.as_view(), name="api-book-audio"),
    path("books/<int:book_id>/comments/", api_views.CommentListCreate.as_view(), name="api-book-comments"),
    path("links/", api_views.SiteLinks.as_view(), name="api-links"),

    path("auth/register/", api_views.Register.as_view(), name="api-register"),
    path("auth/login/", api_views.Login.as_view(), name="api-login"),
    path("auth/logout/", api_views.Logout.as_view(), name="api-logout"),
    path("auth/me/", api_views.Me.as_view(), name="api-me"),
    path("subscribe/", api_views.Subscribe.as_view(), name="api-subscribe"),
]
