import React from 'react';
import './Navigation.css'
import {FaPizzaSlice, FaListAlt} from 'react-icons/fa';
import { Page } from './Navigation.utils';


function Navigation(props: any) {

  function changePage(page: Page) {
    props.onSelectPage(page); 
  }

  return (
    <div className="nav">
        <div className="nav-entry" onClick={() => changePage(Page.FOOD_PLANS)}><FaListAlt size={14}/> Plans </div>
        <div className="nav-entry" onClick={() => changePage(Page.INGREDIENTS)}><FaPizzaSlice size={14}/> Ingredients </div>
        <div className="nav-entry"></div>
        <div className="nav-entry"></div>
    </div>
  );
}

export default Navigation;
