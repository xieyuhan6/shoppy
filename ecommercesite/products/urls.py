from django.urls import path
from . import views

app_name="products"
urlpatterns=[
    # URLs are now handled by API endpoints in api_urls.py
    # path("",views.product_list,name="product_list"),
    # path("<slug:category_slug>/",views.product_list,name="product_list_by_category"),
    # path("product/<int:id>/<slug:slug>/",views.product_detail,name="product_detail"),
]
