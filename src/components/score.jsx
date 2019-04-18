import React, { Component } from 'react';

class Score extends Component {
    state = { 
        score : this.props.score
     }
    render() { 
        return (
        <React.Fragment>
            <h1> <span className="badge badge-primary score">Score: {this.state.score}</span></h1>
            <h1><span className="badge badge-primary score"> High Score: {this.state.score}</span></h1>
        </React.Fragment>
         );
    }
}
 
export default Score;