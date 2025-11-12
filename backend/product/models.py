from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    stock = models.BooleanField(default=True)
    category = models.CharField(max_length=100, default='General')
    
    # Badge fields
    is_new = models.BooleanField(default=False)
    is_popular = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name