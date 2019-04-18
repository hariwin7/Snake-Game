import React, { Component } from 'react';

import './App.css';
import Score from './components/score';

class App extends Component {

  constructor(){
    super();
    const square = [];
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
      gameInterval:0
    }
  }

  ifSnakeHead = (box) => {
    const { snake } = this.state;
    return snake.snakeHead.boxrow === box.boxrow &&
    snake.snakeHead.boxcol === box.boxcol ;
  }

  ifFood = (box) => {
    const { food } = this.state;
    return food.boxrow === box.boxrow && 
    food.boxcol === box.boxcol ;
  }

  ifSnakeBody = (box) => {
    const { snake } = this.state;
    return snake.body.find(sBody => sBody.boxrow === box.boxrow && sBody.boxcol === box.boxcol);
  }
  
  startSnakeGame = () =>{
    const {snake} = this.state;
    //let gameInterval = setInterval(() => {this.runSnake()}, 200);
    const eatFood = this.eatFood();
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
     if(!eatFood) updateState.snake.body.pop();
     return updateState;
  }    )
    
  }
   randomFood(){
    const { snake, food} = this.state;
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

  stopGame = () => {
    console.log(this.state.gameInterval);
    clearInterval(this.state.gameInterval);
  }
  start = () =>{
    this.setState({ gameInterval : setInterval(this.runSnake, 300) }); 
  }

  eatFood = () =>{
    const { snake, food, score} = this.state;
    return food.boxrow === snake.snakeHead.boxrow &&
    food.boxcol === snake.snakeHead.boxcol;

  }

  componentDidMount = () => {
    document.addEventListener('keydown', (directionKey) => {
      this.setState({snakeDirection : directionKey.code })
      console.log(this.state.snakeDirection);
    });
    this.start();
    
     //this.startSnakeGame();
       
  }


  render() {
    const {square , score} = this.state;
    return (
      <React.Fragment>
      <div className="App">
      {/* <Score score={score}></Score> */}
      <button className="btn btn-primary" onClick={this.stopGame}>Stop Game</button>
      <button className="btn btn-primary" onClick={this.start}>start Game</button>
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
      </React.Fragment>
    );
        }
}

export default App;
