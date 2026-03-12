import random
import string
from django.contrib.auth import authenticate, get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from accounts.models import Subscription, Profile
from api.serializers import ProfileSerializer, SubscriptionSerializer, RegisterSerializer, LoginSerializer

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        s = RegisterSerializer(data=request.data)
        if not s.is_valid():
            return Response(s.errors, status=400)
        user = s.save()
        token = Token.objects.get(user=user)
        return Response({"token": token.key, "username": user.username, "is_premium": False})

class LoginView(APIView):
    def post(self, request):
        s = LoginSerializer(data=request.data)
        if not s.is_valid():
            return Response(s.errors, status=400)
        user = authenticate(username=s.validated_data["username"], password=s.validated_data["password"])
        if not user:
            return Response({"detail": "Login yoki parol notogri"}, status=400)
        sub, _ = Subscription.objects.get_or_create(user=user)
        Profile.objects.get_or_create(user=user)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": user.username, "is_premium": sub.is_premium})

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        Token.objects.create(user=request.user)
        return Response({"detail": "Logged out"})

class MeView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        return Response({
            "username": request.user.username,
            "full_name": profile.full_name,
            "bio": profile.bio,
            "is_premium": hasattr(request.user, "subscription") and request.user.subscription.is_premium
        })

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request):
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        if not old_password or not new_password:
            return Response({"detail": "old_password va new_password kerak"}, status=400)
        if not request.user.check_password(old_password):
            return Response({"detail": "Eski parol notogri"}, status=400)
        if len(new_password) < 4:
            return Response({"detail": "Yangi parol kamida 4 ta belgi bolishi kerak"}, status=400)
        request.user.set_password(new_password)
        request.user.save()
        Token.objects.filter(user=request.user).delete()
        token = Token.objects.create(user=request.user)
        return Response({"detail": "Parol muvaffaqiyatli ozgartirildi", "token": token.key})

class ForgotPasswordView(APIView):
    def post(self, request):
        username = request.data.get("username")
        if not username:
            return Response({"detail": "Username kerak"}, status=400)
        user = User.objects.filter(username=username).first()
        if not user:
            return Response({"detail": "Bunday foydalanuvchi topilmadi"}, status=404)
        new_password = "".join(random.choices(string.ascii_letters + string.digits, k=8))
        user.set_password(new_password)
        user.save()
        Token.objects.filter(user=user).delete()
        Token.objects.create(user=user)
        return Response({"detail": "Yangi parol yaratildi", "new_password": new_password})

class ProfileView(APIView):
    def get(self, request, username):
        user = User.objects.filter(username=username).first()
        if not user:
            return Response({"detail": "Foydalanuvchi topilmadi"}, status=404)
        profile, _ = Profile.objects.get_or_create(user=user)
        return Response(ProfileSerializer(profile, context={"request": request}).data)

class ProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        profile.full_name = request.data.get("full_name", profile.full_name)
        profile.bio = request.data.get("bio", profile.bio)
        profile.save()
        return Response(ProfileSerializer(profile, context={"request": request}).data)

class ProfileAvatarView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        avatar = request.FILES.get("avatar")
        if not avatar:
            return Response({"detail": "avatar fayl kerak"}, status=400)
        profile.avatar = avatar
        profile.save()
        return Response(ProfileSerializer(profile, context={"request": request}).data)
    def delete(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        profile.avatar = None
        profile.save()
        return Response({"detail": "Avatar ochirildi"})

class SubscribeView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        sub, _ = Subscription.objects.get_or_create(user=request.user)
        return Response(SubscriptionSerializer(sub).data)
    def post(self, request):
        from django.utils import timezone
        sub, _ = Subscription.objects.get_or_create(user=request.user)
        sub.is_premium = True
        sub.activated_at = timezone.now()
        sub.save()
        return Response({"detail": "Premium activated", "subscription": SubscriptionSerializer(sub).data})
    def delete(self, request):
        sub, _ = Subscription.objects.get_or_create(user=request.user)
        sub.is_premium = False
        sub.save()
        return Response({"detail": "Premium bekor qilindi"})
