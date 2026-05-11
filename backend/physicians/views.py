from datetime import datetime

from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Physician
from .serializers import PhysicianSerializer

from appointments.models import Appointment

# Create your views here.

# Physician List view
class PhysicianListView(generics.ListAPIView):
    queryset = Physician.objects.all()
    serializer_class = PhysicianSerializer
    permission_classes = [AllowAny]


# Physician availability view
class PhysicianAvailabilityView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, physician_id):
        date = request.query_params.get("date")

        if not date:
            return Response(
                {"error": "date query parameter is required"},
                status=400
            )
        
        booked_slots = Appointment.objects.filter(
            physician_id=physician_id,
            appointment_date=date,
            status__in=["pending", "confirmed"]
        ).values_list(
            "appointment_time",
            flat=True
        )

        return Response({
            "booked_slots": booked_slots
        })