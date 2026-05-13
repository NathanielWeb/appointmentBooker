from datetime import date, timedelta

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

        requested_date = request.query_params.get("date")

        # -------------------------------------------------
        # CASE 1:
        # Return available slots for a specific date
        # -------------------------------------------------
        if requested_date:

            all_slots = [
                "09:00",
                "10:00",
                "11:00",
                "14:00",
                "15:00",
            ]

            booked_slots = Appointment.objects.filter(
                physician_id=physician_id,
                appointment_date=requested_date,
                status__in=["pending", "confirmed"]
            ).values_list(
                "appointment_time",
                flat=True
            )

            booked_slots = [
                str(slot)[:5]
                for slot in booked_slots
            ]

            available_slots = [
                slot for slot in all_slots
                if slot not in booked_slots
            ]

            return Response({
                "available_slots": available_slots
            })

        # -------------------------------------------------
        # CASE 2:
        # Return fully unavailable dates
        # -------------------------------------------------

        unavailable_dates = []

        today = date.today()

        start_date = today - timedelta(weeks=10)
        end_date = today + timedelta(weeks=10)

        current_date = start_date

        DAILY_SLOT_COUNT = 5

        while current_date <= end_date:

            booked_count = Appointment.objects.filter(
                physician_id=physician_id,
                appointment_date=current_date,
                status__in=["pending", "confirmed"]
            ).count()

            if booked_count >= DAILY_SLOT_COUNT:
                unavailable_dates.append(
                    current_date.strftime("%Y-%m-%d")
                )

            current_date += timedelta(days=1)

        return Response({
            "unavailable_dates": unavailable_dates
        })