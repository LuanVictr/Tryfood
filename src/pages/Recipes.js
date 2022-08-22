import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import MyContext from '../context/MyContext';
// import Footer from '../components/Footer';
// import Header from '../components/Header';

function Recipes() {
  const history = useHistory();
  const path = history.location.pathname;
  const {
    recipes, setRecipes, categories, setCategories,
    filteredRecipes, setFilteredRecipes,
  } = useContext(MyContext);
  const maxRecipes = 12;
  const maxCategories = 5;
  const [recipeName, setRecipeName] = useState('');

  useEffect(() => {
    const fetchAPI = async () => {
      if (path === '/foods') {
        const responseFoods = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        const dataFoods = await responseFoods.json();
        const slicedArrayFoods = dataFoods.meals.slice(0, maxRecipes);
        setRecipes(slicedArrayFoods);

        const responseCategories = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
        const dataCategories = await responseCategories.json();
        const slicedArrayCategories = dataCategories.meals.slice(0, maxCategories);
        setCategories(slicedArrayCategories);
      }
      if (path === '/drinks') {
        const responseDrinks = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
        const dataDrinks = await responseDrinks.json();
        const slicedArrayDrinks = dataDrinks.drinks.slice(0, maxRecipes);
        setRecipes(slicedArrayDrinks);

        const responseCategories = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
        const dataCategories = await responseCategories.json();
        const slicedArrayCategories = dataCategories.drinks.slice(0, maxCategories);
        setCategories(slicedArrayCategories);
      }
    };
    fetchAPI();
  }, []);

  const redirect = (recipe) => {
    if (recipe.idMeal) {
      history.push(`/foods/${recipe.idMeal}`);
    } else {
      history.push(`/drinks/${recipe.idDrink}`);
    }
  };

  const cardRecipes = (arrayOfRecipes) => arrayOfRecipes.map((recipe, index) => {
    const thumb = recipe.strMealThumb ? recipe.strMealThumb : recipe.strDrinkThumb;
    const name = recipe.strMeal ? recipe.strMeal : recipe.strDrink;
    return (
      <div
        data-testid={ `${index}-recipe-card` }
        key={ name }
        onClick={ () => redirect(recipe) }
        onKeyDown={ redirect }
        aria-hidden
      >
        <img src={ thumb } alt={ name } data-testid={ `${index}-card-img` } />
        <p data-testid={ `${index}-card-name` }>{name}</p>
      </div>
    );
  });

  const onClick = async ({ target }) => {
    const { value } = target;
    if (recipeName === target.value) {
      setFilteredRecipes([]);
      setRecipeName('');
    } else {
      if (value === 'All') {
        setFilteredRecipes([]);
      }
      if (value !== 'All') {
        if (path === '/foods') {
          const responseFoods = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${value}`);
          const dataFoods = await responseFoods.json();
          const slicedArrayFoods = dataFoods.meals.slice(0, maxRecipes);
          setFilteredRecipes(slicedArrayFoods);
          setRecipeName(target.value);
        }
        if (path === '/drinks') {
          const responseDrinks = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${value}`);
          const dataDrinks = await responseDrinks.json();
          const slicedArrayDrinks = dataDrinks.drinks.slice(0, maxRecipes);
          setFilteredRecipes(slicedArrayDrinks);
          setRecipeName(target.value);
        }
      }
    }
  };

  const renderFilterButtons = () => (

    categories.map((category, index) => (
      index === 0 ? (
        <>
          <button
            type="button"
            onClick={ onClick }
            value="All"
            data-testid="All-category-filter"
          >
            All
          </button>
          <button
            type="button"
            key={ category.strCategory }
            data-testid={ `${category.strCategory}-category-filter` }
            onClick={ onClick }
            value={ category.strCategory }
          >
            {category.strCategory}
          </button>
        </>
      ) : (
        <button
          type="button"
          key={ category.strCategory }
          data-testid={ `${category.strCategory}-category-filter` }
          onClick={ onClick }
          value={ category.strCategory }
        >
          {category.strCategory}
        </button>
      )
    ))

  );

  return (
    <div>
      {/* <Header title={ path } /> */}
      {
        renderFilterButtons()
      }
      {
        filteredRecipes.length === 0 ? cardRecipes(recipes) : cardRecipes(filteredRecipes)
      }
      {/* <Footer /> */}
    </div>
  );
}

export default Recipes;
