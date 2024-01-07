import { NewPlan } from "./interfaces";


export function defaultNewPlan() {
  let newPlan: NewPlan = {
    ingredientRestrictions: [
      {element: 'Rice', operator: 'more than (weekly)', value: ['6']},
      {element: 'Rice', operator: 'never combine with', value: ['meat']},
      {element: 'Pasta', operator: 'between (daily)', value: ['3', '6']},
      {element: 'Pasta', operator: 'force', value: ['SUN breakfast', 'SAT lunch']},
    ],
    days: [
      {
        day: 'Monday', 
        dailyRestrictions: [
          {element: 'calories', operator: 'less than', value: ['367']}
        ],
        meals: [
          {name: 'breakfast', type: 'Secondary meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'lunch', type: 'Main meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'snack', type: 'Snack meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'dinner', type: 'Main meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3}
        ]
      },
      {
        day: 'Tuesday', 
        dailyRestrictions: [
          {element: 'calories', operator: 'less than', value: ['367']}
        ],
        meals: [
          {name: 'breakfast', type: 'Secondary meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'lunch', type: 'Main meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'snack', type: 'Snack meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'dinner', type: 'Main meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3}
        ]
      },
      {
        day: 'Wednesday', 
        dailyRestrictions: [
          {element: 'calories', operator: 'less than', value: ['367']}
        ],
        meals: [
          {name: 'breakfast', type: 'Secondary meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'lunch', type: 'Main meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'snack', type: 'Snack meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'dinner', type: 'Main meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3}
        ]
      },
      {
        day: 'Thursday', 
        dailyRestrictions: [
          {element: 'calories', operator: 'less than', value: ['367']}
        ],
        meals: [
          {name: 'breakfast', type: 'Secondary meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'lunch', type: 'Main meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'snack', type: 'Snack meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'dinner', type: 'Main meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3}
        ]
      },{
        day: 'Friday', 
        dailyRestrictions: [
          {element: 'calories', operator: 'less than', value: ['367']}
        ],
        meals: [
          {name: 'breakfast', type: 'Secondary meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'lunch', type: 'Main meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'snack', type: 'Snack meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'dinner', type: 'Main meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3}
        ]
      }
      ,{
        day: 'Saturday', 
        dailyRestrictions: [
          {element: 'calories', operator: 'less than', value: ['367']}
        ],
        meals: [
          {name: 'breakfast', type: 'Secondary meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'lunch', type: 'Main meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'snack', type: 'Snack meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'dinner', type: 'Main meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3}
        ]
      },
      {
        day: 'Sunday', 
        dailyRestrictions: [
          {element: 'calories', operator: 'less than', value: ['367']}
        ],
        meals: [
          {name: 'breakfast', type: 'Secondary meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'lunch', type: 'Main meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'snack', type: 'Snack meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3},
          {name: 'dinner', type: 'Main meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3}
        ]
      }
    ]
  }
  return newPlan;
}