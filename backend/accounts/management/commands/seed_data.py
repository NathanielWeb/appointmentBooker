from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from physicians.models import Physician
from appointments.models import Appointment

User = get_user_model()


class Command(BaseCommand):
    def handle(self, *args, **kwargs):

        # -----------------------
        # Clean existing data (dev only)
        # -----------------------
        Appointment.objects.all().delete()
        Physician.objects.all().delete()
        User.objects.all().delete()

        # -----------------------
        # 1. Superuser admin
        # -----------------------
        admin = User.objects.create_user(
            username="admin",
            password="admin123",
            role="admin",
            first_name="System",
            last_name="Admin",
        )
        admin.is_staff = True
        admin.is_superuser = True
        admin.save()

        # -----------------------
        # 2. Physicians (3 specialties)
        # -----------------------
        dr1_user = User.objects.create_user(
            username="dr_smith",
            password="pass123",
            role="physician",
            first_name="John",
            last_name="Smith",
        )
        dr1 = Physician.objects.create(
            user=dr1_user,
            specialty="Cardiologist"
        )

        dr2_user = User.objects.create_user(
            username="dr_jones",
            password="pass123",
            role="physician",
            first_name="Emily",
            last_name="Jones",
        )
        dr2 = Physician.objects.create(
            user=dr2_user,
            specialty="Dermatologist"
        )

        dr3_user = User.objects.create_user(
            username="dr_lee",
            password="pass123",
            role="physician",
            first_name="David",
            last_name="Lee",
        )
        dr3 = Physician.objects.create(
            user=dr3_user,
            specialty="Pediatrician"
        )

        # -----------------------
        # 3. Patients
        # -----------------------
        p1 = User.objects.create_user(
            username="patient1",
            password="pass123",
            role="patient",
            first_name="Alice",
            last_name="Brown",
        )

        p2 = User.objects.create_user(
            username="patient2",
            password="pass123",
            role="patient",
            first_name="Mark",
            last_name="Green",
        )

        p3 = User.objects.create_user(
            username="patient3",
            password="pass123",
            role="patient",
            first_name="Sarah",
            last_name="White",
        )

        # -----------------------
        # 4. Appointments
        # Ensure each physician has at least 1
        # and each patient has 1 appointment
        # -----------------------

        Appointment.objects.create(
            patient=p1,
            physician=dr1,
            appointment_date="2026-05-20",
            appointment_time="09:00:00",
            reason="Chest pain",
            details="Recurring discomfort during exercise",
            status="confirmed"
        )

        Appointment.objects.create(
            patient=p2,
            physician=dr2,
            appointment_date="2026-05-20",
            appointment_time="10:00:00",
            reason="Skin rash",
            details="Itchy rash on arm for 3 days",
            status="confirmed"
        )

        Appointment.objects.create(
            patient=p3,
            physician=dr3,
            appointment_date="2026-05-20",
            appointment_time="11:00:00",
            reason="Fever",
            details="Mild fever and fatigue for 2 days",
            status="pending"
        )

        self.stdout.write(
            self.style.SUCCESS("Database seeded successfully")
        )