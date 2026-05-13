from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from physicians.models import Physician
from appointments.models import Appointment

from datetime import date, timedelta
import random

User = get_user_model()


class Command(BaseCommand):
    def handle(self, *args, **kwargs):

        # -----------------------
        # Reset DB (dev only)
        # -----------------------
        Appointment.objects.all().delete()
        Physician.objects.all().delete()
        User.objects.all().delete()

        # -----------------------
        # Admin
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
        # Physicians
        # -----------------------
        specialties = ["Cardiologist", "Dermatologist", "Pediatrician"]

        physician_data = [
            ("dr_smith", "John", "Smith"),
            ("dr_jones", "Emily", "Jones"),
            ("dr_lee", "David", "Lee"),
        ]

        physicians = []

        for i, (username, first, last) in enumerate(physician_data):
            user = User.objects.create_user(
                username=username,
                password="pass123",
                role="physician",
                first_name=first,
                last_name=last,
            )

            physician = Physician.objects.create(
                user=user,
                specialty=specialties[i],
            )
            physicians.append(physician)

        # -----------------------
        # Patients (40 users)
        # -----------------------
        patients = []

        first_names = [
            "Liam", "Noah", "Oliver", "Elijah", "James",
            "William", "Benjamin", "Lucas", "Henry", "Alexander",
            "Emma", "Olivia", "Ava", "Sophia", "Isabella",
            "Mia", "Amelia", "Harper", "Evelyn", "Abigail"
        ]

        last_names = [
            "Smith", "Johnson", "Brown", "Taylor", "Anderson",
            "Thomas", "Jackson", "White", "Harris", "Martin"
        ]

        name_pool = [(f, l) for f in first_names for l in last_names]
        random.shuffle(name_pool)

        for i in range(1, 41):
            first, last = name_pool[i - 1]

            user = User.objects.create_user(
                username=f"patient{i}",
                password="pass123",
                role="patient",
                first_name=first,
                last_name=last,
            )
            patients.append(user)

        # -----------------------
        # Time window (±4 weeks)
        # -----------------------
        today = date.today()
        start_date = today - timedelta(weeks=4)
        end_date = today + timedelta(weeks=4)

        total_days = (end_date - start_date).days

        time_slots = ["09:00:00", "10:00:00", "11:00:00", "14:00:00", "15:00:00"]
        statuses = ["confirmed", "pending", "cancelled"]

        # -----------------------
        # Appointment generation target
        # -----------------------
        TARGET_APPOINTMENTS = 80
        MAX_PER_PATIENT = 3

        appointment_count = 0

        # Track how many appointments each patient has
        patient_load = {p.id: 0 for p in patients}

        # Flatten patient pool to allow controlled random selection
        available_patients = patients[:]

        while appointment_count < TARGET_APPOINTMENTS:

            patient = random.choice(available_patients)

            if patient_load[patient.id] >= MAX_PER_PATIENT:
                available_patients.remove(patient)
                continue

            physician = random.choice(physicians)

            random_day_offset = random.randint(0, total_days)
            appointment_date = start_date + timedelta(days=random_day_offset)

            appointment_time = random.choice(time_slots)

            status = random.choices(
                statuses,
                weights=[0.5, 0.3, 0.2],
                k=1
            )[0]

            Appointment.objects.create(
                patient=patient,
                physician=physician,
                appointment_date=appointment_date,
                appointment_time=appointment_time,
                reason=random.choice([
                    "General consultation",
                    "Follow-up visit",
                    "Routine check-up",
                    "New symptoms review",
                    "Test results discussion",
                ]),
                details="Seeded appointment for testing purposes.",
                status=status,
            )

            patient_load[patient.id] += 1
            appointment_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed complete: {len(patients)} patients, "
                f"{len(physicians)} physicians, "
                f"{appointment_count} appointments"
            )
        )