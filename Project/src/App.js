import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Typography } from '@mui/material';
import { Button } from '@mui/material';
import ImageComponent from './ImageComponent';
import ProblemComponent from './ProblemComponent';
import './ImageComponent.css';
import image1 from './imageWelcome1.jpg'
import image2 from './imageWelcome2.jpg'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {showImages: false, imageNumber: 0, showProblems: false, problemNumber: 0, totalImages: 7, totalProblems: 4};

    // the states of other components are stored in the parent component in order for the system to be able to remember the user's
    // interactions with pages
    this.imageStates = {0 : {chosen: [], picked: [], answered: false, coloured: false, alreadyColoured: [], correct: ""},
                        1 : {chosen: [], picked: [], answered: false, coloured: false, alreadyColoured: [], correct: ""},
                        2 : {chosen: [], picked: [], answered: false, coloured: false, alreadyColoured: [], correct: ""},
                        3 : {chosen: [], picked: [], answered: false, coloured: false, alreadyColoured: [], correct: ""},
                        4 : {chosen: [], picked: [], answered: false, coloured: false, alreadyColoured: [], correct: ""},
                        5 : {chosen: [], picked: [], answered: false, coloured: false, alreadyColoured: [], correct: ""},
                        6 : {chosen: [], picked: [], answered: false, coloured: false, alreadyColoured: [], correct: ""},}
    this.problemStates = {0 : {type: "", textures: false, colour: "", logarithmic: false, order: "", graphGenerated: false, smallImage:false, percentage: false, legend: false, horizontal: false, logInfo: false},
                          1 : {type: "", textures: false, colour: "", logarithmic: false, order: "", graphGenerated: false, smallImage:false, percentage: false, legend: false, horizontal: false, logInfo: false},
                          2 : {type: "", textures: false, colour: "", logarithmic: false, order: "", graphGenerated: false, smallImage:false, percentage: false, legend: false, horizontal: false, logInfo: false},
                          3:  {type: "", textures: false, colour: "", logarithmic: false, order: "", graphGenerated: false, smallImage:false, percentage: false, legend: false, horizontal: false, logInfo: false}}
  }


  // a couple of functions to update the state of the various children components
  updateImageState(number, state, value){
    this.imageStates[number][state] = value;
  }

  updateProblemState(number, newState){
    this.problemStates[number] = newState;
  }


  // functions to display the contents of the image/problem components on the page
  onClickShowImages(){
    this.setState({showImages: true});
  }

  onClickShowProblems(){
    this.setState({showProblems: true});
  }

  // cycle through images/problems - both use either ImageComponent or ProblemComponent, but are associated with
  // different data and states
  changeImage(direction){
    if (direction === "ahead"){
      this.setState({imageNumber: this.state.imageNumber + 1})
    }
    else {
      this.setState({imageNumber: this.state.imageNumber - 1})
    }
  }

  changeProblem(direction){
    if (direction === "ahead"){
      this.setState({problemNumber: this.state.problemNumber + 1})
    }
    else {
      this.setState({problemNumber: this.state.problemNumber - 1})
    }
  }


  // return back to the images from the problems display
  backToImage(){
    this.setState({showProblems: false, imageNumber: 0});
    this.setState({problemNumber: 0})
  }

  // the render function will show the welcome message if neither images nor problems are supposed to be displayed
  render(){
    return (
      <>
        <div className="App">
          {this.state.showProblems === false ? (
            <>
            {this.state.showImages === false ? (
              <div className="App-header">
              <div class="row">
                <div class="column">
                  <img src={image1} alt="Original" className="image-welcome-one" />
                </div>
                <div class="column">
                <Typography variant="h1" component="h1">
                  Welcome!
                </Typography>
                </div>
                <div class="column">
                  <img src={image2} alt="Original" className="image-welcome-two" />
                </div>
              </div>
              <div className="wrapper-welcome">
                <div className="text-welcome">
                  <p>With this online tool, you can:</p>
                  <p>- Inform yourself about different bad graph practices that may be used to mislead you (with examples related to the COVID-19 pandemic)</p>
                  <p>- Practice making your own data visualizations on different datasets</p>
                </div>
              </div>
              <br/> <br/>
              <Button variant="contained" onClick = {this.onClickShowImages.bind(this)} sx={{width: "15%"}}>Get started!</Button>
              </div>
            ) : (
              <ImageComponent key={this.state.imageNumber} imageNumber={this.state.imageNumber} showProblems={this.onClickShowProblems.bind(this)}
                              totalImages = {this.state.totalImages} changeImage={this.changeImage.bind(this)} state={this.imageStates[this.state.imageNumber]}
                              updateState={this.updateImageState.bind(this)}/>
            )}
            </>
          ) : (
            <ProblemComponent key={this.state.problemNumber} problemNumber={this.state.problemNumber} returnToImage={this.backToImage.bind(this)} changeProblem = {this.changeProblem.bind(this)} totalProblems = {this.state.totalProblems}
                              state={this.problemStates[this.state.problemNumber]} updateState={this.updateProblemState.bind(this)}/>
          )}
          </div>
      </>
    );
  }
}

export default App;