from .models import Product
from rest_framework import status
from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import ProductSerializer
from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework.decorators import permission_classes


class ProductView(APIView):

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductDetailView(APIView):

    def get(self, request, pk):
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductCreateView(APIView):

    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        user = request.user
        data = request.data

        product = {
            "name": data["name"],
            "description": data["description"],
            "price": data["price"],
            "stock": data["stock"],
            "image": data["image"],
            "category": data["category"],
            # ADD BADGE FIELDS
            "is_new": data.get("is_new", False),
            "is_popular": data.get("is_popular", False),
            # ADD RATING FIELDS (with defaults)
            "average_rating": data.get("average_rating", 0.0),
            "rating_count": data.get("rating_count", 0),
        }

        serializer = ProductSerializer(data=product, many=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ProductDeleteView(APIView):

    permission_classes = [permissions.IsAdminUser]

    def delete(self, request, pk):
        try:
            product = Product.objects.get(id=pk)
            product.delete()
            return Response({"detail": "Product successfully deleted."}, status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)


class ProductEditView(APIView):
    
    permission_classes = [permissions.IsAdminUser]

    def put(self, request, pk):
        data = request.data
        product = Product.objects.get(id=pk)
        
        updated_product = {
            "name": data.get("name", product.name),
            "description": data.get("description", product.description),
            "price": data.get("price", product.price),
            "stock": data.get("stock", product.stock),
            "image": data.get("image", product.image),
            "category": data.get("category", product.category),
            # ADD BADGE FIELDS - FIXED
            "is_new": data.get("is_new", product.is_new),
            "is_popular": data.get("is_popular", product.is_popular),
            # ADD RATING FIELDS - FIXED
            "average_rating": data.get("average_rating", product.average_rating),
            "rating_count": data.get("rating_count", product.rating_count),
        }

        serializer = ProductSerializer(product, data=updated_product)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)