from django.urls import path
from catalog.views import (
    GenreListView, BookListView, BookDetailView,
    BookTopView, BookNewView, BookRelatedView,
    BookPdfView, BookAudioView
)
from accounts.views import (
    RegisterView, LoginView, LogoutView, MeView,
    ChangePasswordView, ForgotPasswordView,
    ProfileView, ProfileUpdateView, ProfileAvatarView,
    SubscribeView
)
from bookmarks.views import BookmarkListCreateView, BookmarkDeleteView
from reviews.views import CommentListCreateView, CommentDetailView, MyReviewsView
from notifications.views import NotificationListView, NotificationReadView, NotificationReadAllView
from stats.views import StatsView
from core.views import SiteLinksView

urlpatterns = [
    path("genres/", GenreListView.as_view(), name="api-genres"),
    path("books/", BookListView.as_view(), name="api-books"),
    path("books/top/", BookTopView.as_view(), name="api-books-top"),
    path("books/new/", BookNewView.as_view(), name="api-books-new"),
    path("books/<int:id>/", BookDetailView.as_view(), name="api-book-detail"),
    path("books/<int:id>/pdf/", BookPdfView.as_view(), name="api-book-pdf"),
    path("books/<int:id>/audio/", BookAudioView.as_view(), name="api-book-audio"),
    path("books/<int:id>/related/", BookRelatedView.as_view(), name="api-book-related"),
    path("books/<int:book_id>/comments/", CommentListCreateView.as_view(), name="api-book-comments"),
    path("auth/register/", RegisterView.as_view(), name="api-register"),
    path("auth/login/", LoginView.as_view(), name="api-login"),
    path("auth/logout/", LogoutView.as_view(), name="api-logout"),
    path("auth/me/", MeView.as_view(), name="api-me"),
    path("auth/change-password/", ChangePasswordView.as_view(), name="api-change-password"),
    path("auth/forgot-password/", ForgotPasswordView.as_view(), name="api-forgot-password"),
    path("auth/profile/update/", ProfileUpdateView.as_view(), name="api-profile-update"),
    path("auth/profile/avatar/", ProfileAvatarView.as_view(), name="api-profile-avatar"),
    path("auth/profile/<str:username>/", ProfileView.as_view(), name="api-profile"),
    path("subscribe/", SubscribeView.as_view(), name="api-subscribe"),
    path("bookmarks/", BookmarkListCreateView.as_view(), name="api-bookmarks"),
    path("bookmarks/<int:id>/", BookmarkDeleteView.as_view(), name="api-bookmark-delete"),
    path("reviews/my/", MyReviewsView.as_view(), name="api-my-reviews"),
    path("reviews/<int:id>/", CommentDetailView.as_view(), name="api-review-detail"),
    path("notifications/", NotificationListView.as_view(), name="api-notifications"),
    path("notifications/read-all/", NotificationReadAllView.as_view(), name="api-notification-read-all"),
    path("notifications/<int:id>/read/", NotificationReadView.as_view(), name="api-notification-read"),
    path("stats/", StatsView.as_view(), name="api-stats"),
    path("links/", SiteLinksView.as_view(), name="api-links"),
]
