from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from products.models import Product
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer


class CartViewSet(viewsets.ViewSet):
    """
    API endpoints for cart operations.
    Uses session-based cart storage.
    """
    
    def _get_or_create_cart(self, request):
        """Get or create cart based on session"""
        cart_id = request.session.get('cart_id')
        if cart_id:
            try:
                return Cart.objects.get(id=cart_id)
            except Cart.DoesNotExist:
                pass
        
        cart = Cart.objects.create()
        request.session['cart_id'] = cart.id
        return cart

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current cart"""
        cart = self._get_or_create_cart(request)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add item to cart"""
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        
        if not product_id:
            return Response(
                {'error': 'product_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        cart = self._get_or_create_cart(request)
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        """Remove item from cart"""
        product_id = request.data.get('product_id')
        
        if not product_id:
            return Response(
                {'error': 'product_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cart_id = request.session.get('cart_id')
        if not cart_id:
            return Response(
                {'error': 'No active cart'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            cart = Cart.objects.get(id=cart_id)
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return Response(
                {'error': 'Item not found in cart'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        cart_item.delete()
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def update_item(self, request):
        """Update item quantity"""
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')
        
        if not product_id or quantity is None:
            return Response(
                {'error': 'product_id and quantity are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cart_id = request.session.get('cart_id')
        if not cart_id:
            return Response(
                {'error': 'No active cart'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            cart = Cart.objects.get(id=cart_id)
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return Response(
                {'error': 'Item not found in cart'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if quantity <= 0:
            cart_item.delete()
        else:
            cart_item.quantity = quantity
            cart_item.save()
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def clear(self, request):
        """Clear entire cart"""
        cart_id = request.session.get('cart_id')
        if cart_id:
            try:
                cart = Cart.objects.get(id=cart_id)
                cart.delete()
            except Cart.DoesNotExist:
                pass
        
        if 'cart_id' in request.session:
            del request.session['cart_id']
        
        return Response({'message': 'Cart cleared'}, status=status.HTTP_200_OK)    