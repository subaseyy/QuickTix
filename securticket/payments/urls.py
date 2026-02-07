from django.urls import path
from . import views

urlpatterns = [
    path('create-payment-intent/', views.create_payment_intent, name='create_payment_intent'),
    # path('webhook/', views.stripe_webhook, name='stripe_webhook'),
    path('status/<int:booking_id>/', views.get_payment_status, name='payment_status'),
    path('confirm-manual/', views.confirm_payment_manual, name='confirm_payment_manual'),  # New
]