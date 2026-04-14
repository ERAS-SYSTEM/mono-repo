from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from .models import PasswordResetToken

User = get_user_model()


class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="test@test.com",
            password="Oldpass123!",
        )

    def test_register(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "username": "newuser",
                "email": "new@test.com",
                "password": "Newpass123!",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertIn("access", response.data)

    def test_login(self):
        response = self.client.post(
            "/api/auth/login/",
            {"username": "testuser", "password": "Oldpass123!"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_me(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["username"], self.user.username)

    def test_logout(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post("/api/auth/logout/", {"refresh": "bad-token"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Logged out")

    def test_profile_update(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.put(
            "/api/auth/profile/",
            {"first_name": "Test", "last_name": "User", "email": "updated@test.com"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "Test")
        self.assertEqual(self.user.email, "updated@test.com")

    def test_change_password(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            "/api/auth/change-password/",
            {"old_password": "Oldpass123!", "new_password": "Changed123!"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("Changed123!"))

    def test_forgot_password_always_returns_success_message(self):
        response = self.client.post(
            "/api/auth/forgot-password/",
            {"email": "test@test.com"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Reset link sent to email")
        self.assertEqual(PasswordResetToken.objects.filter(user=self.user).count(), 1)

        response_missing = self.client.post(
            "/api/auth/forgot-password/",
            {"email": "missing@test.com"},
            format="json",
        )
        self.assertEqual(response_missing.status_code, 200)
        self.assertEqual(response_missing.data["message"], "Reset link sent to email")

    def test_reset_password_success(self):
        token = PasswordResetToken.objects.create(user=self.user)
        response = self.client.post(
            "/api/auth/reset-password/",
            {"token": str(token.token), "new_password": "Reset1234!"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("Reset1234!"))
        self.assertFalse(PasswordResetToken.objects.filter(pk=token.pk).exists())

    def test_reset_password_invalid_token(self):
        response = self.client.post(
            "/api/auth/reset-password/",
            {"token": "00000000-0000-0000-0000-000000000000", "new_password": "Reset1234!"},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "Invalid token")
