from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category, Product
from .serializers import ProductSerializer, CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    lookup_field = 'id'

    def get_queryset(self):
        queryset = Product.objects.filter(available=True)
        category_id = self.request.query_params.get('category_id', None)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category_slug = request.query_params.get('slug')
        if not category_slug:
            return Response({'error': 'Category slug required'}, status=400)
        
        products = Product.objects.filter(
            available=True,
            category__slug=category_slug
        )
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)