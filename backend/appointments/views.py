from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Appointment
from .serializers import AppointmentSerializer


class AppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Appointment.objects.all()

        if user.role == "admin":
            queryset = Appointment.objects.all()

        elif user.role == "physician":
            queryset = Appointment.objects.filter(
                physician__user=user
            )

        else:
            queryset = Appointment.objects.filter(patient=user)

        # optional date filter
        date = self.request.query_params.get("date")
        if date:
            queryset = queryset.filter(appointment_date=date)

        return queryset

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)

class AppointmentDetailView(generics.RetrieveUpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
