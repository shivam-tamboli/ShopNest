from django.urls import path
from product import views

urlpatterns = [
    path('products/', views.ProductView.as_view(), name="products-list"),
    path('product-create/', views.ProductCreateView.as_view(), name="product-create"),
    path('product/<str:pk>/', views.ProductDetailView.as_view(), name="product-details"),
    path('product-update/<str:pk>/', views.ProductEditView.as_view(), name="product-update"),
    path('product-delete/<str:pk>/', views.ProductDeleteView.as_view(), name="product-delete"),
    
    # Use user/ prefix to avoid conflicts
    path('user/wishlist/toggle/<int:product_id>/', views.toggle_wishlist, name="toggle-wishlist"),
    path('user/wishlist/', views.get_wishlist, name="get-wishlist"),
]