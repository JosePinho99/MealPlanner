from django.contrib import admin
from django.urls import path
from myapp.views import newPlan
from myapp.views import getIngredients
from myapp.views import updateIngredients


urlpatterns = [
    path('newPlan/', newPlan, name='newPlan'),
    path('getIngredients/', getIngredients, name='getIngredients'),
    path('updateIngredients/', updateIngredients, name='updateIngredients'),
]
