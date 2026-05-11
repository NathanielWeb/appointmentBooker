from rest_framework import serializers

from .models import Physician

class PhysicianSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")

    class Meta:
        model = Physician
        fields = [
            "id", 
            "first_name",
            "last_name",
            "specialty",
            "bio",
        ]