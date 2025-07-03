const form = document.querySelector('.search-form')
const recipeList = document.querySelector('.recipe-list'); 
const recipeDetails = document.querySelector('.recipe-details')



form.addEventListener('submit', function(event){
    event.preventDefault()
    const inputValue = document.querySelector('.search-input').value;

    searchRecipes(inputValue)
})

async function searchRecipes(ingredient){
    recipeList.innerHTML = `<p>Carregando receitas...</p>`
    recipeDetails.innerHTML = '';
    try{
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);

    const data = await response.json()

    showRecipes(data.meals)
    } catch(err){
      recipeList.innerHTML = `<p>Nenhuma receita encontrada</p>`
    }
}

function showRecipes(recipes){
    recipeList.innerHTML = recipes.map(
        (item) => `
        <div class="recipe-card" onclick="getRecipesDetails(${item.idMeal})">
            <img src="${item.strMealThumb}" alt="receita-foto">
            <h3>${item.strMeal}</h3>
        
        </div>
        `
    ).join('')
}
    
async function getRecipesDetails(id){
        
        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
        )
        const data = await response.json()
        const recipe = data.meals[0]

        let ingredients = ''

        for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== '') {
            ingredients += `<li>${ingredient} - ${measure}</li>`;
        } else {
            break; // se não houver mais ingredientes, sai do laço
        }

    }

    recipeDetails.innerHTML =  `
        <h2>${recipe.strMeal}</h2>  
        <img src="${recipe.strMealThumb}" alt=${recipe.strMeal} class="recipe-img"> 
        <h3>Categoria: ${recipe.strCategory}</h3> 
        <h3>Origem: ${recipe.strArea}</h3>
        <h3>Ingredientes:</h3>
        <ul>${ingredients}</ul>
        <h3>Instruções:</h3>
        <p>${recipe.strInstructions}</p>
        <p><strong>Tags: </strong> ${recipe.strTags}</p>
        <p><strong>Video:</strong> <a href="${recipe.strYouTube}" target="_blank">Assista no YouTube</a></p>
    `  

}
