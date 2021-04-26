let search;
let output;
const searchCall = () => {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search.value}`)
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      let outputData = `<div class="card mb-3">
      <div class="row g-0">
        <div class="col-md-4">`;
      if (json.meals[0].strMealThumb) {
        outputData += `<img src=${json.meals[0].strMealThumb} alt="..." style="max-width:270px">`;
      } else {
        outputData += `Image Link Unavailable`;
      }
      outputData += `
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h4 class="card-title">${json.meals[0].strMeal || "-"}</h4>
            <h5 class="card-title">Instructions</h5>
            <p class="card-text">${json.meals[0].strInstructions || "-"}</p>
            <h5 class="card-title">Tags</h5>
            <p class="card-text">${json.meals[0].strTags || "-"}</p>
          </div>`;
      if (json.meals[0].strSource) {
        outputData += `<a href=${json.meals[0].strSource}><button type="button" class="btn btn-outline-primary">View Source Website</button></a>`;
      } else {
        outputData += `Link to Source Unavailable`;
      }
      if (json.meals[0].strYoutube) {
        outputData += `<a href=${json.meals[0].strYoutube}><button type="button" class="btn btn-outline-primary">Watch on Youtube</button></a>`;
      } else {
        outputData += `Link to Youtube Video Unavailable`;
      }
      outputData += `
      <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Add Review</button>
        </div>
        </div>
        </div>`;
      output.innerHTML = outputData;
    });
};

document.addEventListener("DOMContentLoaded", function (event) {
  search = document.getElementById("search");
  output = document.getElementById("output");
  document.getElementById("searchButton").addEventListener("click", searchCall);
});
