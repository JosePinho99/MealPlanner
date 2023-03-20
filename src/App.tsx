import React, { useState } from 'react';
import './App.css';
import FoodPlans from './FoodPlans/FoodPlans';
import Ingredients from './Ingredients/Ingredients';
import Navigation from './Navigation/Navigation';
import { Page } from './Navigation/Navigation.utils';

function App() {
  const [currentPage, setCurrentPage] = useState(Page.FOOD_PLANS);

  function changePage(page: Page) {
    setCurrentPage(page);
  }

  function renderPage() {
    switch (currentPage) {
      case Page.FOOD_PLANS:
        return <FoodPlans></FoodPlans>
      case Page.INGREDIENTS:
        return <Ingredients></Ingredients>
      default:
        return <FoodPlans></FoodPlans>
    }
  }

  return (
    <div className="App">
        <Navigation onSelectPage={changePage}></Navigation>
        {renderPage()}
    </div>
  );
}

export default App;
