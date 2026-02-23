from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    cost = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'price', 'quantity', 'cost']

    def get_cost(self, obj):
        return obj.get_cost()


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_cost = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'full_name', 'email', 'address', 'items', 'paid', 'total_cost', 'created_at', 'update_at']
        read_only_fields = ['id', 'items', 'created_at', 'update_at']

    def get_total_cost(self, obj):
        return obj.get_total_cost()
