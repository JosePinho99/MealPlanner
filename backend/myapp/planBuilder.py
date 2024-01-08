import random




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
  basePlan = getStartingPlan(planData, ingredients)
  dailyLimits,ingWeeklyLimits,ingDailyLimits,ingPriorities,ingAvoidances,ingCombines,ingDontCombines = getValidationDicts(planData["dailyRestrictions"], planData["ingredientRestrictions"])
  
  validatePlan(basePlan, dailyLimits, ingWeeklyLimits, ingDailyLimits, ingPriorities, ingAvoidances, ingCombines, ingDontCombines)
 


#Return a random plan that will act as the initial plan
def getStartingPlan(planData, ingredients):
  mealsInfo = planData["meals"]
  plan = [[], [], [], [], [], [], []]
  for day in plan:     
    for mealInfo in mealsInfo:
      meal = fillMeal(mealInfo, ingredients)  
      day.append(meal)
  return plan

    

def fillMeal(mealInfo, ingredients):
  meal = [mealInfo["name"]]
  remainingMainIngs = mealInfo["mIMin"]
  remainingSecondaryIngs = mealInfo["sIMin"]
  remainingExtraIngs = mealInfo["eIMin"]
  mealType = mealInfo["type"]
  random.shuffle(ingredients)

  for ingredient in ingredients:
    if mealType in ingredient["allowedMeals"]:
      if (ingredient["type"] == "Main" and remainingMainIngs > 0):
        addIngredient(meal, ingredient)
        remainingMainIngs -= 1
      if (ingredient["type"] == "Secondary" and remainingSecondaryIngs > 0):
        addIngredient(meal, ingredient)
        remainingSecondaryIngs -= 1
      if (ingredient["type"] == "Extra" and remainingExtraIngs > 0):
        addIngredient(meal, ingredient)
        remainingExtraIngs -= 1
    if (remainingMainIngs == 0 and remainingSecondaryIngs == 0 and remainingExtraIngs == 0):
      return meal 
        
  print("ERROR", mealInfo["name"], remainingMainIngs, remainingSecondaryIngs, remainingExtraIngs)
  #ERROR, NOT ENOUGH INGREDIENTS TO FULLFILL MINIMUM MEAL QUANTITIES REQUIREMENTS
            

#Adds an ingredient, takes into consideration the interval for min and max quantities
def addIngredient(meal, ingredient):
  quantitySelected = random.randint(float(ingredient['quantityMinimum']), float(ingredient['quantityMaximum']))   
  meal.append({
    "name": ingredient["name"],
    "price": round((float(ingredient["price"]) * quantitySelected) / float(ingredient["referenceValue"]), 2),
    "calories": round((float(ingredient["calories"]) * quantitySelected) / float(ingredient["referenceValue"]), 2),
    "proteins": round((float(ingredient["proteins"]) * quantitySelected) / float(ingredient["referenceValue"]), 2),
    "quantity": str(quantitySelected),
    "measure": ingredient["measure"]
  })


#Here we prepare the data structures necessary to validate one meal plan in a more direct way
#Having these will make it that for each validation, only one iteration of the plan will be needed
def getValidationDicts(dailyRestrictions, ingredientRestrictions):
  dailyLimits = {}
  ingWeeklyLimits = {}
  ingDailyLimits = {}
  ingPriorities = {}
  ingAvoidances = {}
  ingCombines = []
  ingDontCombines = []

  for restriction in dailyRestrictions:
    addCountLimitsToDict(restriction, dailyLimits, "more than", "less than", "between")

  for restriction in ingredientRestrictions:
    addCountLimitsToDict(restriction, ingWeeklyLimits, "more than (weekly)", "less than (weekly)", "between (weekly)")
    addCountLimitsToDict(restriction, ingDailyLimits, "more than (daily)", "less than (daily)", "between (daily)")
    if restriction["operator"] == "prioritize":
      [dictionaryCreateOrUpdateList(ingPriorities, value, restriction["element"]) for value in restriction["value"]]
    if restriction["operator"] == "avoid":
      [dictionaryCreateOrUpdateList(ingAvoidances, value, restriction["element"]) for value in restriction["value"]]

    if restriction["operator"] == "combine with":
      ingCombines.append([restriction["element"], restriction["value"][0]])
    if restriction["operator"] == "don't combine with":
      ingDontCombines.append([restriction["element"], restriction["value"][0]])

  return dailyLimits,ingWeeklyLimits,ingDailyLimits,ingPriorities,ingAvoidances,ingCombines,ingDontCombines



