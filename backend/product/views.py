from .models import Product
from rest_framework import status
from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import ProductSerializer
from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework.decorators import permission_classes, api_view
from django.shortcuts import get_object_or_404


class ProductView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductDetailView(APIView):
    def get(self, request, pk):
        try:
            if not pk.isdigit():
                return Response({"detail": "Invalid product ID"}, status=status.HTTP_400_BAD_REQUEST)
            product = Product.objects.get(id=int(pk))
            serializer = ProductSerializer(product, many=False, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
            "is_new": data.get("is_new", False),
            "is_popular": data.get("is_popular", False),
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
            "is_new": data.get("is_new", product.is_new),
            "is_popular": data.get("is_popular", product.is_popular),
            "average_rating": data.get("average_rating", product.average_rating),
            "rating_count": data.get("rating_count", product.rating_count),
        }
        serializer = ProductSerializer(product, data=updated_product)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_wishlist(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    if product.wishlisted_by.filter(id=request.user.id).exists():
        product.wishlisted_by.remove(request.user)
        return Response({"detail": "Removed from wishlist"}, status=status.HTTP_200_OK)
    else:
        product.wishlisted_by.add(request.user)
        return Response({"detail": "Added to wishlist"}, status=status.HTTP_200_OK)


# ADD THIS MISSING FUNCTION:
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_wishlist(request):
    try:
        print(f"DEBUG: Getting wishlist for user: {request.user.username} (ID: {request.user.id})")
        wishlist_products = Product.objects.filter(wishlisted_by=request.user)
        print(f"DEBUG: Found {wishlist_products.count()} wishlist items")
        serializer = ProductSerializer(wishlist_products, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"DEBUG: Error in get_wishlist: {str(e)}")
        return Response({"detail": f"Error fetching wishlist: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_wishlist(request):
    try:
        print(f"DEBUG: Getting wishlist for user: {request.user.username} (ID: {request.user.id})")
        
        # Method 1: Try reverse relationship
        try:
            wishlist_products = request.user.wishlist_products.all()
            print(f"DEBUG: Reverse relation count: {wishlist_products.count()}")
        except Exception as e:
            print(f"DEBUG: Reverse relation failed: {e}")
            # Method 2: Fallback to direct filter
            wishlist_products = Product.objects.filter(wishlisted_by=request.user)
            print(f"DEBUG: Direct filter count: {wishlist_products.count()}")
        
        serializer = ProductSerializer(wishlist_products, many=True, context={'request': request})
        print(f"DEBUG: Serialization successful")
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"DEBUG: Error in get_wishlist: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response(
            {"detail": f"Error fetching wishlist: {str(e)}"}, 
            status=status.HTTP_400_BAD_REQUEST
        )