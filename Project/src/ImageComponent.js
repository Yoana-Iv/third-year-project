import React, { useState, useEffect } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Typography } from '@mui/material';
import { Button, FormControl, FormLabel, FormGroup, FormControlLabel, FormHelperText, Checkbox, Box } from '@mui/material';
import covidGraph1 from './CovidGraph1.PNG';
import covidGraph1Reworked from './ReworkedCovidGraph1.png';
import covidGraph2 from './CovidGraph3.PNG';
import covidGraph2Reworked from './ReworkedCovidGraph3.png';
import covidGraph3 from './CovidGraph4.PNG';
import covidGraph3Reworked from './ReworkedCovidGraph4.png';
import covidGraph4 from './CovidGraph7.PNG';
import covidGraph4Reworked from './ReworkedCovidGraph7.png';
import covidGraph5 from './RussianCovidGraph.PNG';
import covidGraph5Reworked from './ReworkedRussianCovidGraph.jpg';
import covidGraph6 from './CovidGraph5.PNG';
import covidGraph6Reworked1 from './ReworkedCovidGraph5.png';
import covidGraph6Reworked2 from './ReworkedCovidGraph5_2.png';
import covidGraph7 from './CovidGraph6.PNG';
import covidGraph7Reworked from './ReworkedCovidGraph6.jpg';
import './ImageComponent.css';
import imagesInfo from './data/imagesInfo.json';
import { getByLabelText } from '@testing-library/react';

// All of the graphs (an original graph and its reworked version are considered as one graph for the purposes of the application)
// make use of the same image component. The data for all of them is retrieved from a json file and which data (text, graphs,etc.) is
// displayed depends on the image number passed down and controlled by the parent component.
const image_list = [[covidGraph1, covidGraph1Reworked], [covidGraph2, covidGraph2Reworked], [covidGraph3, covidGraph3Reworked], [covidGraph4, covidGraph4Reworked], [covidGraph5, covidGraph5Reworked], [covidGraph6, covidGraph6Reworked1, covidGraph6Reworked2], [covidGraph7, covidGraph7Reworked]];
const title_list = imagesInfo["titles"];
const intro_list = imagesInfo["intros"];
const desc_list = imagesInfo["descs"];
const options_list = imagesInfo["options"];
const options_names = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const correct_list = imagesInfo["correct"];


