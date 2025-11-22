from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    stock = models.BooleanField(default=True)
    is_new = models.BooleanField(default=False)
    is_hot = models.BooleanField(default=False)
    is_popular = models.BooleanField(default=False)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    rating_count = models.PositiveIntegerField(default=0)
    category = models.CharField(max_length=100, default='General')
    wishlisted_by = models.ManyToManyField(User, related_name='wishlist_products', blank=True)
    
    def __str__(self):
        return self.name