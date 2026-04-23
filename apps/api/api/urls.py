from django.urls import path

from .views import (
    ChangePasswordView,
    ContactDetailView,
    ContactListCreateView,
    ForgotPasswordView,
    LoginView,
    LogoutView,
    MeView,
    RegisterView,
    ResetPasswordView,
    UpdateProfileView,
)

urlpatterns = [
    path("auth/register/", RegisterView.as_view()),
    path("auth/login/", LoginView.as_view()),
    path("auth/me/", MeView.as_view()),
    path("auth/logout/", LogoutView.as_view()),
    path("auth/profile/", UpdateProfileView.as_view()),
    path("auth/change-password/", ChangePasswordView.as_view()),
    path("auth/forgot-password/", ForgotPasswordView.as_view()),
    path("auth/reset-password/", ResetPasswordView.as_view()),
    path("contacts/", ContactListCreateView.as_view()),
    path("contacts/<int:pk>/", ContactDetailView.as_view()),
]
