from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from cart.models import Cart
from .models import Order, OrderItem
from .serializers import OrderSerializer
from products.models import Product


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @action(detail=False, methods=['post'])
    def create_from_cart(self, request):
        """Create order from cart"""
        cart_id = request.session.get('cart_id')
        
        if not cart_id:
            return Response(
                {'error': 'No active cart'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cart = Cart.objects.get(id=cart_id)
        except Cart.DoesNotExist:
            return Response(
                {'error': 'Cart not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if not cart.items.exists():
            return Response(
                {'error': 'Cart is empty'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create order
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        order = serializer.save()
        
        # Add items to order
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                price=item.product.price,
                quantity=item.quantity,
            )
        
        # Clear cart
        cart.delete()
        if 'cart_id' in request.session:
            del request.session['cart_id']
        
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )

