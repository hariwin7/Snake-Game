import React, { Component } from 'react';

import './App.css';

class App extends Component {

  constructor(){
    super();
    const square = []; // For making the canvas in which snake runs
    for(let boxrow = 0;boxrow < 20;boxrow++){
      const boxcols=[];
      for(let boxcol = 0;boxcol < 20;boxcol++){
        boxcols.push({
          boxrow,
          boxcol
        });
      }
      square.push(boxcols);
    }
    this.state= {
      square,
      // Creating The Food For Snake At Random Positions
      food : {
        boxrow : Math.floor(Math.random() * 20),
        boxcol: Math.floor(Math.random() * 20),
      },
      snake: {
        snakeHead: {
          boxrow: 9,
          boxcol: 9
        },
        snakeSpeed: {
          x: 1,
          y: 0
        },
        body: []
        
      },
      score:0, // Score Of The Game 
      snakeDirection:"ArrowRight", // Storing The Keyboard Keys In A Variable
      gameInterval:0,
      gameStatus:1, // A Toggle Switch For Staring And Restarting The Game
      gameOver:0
    }
  }
// Function To Check The Head Of Snake In The Canvas.
  ifSnakeHead = (box) => {
    const { snake } = this.state;
    return snake.snakeHead.boxrow === box.boxrow &&
    snake.snakeHead.boxcol === box.boxcol ;
  }
// Function To Check Food In The Canvas.
  ifFood = (box) => {
    const { food } = this.state;
    return food.boxrow === box.boxrow && 
    food.boxcol === box.boxcol ;
  }
// Function To Check The Body Of Snake In The Canvas.
  ifSnakeBody = (box) => {
    const { snake } = this.state;
    return snake.body.find(sBody => sBody.boxrow === box.boxrow && sBody.boxcol === box.boxcol);
  }
  // Function That Updates Score And Speed Also Checks Boundary And SelfCollision
  startSnakeGame = () =>{
    const eatFood = this.eatFood();
    if (eatFood) this.incrementScore();
    this.setState(({ snake , food}) =>{
      const updateState = {
      snake: {
        ...snake,
        snakeHead: {
          boxrow: snake.snakeHead.boxrow + snake.snakeSpeed.y,
          boxcol: snake.snakeHead.boxcol + snake.snakeSpeed.x
        },
        body : [snake.snakeHead , ...snake.body],
      },
      food : this.eatFood() ? this.randomFood() : food 
     };
     if(!eatFood){
      updateState.snake.body.pop();
     } 
     return updateState;
  },() =>{
      const { snake } = this.state;
      if (this.checkBoundary() || this.ifSnakeBody(snake.snakeHead)){
        this.gameOver(1);
        this.stopGame();
      }
        return;
  }  )
    
  }
// Function To Incremnent Score When Snake Eats Food
  incrementScore = () => {
    if(this.eatFood()){
      this.setState({ score : this.state.score + 5});
    }
  }
// Function To Make The Game Over In Case Of Outofbounds Or Self Collision
  gameOver = (status) =>{
      this.setState(({ food , snake, score , snakeDirection, gameInterval}) =>{
        const updateState = {
      food : {
        boxrow : Math.floor(Math.random() * 20),
        boxcol: Math.floor(Math.random() * 20),
      },
      snake: {
        snakeHead: {
          boxrow: 9,
          boxcol: 9
        },
        snakeSpeed: {
          x: 1,
          y: 0
        },
        body: []
        
      },
      score:0,
      snakeDirection:"ArrowRight",
      gameInterval:0,
      gameOver:status
    }
     return updateState;
        
      });
  }
// Function To Check If Snake Goes Out Of Canvas
  checkBoundary = () =>{
    const { snake } = this.state;
    return  (snake.snakeHead.boxrow > 19 || snake.snakeHead.boxrow <0 
      || snake.snakeHead.boxcol > 19 || snake.snakeHead.boxcol < 0);

  }
  // Function To Randomise The Position Of Food
   randomFood(){
    const { snake } = this.state;
    const randFood = {
      boxrow : Math.floor(Math.random() * 20),
      boxcol: Math.floor(Math.random() * 20),
    }
    if (this.ifSnakeBody(randFood) || (snake.snakeHead.boxrow === 
      randFood.boxrow && snake.snakeHead.boxcol === randFood.boxcol)){
        return this.randomFood();
      }
      else
      return randFood;
    }
 // Function That Changes The Direction Of The Snake On Keyborad Interrupt
  runSnake = () => {
    
      const { snake, snakeDirection } = this.state;
      switch(snakeDirection){
        case "ArrowUp" :
        console.log("up")
        if (snake.snakeSpeed.y !== 1) {
          this.setState( {
            snake:{
              ...snake,
              snakeSpeed:{
                x:0,
                y:-1
              }
            }
          });}
        break;
        case "ArrowDown" :
        if (snake.snakeSpeed.y !== -1) {
          this.setState({
            snake:{
              ...snake,
              snakeSpeed:{
                x:0,
                y:1
              }
            }
          });}
        break;
        case "ArrowRight" :
        console.log("right")
        if (snake.snakeSpeed.x !== -1) {
          this.setState( {
            snake:{
              ...snake,
              snakeSpeed:{
                x:1,
                y: 0
              }
            }
          });}
        break;
        case "ArrowLeft" :
        if (snake.snakeSpeed.x !==1){
          this.setState({
            snake:{
              ...snake,
              snakeSpeed:{
                x:-1,
                y:0
              }
            }
          });}
        break;
        default: console.log("default")
        
      }
      this.startSnakeGame();
  }
//Functio To Pause The Game
  stopGame = () => {
    if(this.state.gameStatus===0){
    this.setState({gameStatus:1})
    clearInterval(this.state.gameInterval);
    }
  }
  // Function That Starts The Game 
  start = () =>{
    if(this.state.gameStatus===1){
    this.setState({gameStatus:0 , gameOver :0})
    this.setState({ gameInterval : setInterval(this.runSnake, 250) }); 
    }
  }
  // Function  To Restart The Game 
  restart = () =>{
    this.gameOver();
    this.stopGame(0);
  }
// Function That Checks If The Snake Eats The Food
  eatFood = () =>{
    const { snake, food } = this.state;
    return food.boxrow === snake.snakeHead.boxrow &&
    food.boxcol === snake.snakeHead.boxcol;

  }

