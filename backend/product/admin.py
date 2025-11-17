from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'stock', 'is_new', 'is_hot', 'is_popular', 'average_rating']  # FIXED: stock instead of in_stock, added is_hot
    list_editable = ['is_new', 'is_hot', 'is_popular', 'stock']  # Allow quick editing - ADDED is_hot and stock
    list_filter = ['is_new', 'is_hot', 'is_popular', 'category', 'stock']  # ADDED is_hot and stock
    search_fields = ['name', 'description']
    
    # REMOVED the in_stock method since we're using stock field directly