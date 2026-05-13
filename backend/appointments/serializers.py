from rest_framework import serializers
from django.utils import timezone
from datetime import datetime

from .models import Appointment
from physicians.models import Physician
from physicians.serializers import PhysicianSerializer


class AppointmentSerializer(serializers.ModelSerializer):
    physician = serializers.PrimaryKeyRelatedField(
        queryset=Physician.objects.all()
    )

    physician_detail = PhysicianSerializer(
        source="physician",
        read_only=True
    )

    class Meta:
        model = Appointment
        fields = [
            "id",
            "physician",
            "physician_detail",
            "appointment_date",
            "appointment_time",
            "reason",
            "details",
            "status",
        ]

    def validate(self, attrs):
        user = self.context["request"].user
        instance = self.instance

        appointment_date = attrs.get("appointment_date")
        appointment_time = attrs.get("appointment_time")

        if not instance:
            if appointment_date and appointment_time:
                appointment_dt = datetime.combine(
                    appointment_date,
                    appointment_time
                )

                appointment_dt = timezone.make_aware(
                    appointment_dt,
                    timezone.get_current_timezone()
                )

                if appointment_dt <= timezone.now():
                    raise serializers.ValidationError({
                        "appointment_date": "Cannot book an appointment in the past."
                    })

        else:
            appointment_dt = datetime.combine(
                instance.appointment_date,
                instance.appointment_time
            )

            appointment_dt = timezone.make_aware(
                appointment_dt,
                timezone.get_current_timezone()
            )

            is_past = appointment_dt <= timezone.now()
            is_admin = getattr(user, "role", None) == "admin"

            if is_past and not is_admin:
                if "status" in attrs and attrs["status"] != instance.status:
                    raise serializers.ValidationError({
                        "status": "This appointment has already passed and cannot be modified."
                    })

        return attrs