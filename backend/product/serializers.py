from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    is_wishlisted = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = '__all__'
    
    def get_is_wishlisted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.wishlisted_by.filter(id=request.user.id).exists()
        return False