  componentDidMount = () => {
    document.addEventListener('keydown', (directionKey) => {
      this.setState({snakeDirection : directionKey.code })
      console.log(this.state.snakeDirection);
    });
    this.start();
       
  }
  // Function That Helps To Update The Messages Displayed For UserInteractivity And Understanding
  gameStatus = () =>{
    let message="";
    if (this.state.gameOver){
      message += "Game Over! ";
    }
    if (this.state.gameStatus){
      message += "Press Start Game";
    }
    return message;
  }
  

  render() {
    document.body.style = 'background: #58B792;';
    const {square , score} = this.state;
    return (
      <React.Fragment>
       
        <div className="App">
          <div className="container"> 
            <div className="row justify-content-center">
                <h1> <span className="badge badge-success score">Score: {score}</span></h1>
            </div>
              <div className="row justify-content-center">
                <div className="btn-group marg-btm" role="group">
                  <button className="btn btn-dark" onClick={this.restart}>Restart Game</button>
                  <button className="btn btn-dark" onClick={this.stopGame}>Pause Game</button>
                  <button className="btn btn-dark" onClick={this.start}>Start Game</button>
                </div>
              </div>
            <div className="row justify-content-center">
              <div className="square">
                {
                  square.map((boxrow, i) =>(
                      boxrow.map((box) =>(

                        <div key={`${box.boxrow} ${box.boxcol}`} className={`box 
                        ${
                          this.ifSnakeHead(box)
                          ? 'snake' : this.ifFood(box)
                          ? 'food' : this.ifSnakeBody(box)
                          ? 'snakebody' : ''
                          }`}>
                        </div>
                      ))
                  ))

                
                }
                </div> 
                </div>
                <div className="row  justify-content-center">                
                  <h1>{this.gameStatus()}</h1>                
                </div>
                       
          </div>
        </div>

      </React.Fragment>
    );
        }
}

export default App;
