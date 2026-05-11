from rest_framework import serializers

from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            "id",
            "physician",
            "appointment_date",
            "appointment_time",
            "reason",
            "details",
            "status",
        ]