function ImageComponent(props){
    // the state for the component is passed down from its parent
    const [chosen, choose] = useState(props.state["chosen"]);
    const [picked, pick] = useState(props.state["picked"]);
    const [answered, answer] = useState(props.state["answered"]);
    const [coloured, colour] = useState(props.state["coloured"]);
    const [alreadyColoured, updateColoured] = useState(props.state["alreadyColoured"]);
    const [correct, setCorrect] = useState(props.state["correct"]);

    // this function is used to scroll to the top of the page upon changing the images
    useEffect(() => {
      window.scrollTo(0, 0)
    }, [])

    // functions to update the state stored in the parent component
    useEffect(() => {
      props.updateState(props.imageNumber, "answered", answered)
    },[answered]) 

    useEffect(() => {
      props.updateState(props.imageNumber, "coloured", coloured)
    },[coloured]) 

    useEffect(() => {
      props.updateState(props.imageNumber, "alreadyColoured", alreadyColoured)
    },[alreadyColoured]) 

    // updates the quiz answers that have been chosen by the user
    const handleChange = (event) => {
      colour(false);
      if (event.target.checked === true){
          pick([...picked, event.target.name]);
      }
      else {
         var p = picked.filter(item => item !== event.target.name);
         pick(p);
      }
    };
    
    // Evaluates the given answers and determines how correct the user is - they either got every answer right,
    // got none right or got some right (this case includes choosing all the correct answers plus one or more wrong
    // answers). The right answers for each question are stored in the same json file as the possible answers.
    const handleSubmit = () => {
      answer(true);
      colour(true);
      var correct_picked = false;
      var incorrect_picked = false;
      var correct_answers = 0;
      picked.map( p => {
        if (correct_list[props.imageNumber].includes(p)){
          correct_picked = true;
          correct_answers = correct_answers + 1;
        }
        else {
          incorrect_picked = true;
        }
      })
      if (correct_picked && incorrect_picked || correct_picked && (correct_answers !== correct_list[props.imageNumber].length)) {
        setCorrect("partially")
      }
      else if (correct_picked && (correct_answers === correct_list[props.imageNumber].length)){
        setCorrect("correct")
      }
      else {
        setCorrect("incorrect")
      }
    }

    // answers that have been submitted by the user are coloured in either red or green with extra text added (for more information and colour-blind users)
    // to indicate if they are correct or not
    const getLabel = (name, text) => {
      let correct_text = text + " (right)"
      let incorrect_text = text + " (wrong)"
      if (alreadyColoured.includes(name)){
        if (correct_list[props.imageNumber].includes(name)){
          return <Typography variant="body1" sx={{color: "green", fontSize: 'calc(1px + 1.7vmin)', textAlign:'justify'}}>{correct_text}</Typography>
        }
        else {
          return <Typography variant="body1" sx={{color: "red", fontSize: 'calc(1px + 1.7vmin)', textAlign:'justify'}}>{incorrect_text}</Typography>
        }
      }
      if (coloured){
        if (picked.includes(name)){
          if (correct_list[props.imageNumber].includes(name)){
            updateColoured([...alreadyColoured, name]);
            return <Typography variant="body1" sx={{color: "green", fontSize: 'calc(1px + 1.7vmin)', textAlign:'justify'}}>{correct_text}</Typography>
          }
          else {
            updateColoured([...alreadyColoured, name]);
            return <Typography variant="body1" sx={{color: "red", fontSize: 'calc(1px + 1.7vmin)', textAlign:'justify'}}>{incorrect_text}</Typography>
          }
        }
      }
      return <Typography variant="body1" sx={{color: "black", fontSize: 'calc(1px + 1.7vmin)', textAlign:'justify'}}>{text}</Typography>
    }

    // This component renders the pairs of graphs - original and reworked, along with some introductory text and a question for the user -
    // what is the issue with the original diagram? Depending on how they answer, the application returns some feedback as well as a more
    // in-depth description of the problems with the graph.
    return (
        <div className="wrapper">
        <br/> <br />

            <Typography variant="h2" component="h2">
                {title_list[props.imageNumber]}
            </Typography>

        <br/> <br />
            <p class="text-intro">{intro_list[props.imageNumber]}</p>
        <br/> <br />

            {image_list[props.imageNumber].length > 2 ? (
              <>
              <div class="row">
                <div class="column">
                    <img src={image_list[props.imageNumber][0]} alt="Original" className="image" />
                    <p class="image-info">Original graph</p>
                </div>
              </div>
              <div class="row">
                <div class="column">
                    <br />
                    <img src={image_list[props.imageNumber][1]} alt="Reworked" className="image" />
                    <p class="image-info">First reworked graph</p>
                </div>
                <div class="column">
                  <br />
                  <img src={image_list[props.imageNumber][2]} alt="Reworked2" className="image" />
                  <p class="image-info">Second reworked graph</p>
                </div>
              </div>
              </>
            ) : (
              <div class="row">
                <div class="column">
                    <img src={image_list[props.imageNumber][0]} alt="Original" className="image" />
                    <p class="image-info">Original graph</p>
                </div>
                <div class="column">
                    <br />
                    <img src={image_list[props.imageNumber][1]} alt="Reworked" className="image" />
                    <p class="image-info">Reworked graph</p>
                </div>
            </div>
            )}
        
        <br/> <br/>
        <p class="text-question">What do you think - what can be an issue with the way the original graph is presented? (There might be more than one right answer.)</p>
        <br/> <br/>
        <FormControl sx={{width: "65%", m: 3, fontWeight: 'bold'}}>
        <FormGroup sx={{border: 'solid #1BA5D8', borderRadius: '25px', padding: '20px'}}>
          {options_list[props.imageNumber].map( option => {
            var index = options_list[props.imageNumber].indexOf(option);
            return (
              <FormControlLabel key = {index}
                control={
                  <Checkbox onChange={handleChange} name={options_names[index]}/>
                }
                label={getLabel(options_names[index], option)}
              />
            )
          })}
        </FormGroup>
      </FormControl>
      
      <br/>
      {picked.length > 0 ? (
        <Button variant="outlined" onClick={handleSubmit}>Submit</Button>
      ): (null)}

        <br/> <br/>
        {answered === true ? (
          <> {correct !== "" ? (
            <>
            {correct === "correct" ? (
              <p style={{fontWeight: 'bold'}}>Correct!</p>
            ) : (
              correct === "partially" ? (
                <p style={{fontWeight: 'bold'}}>That is partially correct. You might not have selected all the right answers or you may have selected one or more wrong ones.</p>
              ) : (
                <p style={{fontWeight: 'bold'}}>No, that is not it. Feel free to try again!</p>
              )
            )}
            </>
          ) : (null)}
            <p class = "text-info">{desc_list[props.imageNumber]}</p>
          </>
        ):
        (
            null
        )
        }

        <br/> <br/>

        <div class="row">


          {props.imageNumber < props.totalImages - 1 ? (
            <>
              {props.imageNumber !== 0 ? (
                <div class="column">
                  <Button  sx={{width: "120%"}} variant="contained" onClick = {() => {props.changeImage("back")}}>&lt;&lt; Previous</Button>
                </div>
              ) : 
              (null)}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <div class="column">
                <Button variant="contained" onClick = {() => {props.changeImage("ahead")}}>Next &gt;&gt;</Button>
              </div>
            </>
          ) :
          (
            <>
              {props.imageNumber !== 0 ? (
              <div class="column">
                <Button variant="contained" onClick = {() => {props.changeImage("back")}}>&lt;&lt; Previous</Button>
              </div>
              ) : 
              (null)}
              <div class="column">
                <Button sx={{width: "150%"}} variant="contained" onClick = {props.showProblems}>Try some exercises!</Button>
              </div>
            </>
          )}

        </div>
       </div>
    )
}

export default ImageComponent;