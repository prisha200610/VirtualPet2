var dog,sadDog,happyDog,database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;


function preload(){
sadDog=loadImage("images/Dog.png");
happyDog=loadImage("images/happydog.png");

}

function setup() {
  database=firebase.database();
  createCanvas(1000,500);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

   
  dog=createSprite(550,250,10,10);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("FEED MAX");
  feed.position(800,60);
  feed.mousePressed(feedDog);

  addFood=createButton("ADD FOOD");
  addFood.position(700,60);
  addFood.mousePressed(addFoods);
}

function draw() {

	background(46,139,87);
	foodObj.display();

	fedTime=database.ref('FeedTime');
	fedTime.on("value",function(data){
	  lastFed=data.val();	
	})
  
  
	fill(255,255,254);
	textSize(15);
	if(lastFed>=12){
		text("Last Feed : "+ lastFed%12 + " PM", 50,30);
	}else if(lastFed == 0){
		text("Last Feed : 12 AM",50,30);
	}else{
		text("Last Feed : "+ lastFed + " AM", 50,30);
	}

  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);
  var food_stock_val = foodObj.getFoodStock();
  if (food_stock_val <=0){
	foodObj.updateFoodStock(food_stock_val * 0);
  }else{
	foodObj.updateFoodStock(food_stock_val -1);
  }
  
database.ref('/').update({
	Food:foodObj.getFoodStock(),
	FeedTime:hour()
}

)}

//function to add food in stock
function addFoods(){
  
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}