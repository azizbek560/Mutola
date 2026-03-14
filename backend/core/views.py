from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema
from core.models import SiteLink
from api.serializers import SiteLinkSerializer

class SiteLinksView(APIView):
    @extend_schema(responses={200: SiteLinkSerializer(many=True)})
    def get(self, request):
        return Response(SiteLinkSerializer(SiteLink.objects.all(), many=True).data)
