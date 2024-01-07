import random

def addIngredient(meal, ingredient, ingredientsMinMax):
    quantitySelected = random.randint(float(ingredient['quantityMinimum']), float(ingredient['quantityMaximum']))
    
    meal.append({
        'name': ingredient['name'],
        'price': round((float(ingredient['price']) * quantitySelected) / float(ingredient['referenceValue']), 2),
        'calories': round((float(ingredient['calories']) * quantitySelected) / float(ingredient['referenceValue']), 2),
        'proteins': round((float(ingredient['proteins']) * quantitySelected) / float(ingredient['referenceValue']), 2),
        'quantity':  str(quantitySelected)
    })
    ingredientsMinMax[ingredient['type']] -= 1


def transformIngredient(meal, ingredient, ingredientsMinMax, allowedIngredients, planData):
    if ingredientsMinMax[ingredient['type']] > 0: 
        addIngredient(meal, ingredient, ingredientsMinMax)

        for restriction in planData['ingredientRestrictions']:
            if restriction['operator'] == 'always combine with' and restriction['element'] == ingredient['name']:
                for value in restriction['value']:
                    found = False
                    for i, ing in enumerate(allowedIngredients):
                        if value == ing['name']:
                            if ingredientsMinMax[ing['type']] > 0:                        
                                addIngredient(meal, ing, ingredientsMinMax)
                            else:
                                ingredientsMinMax[ing['type']] = -1
                            found = True
                        
                    if found == False and restriction['operator'] == 'always combine with':
                        ingredientsMinMax[ingredient['type']] = -2
                        return False

            if restriction['operator'] == 'never combine with' and restriction['element'] == ingredient['name']:
                for value in restriction['value']:
                    for i, ing in enumerate(allowedIngredients):
                        if value == ing['name']:
                            allowedIngredients.pop(i)



def getIMinIMaxValue(minimum, maximum):
    return random.randint(float(minimum), float(maximum))


def buildMeal(mealSettings, ingredientsLimits, day, planData, ingredients, failedRestrictions):
    meal = []
    allowedIngredients = []
    ingredientsMinMax = {
        'Main': getIMinIMaxValue(mealSettings['mIMin'], mealSettings['mIMax']),
        'Secondary': getIMinIMaxValue(mealSettings['sIMin'], mealSettings['sIMax']),
        'Extra': getIMinIMaxValue(mealSettings['eIMin'], mealSettings['eIMax']),
    }

    for ingredient in ingredients:
        for ingredientLimits in ingredientsLimits:
            if ingredientLimits['name'] == ingredient['name'] and ingredientLimits['current'] > ingredientLimits['max']:
                continue
            
        if mealSettings['type'] in ingredient['allowedMeals']:
            allowedIngredients.append(ingredient)

    random.shuffle(allowedIngredients)

    for restriction in planData['ingredientRestrictions']:
        if (restriction['operator'] == 'force' or restriction['operator'] == 'prohibit') and (day + ' ' + mealSettings['name']) in restriction['value']:
            found = False
            for i, ingredient in enumerate(allowedIngredients):
                if restriction['element'] == ingredient['name']:
                    item = allowedIngredients.pop(i)
                    if restriction['operator'] == 'force':
                        allowedIngredients.insert(0, item)
                    found = True
                    
            if found == False and restriction['operator'] == 'force':
                failedRestrictions.append('Not able to force ' + restriction['element'] + 'on ' + day + ' ' + mealSettings['name'])
                return False

                 
    for ingredient in allowedIngredients:
        transformIngredient(meal, ingredient, ingredientsMinMax, allowedIngredients, planData)
        if ingredientsMinMax['Main'] == 0 and ingredientsMinMax['Secondary'] == 0 and ingredientsMinMax['Extra'] == 0:
            break

    if ingredientsMinMax['Main'] != 0 or ingredientsMinMax['Secondary'] != 0 or ingredientsMinMax['Extra'] != 0:
        if ingredientsMinMax['Main'] == -1 or ingredientsMinMax['Secondary'] == -1 or ingredientsMinMax['Extra'] == -1:
            pass
        elif ingredientsMinMax['Main'] == -2 or ingredientsMinMax['Secondary'] == -2 or ingredientsMinMax['Extra'] == -2:
            failedRestrictions.append('Trying to combine ingredients that do not share the same allowed meals')
        else:
            failedRestrictions.append('Not enough ingredients ' + mealSettings['name'])
        return False
    if len(allowedIngredients) == 0:
        failedRestrictions.append('No ingredients allowed ' + mealSettings['name'])
        return False
    return meal


def validRestriction(operator, limits, value):
    if operator == 'more than':
        if value > float(limits[0]):
            return True

    if operator == 'less than':
        if value < float(limits[0]):
            return True

    if operator == 'between':
        if value > float(limits[0]) and value < float(limits[1]):
            return True
        
    return False