def addCountLimitsToDict(restriction, dict, operatorMoreThan, operatorLessThan, operatorBetween):
  dict[restriction["element"]] = [0, 9999999]
  if restriction["operator"] == operatorMoreThan:
    dict[restriction["element"]][0] = int(restriction["value"][0])
  if restriction["operator"] == operatorLessThan:
    dict[restriction["element"]][1] = int(restriction["value"][0])
  if restriction["operator"] == operatorBetween:
    dict[restriction["element"]][0] = int(restriction["value"][0])
    dict[restriction["element"]][1] = int(restriction["value"][1])
    


#Validate the plan, gives it a score, where 0 fits all criteria and n is number of criteria missed
#Done so that if a plan can't fullfill all criteria, it still is able to return suggestions close to the requested
def validatePlan(plan, dailyLimits, ingWeeklyLimits, ingDailyLimits, ingPriorities, ingAvoidances, ingCombines, ingDontCombines): 
  weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
  errors = [] 
  ingredientsUsedWeekly = {}  
  for index, day in enumerate(plan):
    dailyCals = 0
    dailyPrice = 0
    ingredientsUsedDaily = {}

    for meal in day:
      mealName = meal[0]
      dayMeal = weekDays[index] + " " + mealName
      ingredientsUsedInMeal = []
      for ingredient in meal[1:]:
        ingredientsUsedInMeal.append(ingredient["name"])
        dailyCals += ingredient["calories"]
        dailyPrice += ingredient["price"]
        dictionaryCreateOrUpdateSum(ingredientsUsedDaily, ingredient["name"])
        dictionaryCreateOrUpdateSum(ingredientsUsedWeekly, ingredient["name"])

      validateMeal(errors, dayMeal, ingCombines, ingDontCombines, ingPriorities, ingAvoidances, ingredientsUsedInMeal)
    
    validateDay(errors, ingDailyLimits, dailyLimits, ingredientsUsedDaily, dailyPrice, dailyCals)

  validateWeek(errors, ingWeeklyLimits, ingredientsUsedWeekly)

  for error in errors:
    print(error)

  
            


#Validate restriction specific to meals, like combinations or priorities
def validateMeal(errors, dayMeal, ingCombines, ingDontCombines, ingPriorities, ingAvoidances, ingredientsUsedInMeal):
  for combination in ingCombines:
    if (combination[0] in ingredientsUsedInMeal and not combination[1] in ingredientsUsedInMeal) or (combination[1] in ingredientsUsedInMeal and not combination[0] in ingredientsUsedInMeal):
      errors.append("MISSING_COMBINATION-" + dayMeal + combination[0] + combination[1]) 

  for combination in ingDontCombines:
    if combination[0] in ingredientsUsedInMeal and combination[1] in ingredientsUsedInMeal:
      errors.append("BAD_COMBINATION-" + dayMeal) 

  if (dayMeal in ingPriorities.keys()):
    for prioritizedIngredient in ingPriorities[dayMeal]:
      if not prioritizedIngredient in ingredientsUsedInMeal:
        errors.append("MISSING_PRIORITIZED-" + dayMeal)   

  if (dayMeal in ingAvoidances.keys()):
    for avoidingIngredient in ingAvoidances[dayMeal]:
      if avoidingIngredient in ingredientsUsedInMeal:
        errors.append("AVOIDED_EXISTS-" + dayMeal)   


#Validate restriction specific to a day, like daily quantities
def validateDay(errors, ingDailyLimits, dailyLimits, ingredientsUsedDaily, dailyPrice, dailyCals):
  for k,v in ingDailyLimits.items():
    if k in ingredientsUsedDaily.keys():
      if (ingredientsUsedDaily[k] < ingDailyLimits[k][0]):
        errors.append("LOW-" + k)     
      if (ingredientsUsedDaily[k] > ingDailyLimits[k][1]):
        errors.append("HIGH-" + k)    

  if (dailyPrice < dailyLimits["price"][0]):
    errors.append("LOW-price")     
  if (dailyPrice > dailyLimits["price"][1]):
    errors.append("HIGH-price")  
  if (dailyCals < dailyLimits["calories"][0]):
    errors.append("LOW-calories")     
  if (dailyCals > dailyLimits["calories"][1]):
    errors.append("HIGH-calories")    


#Validate restriction specific to the whole week, like weekly quantities
def validateWeek(errors, ingWeeklyLimits, ingredientsUsedWeekly):
  for k in ingWeeklyLimits.keys():
    if k in ingredientsUsedWeekly.keys():
      if (ingredientsUsedWeekly[k] < ingWeeklyLimits[k][0]):
        errors.append("LOW-" + k)     
      if (ingredientsUsedWeekly[k] > ingWeeklyLimits[k][1]):
        errors.append("HIGH-" + k)       



def dictionaryCreateOrUpdateSum(dict, value):
  if value in dict.keys():
    dict[value] += 1
  else:
    dict[value] = 1    


def dictionaryCreateOrUpdateList(dict, key, value):
  if key in dict.keys():
    dict[key].append(value)
  else:
    dict[key] = [value]

        
    