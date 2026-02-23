from django.urls import path
from . import views

app_name="cart"
urlpatterns = [
    # URLs are now handled by API endpoints in api_urls.py
    # path('add/<int:product_id>', views.cart_add, name='cart_add'),
    # path('remove/<int:product_id>', views.cart_remove, name='cart_remove'),
    # path('', views.cart_detail, name='cart_detail'),
]
