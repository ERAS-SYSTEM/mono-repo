from datetime import timedelta
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    pass


class Contact(models.Model):
    CONTACT_TYPES = (
        ("personal", "Personal"),
        ("professional", "Professional"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="contacts")
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    phone = models.CharField(max_length=20, blank=True)
    type = models.CharField(max_length=20, choices=CONTACT_TYPES, default="personal")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="password_reset_tokens")
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return self.created_at >= timezone.now() - timedelta(hours=24)
