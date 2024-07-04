//vh-viewport height , flex- we can add anything to the body and easily align at centre due to centre align property used
//constants and variables
let inputDir={x: 0,y: 0};
let speed=5;
let score=0;
// variable that tells when the screen was painted last .ctime-current time
let lastPaintTime=0;
let snakeArr=[
    {x: 13,y: 15}
] 
food ={x: 6,y: 7};
//functions
// we use game loop to paint the screen repeatedly
function main(ctime){
    window.requestAnimationFrame(main);// main is called again and again
    // console.log(ctime);
    if((ctime-lastPaintTime)/1000<1/speed) { // controls fps
    return ;
}
lastPaintTime=ctime;
gameEngine();
}

function isCollide(snake){
    // if snake bumps into itself
    for(let i=1;i<snakeArr.length;i++)
    {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
               return true;
        }
    }
    // if snake bumps into the wall
        if(snake[0].x>=18 ||snake[0].x<=0 ||snake[0].y>=18 ||snake[0].y<=0){
                return true;
        }
       return false;
    }


function gameEngine(){
    // Part 1: Updating the snake array
    if(isCollide(snakeArr)){
        inputDir={x:0, y:0};
        alert("Game over. Press any key to play again !");
        snakeArr=[{x:13, y:15}];
        score=0;

    }
    // if you have eaten the food, increment the score and regenerate the food
    if(snakeArr[0].y===food.y &&snakeArr[0].x==food.x){
        // increment the snake body by unshift()
        score +=1;
        if(score>hiscoreval){
            hiscoreval=score;
            localStorage.setItem("hiscore",JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML="Hi score : " +hiscoreval;

        }
        scoreBox.innerHTML="Score: " +score; // 2 scores are there so we change the score to scoreBox
        snakeArr.unshift({x: snakeArr[0].x +inputDir.x, y: snakeArr[0].y +inputDir.y});// increments the snake array
        // Regeneration of the food
        let a=2;
        let b=16;
        food={x: Math.round(a+(b-a)*Math.random()),y:Math.round(a+(b-a)*Math.random()) }// regenerates the food

    }

    // Moving the snake
    for(let i=snakeArr.length-2;i>=0;i--){
        snakeArr[i+1]={...snakeArr[i]};// we have created a new object and to solve refernce problem// we can't do it directly 
        // by assigning this way so we destructure it and solve the problem by creating an object
        // that points the object that is array[i] and to solve the referencing problem
    }
    // as the line i+1 =i takes the snake upto 0, but where can we place the zeroth element ?
    snakeArr[0].x +=inputDir.x;
    snakeArr[0].y +=inputDir.y;

    // Part 2: Display the snake 
    board.innerHTML=" ";
    snakeArr.forEach((e,index)=>{
       snakeElement=document.createElement('div');
       snakeElement.style.gridRowStart=e.y;
       snakeElement.style.gridColumnStart=e.x;
       if (index===0){
        snakeElement.classList.add('head');
       }
       else{
       snakeElement.classList.add('snake'); // we have to add class to the element we create
       }
       board.appendChild(snakeElement);
});    
    // Part 2: Display the food
       foodElement=document.createElement('div');
       foodElement.style.gridRowStart=food.y;
       foodElement.style.gridColumnStart=food.x;
       foodElement.classList.add('food');
       board.appendChild(foodElement);
}


//Main logic starts here
let hiscore=localStorage.getItem("hiscore");
if(hiscore===null){
    hiscoreval=0;
    localStorage.setItem("hiscore",JSON.stringify(hiscoreval)); // set as string only
}
else
{
    hiscoreval=JSON.parse(hiscore);
    hiscoreBox.innerHTML="Hi score : " +hiscore;
}
window.requestAnimationFrame(main);// tells js engine what to achieve better
window.addEventListener('keydown',e=>{
      inputDir={x:0 , y:1}  //start the game
      switch(e.key){
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x=0;
            inputDir.y=-1;
            break;
        
        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x=0;
            inputDir.y=1;
            break;
        
        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x=-1;
            inputDir.y=0;
            break;
        
        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x=1;
            inputDir.y=0;
            break;

        default:
            break;
            
      }
});


