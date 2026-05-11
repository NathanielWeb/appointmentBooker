from django.urls import path

from .views import PhysicianListView, PhysicianAvailabilityView

urlpatterns = [
    path("", PhysicianListView.as_view(), name="physicians"),
    path(
        "<int:physician_id>/availability/",
        PhysicianAvailabilityView.as_view(),
        name="physician-availability",
    ),
]