from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Appointment
from .serializers import AppointmentSerializer

class AppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "admin":
            return Appointment.objects.all()
        
        if user.role == "physician":
            return Appointment.objects.filter(
                physician_user=user
            )
        
        return Appointment.objects.filter(patient=user)
    
    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)