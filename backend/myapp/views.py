from django.http import JsonResponse
import json

from .models  import MealPlanner
from . import planBuilder


def newPlan(request):
    data = json.loads(request.body.decode('utf-8'))
    ingredients = MealPlanner.objects.filter(username="Kaxinauas").values_list("ingredients", flat=True)
    planBuilder.getPlan(data, ingredients[0])
    return JsonResponse(data)


def getIngredients(request):
    ingredients = MealPlanner.objects.filter(username="Kaxinauas").values_list("ingredients", flat=True)
    return JsonResponse(ingredients[0], safe=False)


def updateIngredients(request): 
    user = MealPlanner.objects.get(username="Kaxinauas")
    ingredients = json.loads(request.body)
    user.ingredients = ingredients
    user.save()
    return JsonResponse({'success': True})
