from django.db import models


class MealPlanner(models.Model):
    username = models.TextField()
    password = models.TextField()
    ingredients = models.JSONField()
    plans = models.JSONField()

    class Meta:
        db_table = 'meal_planner'

