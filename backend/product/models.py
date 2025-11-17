from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    
    # Stock field (keep it simple for now)
    stock = models.BooleanField(default=True)
    
    # Badge fields - ADDING HOT FEATURE
    is_new = models.BooleanField(default=False)
    is_hot = models.BooleanField(default=False)  # ADD THIS LINE
    is_popular = models.BooleanField(default=False)
    
    # Rating fields
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    rating_count = models.PositiveIntegerField(default=0)
    
    category = models.CharField(max_length=100, default='General')
    
    def __str__(self):
        return self.name