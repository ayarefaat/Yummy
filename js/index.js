//^ ============Hiding side bar=============//
let sidemenu =$('.sidebar .menu').outerWidth();
console.log(sidemenu);

$('.sidebar').css('left',`-${sidemenu}px`);

$('span.bars').on('click',function(){
    $('.sidebar').animate({'left':`0px`},800);
    $(this).css('display','none');
    $('span.collapse').css('display','inline-block');
    $('ul').addClass('animate__slideInUp').removeClass("animate__fadeOutDown");
});
$('span.collapse').on('click',function(){
    $('.sidebar').animate({'left':`-${sidemenu}px`},800);
    $(this).css('display','none');
    $('span.bars').css('display','inline-block');
    $('ul').addClass("animate__fadeOutDown").removeClass("animate__slideInUp");
});

function hideSideBar(){
    $('.sidebar').animate({'left':`-${sidemenu}px`},800);
    $('span.collapse').css('display','none');
    $('span.bars').css('display','inline-block');
}
//^ ===================Hiding Sidebar=============//

//!================Loading=======================//
let loaderContainer=$('.loading');
console.log(loaderContainer)

function loaderFadeOut(){
    loaderContainer.fadeOut(1000);
}
function loaderFadeIn(){
    loaderContainer.fadeIn(1000);
}

//!================Loading=======================//


//^=============Custom card================//
function generateMealCard(data){
    let elementContainer=$('.meal-details .row');
    let element="";
    
    for(let i=0;i<data.length;i++){
        element+=`
           <div class="item col-lg-3 col-md-4 col-sm-6 mb-4" onclick=getMealDetails(${data[i].idMeal})>
             <div class="inner">
                            <div class="image position-relative rounded-3">
                                <img src=${data[i].strMealThumb} class="w-100 rounded-3" alt="">
                                <div class="cover p-2 text-center position-absolute d-flex justify-content-center flex-column align-items-center">
                                    <h4 class="mb-0">${data[i].strMeal}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
        `
        elementContainer.html(element)
    }
}
//***********************Get all meals**************************//
let meals=[]
async function getMeals(){
    let response= await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
    if(response.status===200){
        let mealsData = await response.json();
        meals=mealsData.meals;
        console.log(meals);
        loaderFadeOut()
    }
    generateMealCard(meals)
}
getMeals();
//***********************Get all meals**************************//


//!=========================Get mealDetails=====================//
let ingredients=[];
let measures=[];
let tags=[];
//get ingredients and measures function
function getIngredients(){
    let item="";
    let ingredientsContainer=$('section.meals .meal-details .container .row .item .details .ingredients')
    for(let i=1;i<ingredients.length;i++){
          item+=`<span class="me-2 badge p-2 mb-2">${measures[i]} ${ingredients[i]}</span>`
     }
      return ingredientsContainer.html(`${item}`);
};
//Tags function 
function getTags(){
    let tag="";    
    let tagsContainer=$('section.meals .meal-details .container .row .item .details  h3.tags');
    for(let i=0;i<tags.length;i++){
       tag+=`<span class="me-2 mt-2 badge p-2 mb-2">${tags[i]}</span>`
  }
   return tagsContainer.html(`Tags:<br>${tag}`);
}


