from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'description', 'image', 
            'stock', 'is_new', 'is_hot', 'is_popular',  # ADDED is_hot
            'average_rating', 'rating_count', 'category'
        ]