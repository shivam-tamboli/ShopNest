from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'stock', 'is_new', 'is_popular', 'category']
    list_editable = ['stock', 'is_new', 'is_popular']
    list_filter = ['stock', 'is_new', 'is_popular', 'category']
    search_fields = ['name', 'description']