async function getMealDetails(id){
    console.log(id);
    hideSideBar();
    let mealReciepe;
    let response =await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    if(response.status==200){

        let mealDetails= await response.json();
        mealReciepe=mealDetails.meals[0];
    }
    
    let mainSectionContainer=$('section.meals .meal-details .container .row').html('');
    //get meal ingredients and measures
   
    for(let i=1;i<=20;i++){
        if(mealReciepe[`strIngredient${i}`]!=""){
            ingredients.push(mealReciepe[`strIngredient${i}`])
        }
        if(mealReciepe[`strMeasure${i}`]!=" "){
            measures.push(mealReciepe[`strMeasure${i}`])
        }
        if(mealReciepe.strTags!=null){
           tags= mealReciepe.strTags.split(',');
        }
    }
    console.log(ingredients,measures,tags)
    console.log(mealReciepe);

    loaderContainer.css({left:'6%'})
    loaderContainer.fadeIn(1000,function(){
        mainSectionContainer.html(`
             <div class="item col-lg-4 text-white">
                            <div class="desc">
                                <div class="image mb-2">
                                    <img src=${mealReciepe.strMealThumb} class="w-100 rounded-3" alt="">
                                </div>
                                <h3 class="text-white">${mealReciepe.strMeal}</h3>
                            </div>
                        </div>
                        <div class="item text-white col-lg-8">
                            <h2>Instructions</h2>
                            <p>${mealReciepe.strInstructions}</p>
                            <div class="info">
                               <h3 class="fw-bolder">Area: <span>${mealReciepe.strArea}</span></h3>
                               <h3 class="fw-bolder">Area: <span>${mealReciepe.strCategory}</span></h3>
                               <div class="details">
                                <h3>Recipes : </h3>
                                  <div class="ingredients">
                                  
                                  </div>
                                  <h3 class="tags"></h3>
                                  <div class="mt-2">
                                     <a href=${mealReciepe.strSource} target="_blank" class="btn bg-success">Source</a>
                                     <a href=${mealReciepe.strYoutube} target="_blank" class="btn bg-danger">Youtube</a>
    
                                  </div>
                               </div>
                            </div>
                        </div>
                         `)
                         //ingredients and measures
                         getIngredients()
                          //tags
                         getTags()
                         loaderFadeOut()
    })
}


//& Get all Categories(li)
let categories=$('ul li.categories');
let categoriesList;
categories.on('click',async function getAllCategories(){
    let categoriesContainer =$('.meal-details .row');
    // loaderFadeIn()
    hideSideBar();
    let response=await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    if(response.status===200){
        let categoriesResponse=await response.json();
        categoriesList=categoriesResponse.categories;
        console.log(categoriesList);
        // loaderFadeOut()
    }
    // $('section.meals .meal-details .container .row').html('');
    categoriesContainer.html('');
    let category=''
    for(let i=0;i<categoriesList.length;i++){
        category+=`
        <div class="item col-lg-3 col-md-4 col-sm-6 mb-4" onclick=getCategory("${categoriesList[i].strCategory}")>
             <div class="inner">
                            <div class="image position-relative rounded-3">
                                <img src=${categoriesList[i].strCategoryThumb} class="w-100 rounded-3" alt="">
                                <div class="cover p-2 text-center position-absolute d-flex justify-content-center flex-column align-items-center">
                                    <h4 class="mb-0">${categoriesList[i].strCategory}</h4>
                                    <p class="category-desc">${categoriesList[i].strCategoryDescription.substring(0,120)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
        `
    };
    loaderContainer.css({left:'6%'})
    loaderContainer.fadeIn(1000,function(){
        categoriesContainer.html(category)
        loaderFadeOut()
    });
});

//! Filter by Category
async function getCategory(category){
    hideSideBar()
    console.log(category)
    let response=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    let categoryData;
    if(response.status===200){
        let categoryInfo= await response.json();
        categoryData=categoryInfo.meals.slice(0,20);
        console.log(categoryInfo, categoryData);
    }
    loaderContainer.fadeIn(1000,function(){
        loaderContainer.css({left:'6%'})
        generateMealCard(categoryData)
    });
    loaderFadeOut()
}



//!Search
let searchName=$('ul li.search');

