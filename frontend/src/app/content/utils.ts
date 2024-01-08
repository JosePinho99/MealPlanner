import { NewPlan } from "./interfaces";


export function defaultNewPlan() {
  let newPlan: NewPlan = {
    dailyRestrictions: [
      {element: 'calories', operator: 'less than', value: ['2500']},
      {element: 'price', operator: 'less than', value: ['12']}
    ],
    ingredientRestrictions: [
      {element: 'Rice', operator: 'more than (weekly)', value: ['6']},
      {element: 'Rice', operator: 'combine with', value: ['Seitan tomate']},
      {element: 'Pasta', operator: 'between (weekly)', value: ['3', '6']},
      {element: 'Pasta', operator: 'prioritize', value: ['SUN breakfast', 'SAT lunch']},
    ],
    meals: [
        {name: 'breakfast', type: 'Secondary meal', mIMin: 1, mIMax: 2, sIMin: 1, sIMax: 6, eIMin: 0, eIMax: 3},
        {name: 'lunch', type: 'Main meal', mIMin: 1, mIMax: 2, sIMin: 1, sIMax: 6, eIMin: 0, eIMax: 3},
        {name: 'snack', type: 'Snack meal', mIMin: 1, mIMax: 2, sIMin: 0, sIMax: 6, eIMin: 0, eIMax: 3},
        {name: 'dinner', type: 'Main meal', mIMin: 1, mIMax: 2, sIMin: 1, sIMax: 6, eIMin: 0, eIMax: 3}
    ]
  }
  return newPlan;
}