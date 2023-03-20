import { useEffect, useState } from 'react';
import Table from '../Shared/Table/Table';
import { ColumnType, TableColumn } from '../Shared/Table/Table.utils';
import { Ingredient, IngredientType, MealType } from '../Utils/Interfaces';
import './Ingredients.css';


function Ingredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [tableColumns, setTableColumns] = useState<TableColumn[]>([]);

  useEffect(() => {
    setTableColumns([
      {property: 'name', header: 'Name', style: {width: '20%'}, type: ColumnType.TEXT},
      {property: 'type', header: 'Type', style: {width: '20%'}, type: ColumnType.TEXT},
      {property: 'mealTypes', header: 'Meals', style: {width: '25%'}, type: ColumnType.LIST},
      {property: 'calories', header: 'Calories', style: {width: '9%'}, type: ColumnType.TEXT},    
      {property: 'protein', header: 'Protein', style: {width: '9%'}, type: ColumnType.TEXT},  
      {property: 'price', header: 'Price', style: {width: '9%'}, type: ColumnType.TEXT},  
    ]);

    setIngredients([
      {name: 'Arroz', type: IngredientType.SECONDARY, mealTypes: [MealType.LUNCH, MealType.DINNER], calories: 169, protein: 7.3, price: 1},
      {name: 'Arroz', type: IngredientType.SECONDARY, mealTypes: [MealType.LUNCH, MealType.DINNER], calories: 169, protein: 7.3, price: 1},
      {name: 'Arroz', type: IngredientType.SECONDARY, mealTypes: [MealType.LUNCH, MealType.DINNER], calories: 169, protein: 7.3, price: 2},
      {name: 'Arroz', type: IngredientType.SECONDARY, mealTypes: [MealType.LUNCH, MealType.DINNER], calories: 169, protein: 7.3, price: 1},
      {name: 'Arroz', type: IngredientType.SECONDARY, mealTypes: [MealType.LUNCH, MealType.DINNER], calories: 169, protein: 7.3, price: 2},
      {name: 'Arroz', type: IngredientType.SECONDARY, mealTypes: [MealType.LUNCH, MealType.DINNER], calories: 169, protein: 7.3, price: 1},
      {name: 'Arroz', type: IngredientType.SECONDARY, mealTypes: [MealType.LUNCH, MealType.DINNER], calories: 169, protein: 7.3, price: 2},
    ]);
  }, []);

  return (
    <div className="page">
      <Table data={ingredients} columns={tableColumns}></Table>
    </div>
  );
}

export default Ingredients;
