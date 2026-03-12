from rest_framework.response import Response
from rest_framework.views import APIView
from core.models import SiteLink
from api.serializers import SiteLinkSerializer

class SiteLinksView(APIView):
    def get(self, request):
        return Response(SiteLinkSerializer(SiteLink.objects.all(), many=True).data)