searchName.on('click',function(){
    hideSideBar();
    $('section.meals .meal-details .container .row').html('');
    let searchInputContainer =$('.meal-details .search-inputs');
    let inputs=`
            <div class="col-md-6 name">
                <label for="name" class="form-label"></label>
                <input type="text" class="form-control bg-transparent" id="name" placeholder="Search By Name " autoComplete="off">
            </div>
            <div class="col-md-6 letter">
                <label for="letter" class="form-label"></label>
                <input type="text" class="form-control bg-transparent " maxLength=1 id="letter" placeholder="Search By letter" autoComplete="off">
            </div>
        
        `
        searchInputContainer.html(inputs);

        //^Search By Name
        let searchByName=$('div.name input');
        searchByName.on('keyup',async function searchMealByName(e) {
            console.log(e.target.value);
            let response= await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${e.target.value}`);
            let mealData;
        if(response.status===200){
            let data=await response.json();
            mealData=data.meals!=null?data.meals:[];
            console.log(mealData);
        }
        loaderContainer.css({left:'6%',top:'10%'})
        loaderContainer.fadeIn(1000,function(){
            generateMealCard(mealData);
            loaderFadeOut()
        });
    });

    //^Search By letter
    let searchByLetter=$('div.letter input');
    searchByLetter.on('keyup',async function searchMealByLetter(e) {
        let letter=e.target.value
        if(e.target.value===""){
            $('section.meals .meal-details .container .row').html('<p class="text-white text-center display-6 fw-bolder">No Data Found</p>');
         }else{
            let response=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${e.target.value}`);
            let mealData;
            if(response.status===200){
                    let data=await response.json();
                    mealData=data.meals!=null?data.meals:[];
                    console.log(mealData)
                }
                loaderContainer.css({left:'6%',top:'10%'})
                loaderContainer.fadeIn(1000,function(){
                    generateMealCard(mealData);
                    loaderFadeOut()
                }); 
        }
        
        
    })
    });

    //!Get all Area
    let areaElement=$('ul li.area');
    areaElement.on('click',async function getAllAreas(){
        let response=await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
        let areaData;
        if(response.status===200){
            let data=await response.json();
            areaData=data.meals;
            console.log(data,areaData)
        }
        $('section.meals .meal-details .container .row').html('');
        hideSideBar();
        let elementContainer=$('.meal-details .row');
        let element="";
        for(let i=0;i<areaData.length;i++){
            element+=`
            <div class="item col-lg-3 col-md-4 col-sm-6 mb-4 text-center text-white" onclick=getMealsByArea("${areaData[i].strArea}")>
                <div class="inner">
                     <p><span class="icon display-3"><i class="fa-solid fa-house-laptop"></i></span></p>
                     <h3>${areaData[i].strArea}</h3>
                </div>
            </div>
            `
            loaderContainer.css({left:'6%'})
            loaderContainer.fadeIn(1000,function(){
            elementContainer.html(element)
            loaderFadeOut()
        });
        }

     });

     //!Get specific area

     async function getMealsByArea(area){
        console.log(area)
        let response=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        let mealsArea;
        if(response.status===200){
            let data=await response.json();
            mealsArea=data.meals
            console.log(mealsArea)
        }
        loaderContainer.css({left:'6%'})
        loaderContainer.fadeIn(1000,function(){
            generateMealCard(mealsArea)
            loaderFadeOut()
        });
     };

     //^Get all ingredients

     let ingredientsElement=$('ul li.ingredients');
     ingredientsElement.on('click',async function getAllIngredients(){
         let response=await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
         let ingredientsData;
         if(response.status===200){
             let data=await response.json();
             ingredientsData=data.meals.slice(0,20);
             console.log(data,ingredientsData)
         }
         $('section.meals .meal-details .container .row').html('');
         hideSideBar();
         let elementContainer=$('.meal-details .row');
         let element="";
         for(let i=0;i<ingredientsData.length;i++){
             element+=`
             <div class="item col-lg-3 col-md-4 col-sm-6 mb-4 text-center text-white" onclick=getMealByIngredients("${ingredientsData[i].strIngredient}")>
                 <div class="inner">
                      <p class="mb-0"><span class="icon display-3"><i class="fa-solid fa-drumstick-bite"></i></span></p>
                      <h3>${ingredientsData[i].strIngredient}</h3>
                      <p>${ingredientsData[i].strDescription.substring(0,130)}</p>
                 </div>
             </div>
             `
            loaderContainer.css({left:'6%'})
            loaderContainer.fadeIn(1000,function(){
              elementContainer.html(element)
              loaderFadeOut()
            }
    
    );
         }
 
      });

      async function getMealByIngredients(ingredient){
        console.log(ingredient)
        let response=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        let ingredients;
        if(response.status===200){
            let data=await response.json();
            ingredients=data.meals
            console.log(data)
        }
        loaderContainer.css({left:'6%'})
        loaderContainer.fadeIn(1000,function(){
            generateMealCard(ingredients)
        });
        loaderFadeOut()
     };

     //*Contact Us

     let contactButton=$('ul li.contact');
     let contactContainer=$('section.meals .meal-details .container .row');
     let nameRegex=/^[a-zA-Z_ ]*$/;
     let emailRegex=/(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
     let phoneRegex=/^(\+\d{1,3}[- ]?)?\d{11}$/;
     let ageRegex=/^(1[2-9]|[2-9]\d)$/;
     let passwordRegex=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

     

     contactButton.on('click',function(){
        hideSideBar();
        contactContainer.html(`
            <form class="">
              <div class="row m-auto">
                <div class="col-md-6">
                    <label for="name" class="form-label"></label>
                    <input type="text" class="form-control name text-dark" id="name" value="" placeholder="Enter your name">

                    <div class="error name-validation rounded-3 mt-2 p-3 text-center">
                      <p class="mb-0">Special characters and numbers not allowed</p>
                    </div>

                </div>
                <div class="col-md-6">
                    <label for="email" class="form-label"></label>
                    <input type="email" class="form-control email text-dark" id="email" placeholder="Enter your Email">

                    <div class="error email-validation rounded-3 mt-2 p-3 text-center">
                      <p class="mb-0">Email not valid *exemple@yyy.zzz</p>
                    </div>

                </div>
                <div class="col-md-6">
                    <label for="phone" class="form-label"></label>
                    <input type="tel" class="form-control phone text-dark" id="phone" placeholder="Enter your phone">

                    <div class="error phone-validation rounded-3 mt-2 p-3 text-center">
                      <p class="mb-0">Enter valid Phone Number</p>
                    </div>

                </div>
                <div class="col-md-6">
                    <label for="age" class="form-label"></label>
                    <input type="number" class="form-control age text-dark" id="age" placeholder="Enter your Age">

                    <div class="error age-validation rounded-3 mt-2 p-3 text-center">
                      <p class="mb-0">Enter valid age "Should be from 12 to 99"</p>
                    </div>

                </div>
                <div class="col-md-6">
                    <label for="password" class="form-label"></label>
                    <input type="password" class="form-control password text-dark" id="password" placeholder="Enter your Password">

                     <div class="error password-validation rounded-3 mt-2 p-3 text-center">
                      <p class="mb-0">Enter valid password *Minimum eight characters, at least one letter and one number:*</p>
                    </div>

                </div>
                <div class="col-md-6 mb-3">
                    <label for="re-password" class="form-label"></label>
                    <input type="password" class="form-control re-password text-dark" id="re-password" placeholder="Re-password">

                    <div class="error re-password-validation rounded-3 mt-2 p-3 text-center">
                      <p class="mb-0">Enter valid repassword</p>
                    </div>

                </div>
                </div>
                <button class="btn text-danger d-flex m-auto btn-outline-danger mt-3" type="button">Submit</button>
            </form>
        `);
        $('button[type="button"]').attr('disabled',true);
        $('.error').addClass('d-none');
        //*Name field
        $('input.name').on('keyup',function(e){
            checkInput(nameRegex,e);
        });
        //*Email field
        $('input.email').on('keyup',function(e){
            checkInput(emailRegex,e);
        });
        //*Phone Field
        $('input.phone').on('keyup',function(e){
            checkInput(phoneRegex,e);
        });
        //*age Field
        $('input.age').on('keyup',function(e){
            checkInput(ageRegex,e)
        });
        //*password Field
        $('input.password').on('keyup',function(e){
            checkInput(passwordRegex,e)
        });
        //*Re-password Field
        $('input.re-password').on('keyup',function(e){
            checkInput(passwordRegex,e);
            if(e.target.value!==$('input.password').val()){
                $(e.target).next('.error').removeClass('d-none')
                $(e.target).next('.error').addClass('d-block');
            }
            console.log($('input.password').val());
        });
        //!check fields of all inputs and display error
        function checkInput(regex,element){
            if(validate(regex,element.target.value)){
                $(element.target).next('.error').removeClass('d-block')
                $(element.target).next('.error').addClass('d-none');
                enableSubmitBtn()
                return true
            }else{
                $(element.target).next('.error').removeClass('d-none')
                $(element.target).next('.error').addClass('d-block');
                enableSubmitBtn()

                return false
            }
        }
        //^enable SubmitBtn 
        function enableSubmitBtn(){
            if(validate(nameRegex,$('input.name').val()) &&
               validate(emailRegex,$('input.email').val()) &&
               validate(passwordRegex,$('input.password').val())&&
               validate(ageRegex,$('input.age').val())&&
               validate(phoneRegex,$('input.phone').val())&&
               validate(passwordRegex,$('input.re-password').val())){
                $('button[type="button"]').attr('disabled',false)
            }else{
                $('button[type="button"]').attr('disabled',true)

            }
        }
        
        function validate(regex,element){
            if(regex.test(element)){
                console.log(regex,element);
                console.log('match')
                return true;
            }else{
                console.log('not match')
                return false;
            }
        };
    });
    