def checkDayValidity(dailyRestrictions, dailyPlan, failedRestrictions):
    price, calories, proteins = 0, 0, 0
    for meal in dailyPlan:
        for ingredient in meal:
            price += ingredient['price']
            calories += ingredient['calories']
            proteins += ingredient['proteins']


    for restriction in dailyRestrictions:
        if restriction['element'] == 'price':
            if not validRestriction(restriction['operator'], restriction['value'], price):
                failedRestrictions.append(restriction['element'])
                return False

        if restriction['element'] == 'calories':
            if not validRestriction(restriction['operator'], restriction['value'], calories):
                failedRestrictions.append(restriction['element'])
                return False

        if restriction['element'] == 'proteins':
            if not validRestriction(restriction['operator'], restriction['value'], proteins):
                failedRestrictions.append(restriction['element'])
                return False
    return True


def updateIngredientsLimitsOk(ingredientsLimits, dailyPlan):
    redo = False
    for meal in dailyPlan:
        for ingredient in meal:
            for ingredientLimit in ingredientsLimits:
                if ingredient['name'] == ingredientLimit['name']:
                    ingredientLimit['current'] += 1
                    if ingredientLimit['current'] > ingredientLimit['max']:
                        redo = True


    #For the cases where an ingredient is used multiple times in the same day and passes the limit, since we only add it at the end of the daily plan and not after meal
    #due to the fact that the meal could be invalid, and it would be harder to rollback then
    if redo:
        for meal in dailyPlan:
            for ingredient in meal:
                for ingredientLimit in ingredientsLimits:
                    if ingredient['name'] == ingredientLimit['name']:
                        ingredientLimit['current'] -= 1
    
    return not redo


def buildPlan(weekPlan, iteration, ingredientsLimits, planData, ingredients, failedRestrictions):
    days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    dayCounter = 0
    for i, day in enumerate(planData['days']):
        if len(weekPlan[i]) == 0:
            dailyPlan = []
            validMeal = True
            for mealSettings in day['meals']:
                meal = buildMeal(mealSettings, ingredientsLimits, days[dayCounter], planData, ingredients, failedRestrictions)
                if isinstance(meal, list):
                  dailyPlan.append(meal)
                else:
                  validMeal = False
                  break

            if validMeal and updateIngredientsLimitsOk(ingredientsLimits, dailyPlan) and checkDayValidity(day['dailyRestrictions'], dailyPlan, failedRestrictions):
                weekPlan[i] = dailyPlan
            else:
                weekPlan[i] = []
        dayCounter += 1

    daysPassed = 0
    for day in weekPlan:
        if len(day) > 0:
            daysPassed += 1

    if daysPassed == 7:
        return weekPlan

    if iteration < 100:
        return buildPlan(weekPlan, iteration + 1, ingredientsLimits, planData, ingredients, failedRestrictions)
    else:
        return []


def getPlan(planData, ingredients):
    failedRestrictions = []

    for iteration in range(100):
      ingredientsLimits = []
      for ingredient in ingredients:
          minimum = 0
          current = 0
          maximum = 30
          for restriction in planData['ingredientRestrictions']:
              if restriction['element'] == ingredient['name']:
                  if restriction['operator'] == 'more than (weekly)':
                      minimum = float(restriction['value'][0]) - 1
                  if restriction['operator'] == 'less than (weekly)':
                      maximum = float(restriction['value'][0]) - 1
                  if restriction['operator'] == 'between (weekly)':
                      minimum = float(restriction['value'][0]) - 1
                      minimum = float(restriction['value'][1]) - 1

          ingredientsLimits.append({'name': ingredient['name'], 'min': minimum, 'current': current, 'max': maximum})

      result = buildPlan([[], [], [], [], [], [], []], 1, ingredientsLimits, planData, ingredients, failedRestrictions)

      if len(result) > 0:
        totalCalories = 0
        totalProteins = 0
        totalPrice = 0
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        for i, day in enumerate(result):
            print(days[i])
            print('--------------------')
            calories = 0
            proteins = 0
            price = 0
            for meal in day:
                for ingredient in meal:
                    print(ingredient)
                    calories += ingredient['calories']
                    proteins += ingredient['proteins']
                    price += ingredient['price']
                print()
            print(calories, proteins, price)
            totalCalories += calories
            totalProteins += proteins
            totalPrice += price

            print()
            print()
        print('END STATS')
        print(totalCalories / 7, totalProteins / 7, (totalPrice * 31 * 4) / 28)
        print()


        break


    errors = {}
    for fail in failedRestrictions:
        if fail in errors:
            errors[fail] += 1
        else:
            errors[fail] = 1

    mostCommon = 0
    standard = 0
    for k,v in errors.items():
        if v > standard:
            standard = v
            mostCommon = k

    print(standard, mostCommon)
