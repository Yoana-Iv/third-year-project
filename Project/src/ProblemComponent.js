import React, { Component } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Typography, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Link } from '@mui/material';
import { Button } from '@mui/material';
import './ImageComponent.css';
import Image from './Image';
import dataset1 from './data/dataset1.json';
import dataset2 from './data/dataset2.json';
import dataset3 from './data/dataset3.json';
import dataset4 from './data/dataset4.json';

// this component works in the same fashion as the image component - every problem uses it, but each problem has different data (in this case
// problem description, dataset, feedback, etc.) and state determined by the problem number, which is managed by the parent component
class ProblemComponent extends Component{
    constructor(props){
        super(props);
        const [labels1, values1] = this.parseValues(dataset1["values"])
        const [labels2, values2] = this.parseValues(dataset2["values"])
        const [labels3, values3] = this.parseValues(dataset3["values"])
        const [labels4, values4] = this.parseValues(dataset4["values"])
        this.state = this.props.state;
        this.datasets = [[labels1, values1, dataset1["feedback"]], [labels2, values2, dataset2["feedback"]], [labels3, values3, dataset3["feedback"]], [labels4, values4, dataset4["feedback"]]];
        this.instructions = [dataset1["intro"], dataset2["intro"], dataset3["intro"], dataset4["intro"]];
        this.colourType = {"line": ["red line", "green line", "blue line", "orange line"], "bar" : ["red only", "green only", "blue only", "red", "green", "blue", "random"], "pie" : ["normal", "light", "bright"]}
    }

    // Scrolls to the top of the page when the problem changes. If the user has already worked on that problem and created
    // a graph, the API is called for the graph to be made again
    componentDidMount(){
        window.scrollTo(0, 0);
        if (this.state.type !== ""){
            this.getGraph();
        }
    }

    // turns a dictionary-based dataset into a list of labels and a list of values
    parseValues(dataset){
        var listLabels = [];
        var listValues = [];
        for (var key in dataset){
            if (dataset.hasOwnProperty(key)){
                listLabels.push(key);
                listValues.push(dataset[key]);
            }
        }
        return [listLabels, listValues]
    }

    // functions for the dropdowns to change the state upon user interaction
    handleChangeType(event){
        this.setState({ type: event.target.value});

        // since each graph type is associated with different colour names, reset the current colour state
        this.setState({ colour: ""});

        // since a logarithmic scale does not work with a pie chart, choosing pie as a graph type automatically disables logarithmic scaling
        if (event.target.value === "pie"){
            this.setState({logarithmic: false});
        }
    }

    handleChangeColour(event){
        this.setState({ colour: event.target.value});
    }

    handleChangeOrder(event){
        this.setState({ order: event.target.value});
    }

    modifyForFeedback(val){
        if (val === true){
            return "yes"
        }
        else {
            return "no"
        }
    }

    checkFeedback(f){
        if (f[1] !== "" && typeof f[1] !== "undefined"){
            return true
        }
        return false
    }

    // fetch feedback from the feedback dictionary that is loaded from the json files and format it for display
    getFeedback(){
        var listFeedback = [];
        var finalList = [];
        var feedback = this.datasets[this.props.problemNumber][2];
        listFeedback.push(["Graph type:", feedback["type"][this.state.type]]);
        if (this.state.type !== "pie"){
            listFeedback.push(["Use of logarithmic scale:", feedback["logarithmic"][this.modifyForFeedback(this.state.logarithmic)]]);
        }
        if (this.colourType[this.state.type].includes(this.state.colour)){
            listFeedback.push(["Graph colour choice:", feedback["colour"][this.state.colour]]);
        }
        if (this.state.type === "bar"){
            listFeedback.push(["Textures on bar graph:", feedback["textures"][this.modifyForFeedback(this.state.textures)]]);
            listFeedback.push(["Using a horizontal bar graph:", feedback["horizontal"][this.modifyForFeedback(this.state.horizontal)]]);
        }
        if (this.state.type === "pie"){
            listFeedback.push(["Showing percentage values on pie chart:", feedback["percentage"][this.modifyForFeedback(this.state.percentage)]]);
            listFeedback.push(["Displaying a legend on pie chart:", feedback["legend"][this.modifyForFeedback(this.state.legend)]]);
        }
        if (this.state.order === ""){
            listFeedback.push(["Ordering of labels:", feedback["order"]["default"]]);
        }
        else {
            listFeedback.push(["Ordering of labels:", feedback["order"][this.state.order]]);
        }

        listFeedback.map(f => {
            if (this.checkFeedback(f)){
                finalList.push(f)
            }
        })

        return finalList
    }

    // functions to handle the checkboxes
    handleTextures(event){
        if (event.target.checked === true){
            this.setState({textures: true});
        }
        else {
            this.setState({textures: false});
        }
    }

    handleHorizontal(event){
        if (event.target.checked === true){
            this.setState({horizontal: true});
        }
        else {
            this.setState({horizontal: false});
        }
    }

    handleLog(event){
        if (event.target.checked === true){
            this.setState({logarithmic: true});
        }
        else {
            this.setState({logarithmic: false});
        }
    }

    handlePercentage(event){
        if (event.target.checked === true){
            this.setState({percentage: true});
        }
        else {
            this.setState({percentage: false});
        }
    }

    handleLegend(event){
        if (event.target.checked === true){
            this.setState({legend: true});
        }
        else {
            this.setState({legend: false});
        }
    }

    // communicate with the back end and send a request for a new graph to be made
    async getGraph(){
        var req_body = {}

        // create a specific request for each graph type in order to avoid sending unnecessary information
        if (this.state.type === "line"){
            req_body = { type: this.state.type, colour: this.state.colour, 
                    logarithmic: this.state.logarithmic, order: this.state.order,
                    number: this.props.problemNumber }
        }
        else if (this.state.type === "bar"){
            req_body = {type: this.state.type, textures: this.state.textures, colour: this.state.colour, 
                    logarithmic: this.state.logarithmic, order: this.state.order,
                    number: this.props.problemNumber, horizontal: this.state.horizontal}
        }
        else if (this.state.type === "pie"){
            req_body = {type: this.state.type, colour: this.state.colour, 
                    logarithmic: this.state.logarithmic, order: this.state.order, percentage: this.state.percentage,
                    number: this.props.problemNumber, legend: this.state.legend}
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req_body)
        };

        fetch('/make_graph', requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data["done"] == "yes") {
                // in case the new graph has been successfully created, the graphGenerated state value will tell the
                // component to display the new graph and the current state will be saved in the parent component
                this.setState({graphGenerated : true});
                this.props.updateState(this.props.problemNumber, this.state);

                // due to how the graphs are shown a pie chart requires a smaller image size
                if (this.state.type === "pie"){
                    this.setState({smallImage: true});
                }
                else {
                    this.setState({smallImage: false})
                }
            }
            else {
                this.setState({graphGenerated : false});
                console.log(data["exception"]);
                console.log(data["reasons"]);
            }
        });
    }

    // custom made function for rendering three columns since the default css column option was not giving the desired results
    // (middle column appeared too long)
    renderLabelsAndValues(){
        var labels = JSON.parse(JSON.stringify(this.datasets[this.props.problemNumber][0]));
        var values = JSON.parse(JSON.stringify(this.datasets[this.props.problemNumber][1]));
        var third = Math.floor(labels.length/3);
        var remainder = labels.length - third*3;
        var labels1 = labels.splice(0, third);
        var labels2 = labels.splice(0, (third + remainder));
        var labels3 = labels.splice(0, third);
        var values1 = values.splice(0, third);
        var values2 = values.splice(0, (third + remainder));
        var values3 = values.splice(0, third);



        return (
            <div class="datarow">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <div class="column-prob">
                    {labels1.map(label => {
                        var index = labels1.indexOf(label);
                        return (
                            <>
                            {this.props.problemNumber !== 1  && this.props.problemNumber !== 3  ? (
                                <p key={index}>{label} : <span class="values">{values1[index]}</span></p>
                            ) : (
                                <p key={index}>{label} : <span class="values">&#163;{values1[index]}</span></p>
                            )}
                            </>
                        )
                    })}
                </div>
                <div class="column-prob">
                    {labels2.map(label => {
                        var index = labels2.indexOf(label);
                        return (
                            <>
                            {this.props.problemNumber !== 1 && this.props.problemNumber !== 3  ? (
                                <p key={index}>{label} : <span class="values">{values2[index]}</span></p>
                            ) : (
                                <p key={index}>{label} : <span class="values">&#163;{values2[index]}</span></p>
                            )}
                            </>
                        )
                    })}
                </div>
                <div class="column-prob">
                    {labels3.map(label => {
                        var index = labels3.indexOf(label);
                        return (
                            <>
                            {this.props.problemNumber !== 1 && this.props.problemNumber !== 3 ? (
                                <p key={index}>{label} : <span class="values">{values3[index]}</span></p>
                            ) : (
                                <p key={index}>{label} : <span class="values">&#163;{values3[index]}</span></p>
                            )}
                            </>
                        )
                    })}
                </div>
            </div>
        )
    }

    // The render function displays the different datasets, as well as the various dropdowns and checkboxes
    // used when selecting the graph parameters. When a graph is generated, the function also handles showing it
    // to the viewer alongside any feedback.
    render(){
        return (
            <div className="wrapper">
            <br/> <br />
    
                <Typography variant="h2" component="h2">
                    Try it yourself!
                </Typography>
    
            <br/> <br />
            <p class="text-intro-prob">{this.instructions[this.props.problemNumber]}</p>
            <br/>
            {this.renderLabelsAndValues()}
            <br/> <br />
            <p>Pick the properties for the graph you would make using the data above:</p>
            <br/> <br />
    
            <FormControl sx={{width: "50%"}}>
                <InputLabel id="type-select">Type</InputLabel>
                <Select
                    labelId="type-select"
                    id="type"
                    value={this.state.type}
                    label="Type"
                    onChange={this.handleChangeType.bind(this)}
                >
                    <MenuItem value={"bar"}>Bar Graph</MenuItem>
                    <MenuItem value={"line"}>Line Graph</MenuItem>
                    <MenuItem value={"pie"}>Pie Chart</MenuItem>
                </Select>
            </FormControl> <br />
            {this.state.type !== "" ? (
                <FormControl sx={{width: "50%"}}>
                {this.state.type === "bar" ? (
                    <>
                    <InputLabel id="colour-select">Colour</InputLabel>
                    <Select
                        labelId="colour-select"
                        id="colour"
                        value={this.state.colour}
                        label="Colour"
                        onChange={this.handleChangeColour.bind(this)}
                    >
                        <MenuItem value={"red only"}>Red</MenuItem>
                        <MenuItem value={"green only"}>Green</MenuItem>
                        <MenuItem value={"blue only"}>Blue</MenuItem>
                        <MenuItem value={"red"} >Red gradient</MenuItem>
                        <MenuItem value={"green"}>Green gradient</MenuItem>
                        <MenuItem value={"blue"}>Blue gradient</MenuItem>
                        <MenuItem value={"random"}>Colourful</MenuItem>
                    </Select>
                    <br />
                    <FormControl sx={{width: "100%"}}>
                    <FormControlLabel
                    control={
                      <Checkbox onChange={this.handleTextures.bind(this)} name="textures" checked={this.state.textures}/>
                    }
                    label="Apply textures to the bars"
                    />
                    <br />
                    <FormControlLabel
                    control={
                      <Checkbox onChange={this.handleHorizontal.bind(this)} name="horizontal" checked={this.state.horizontal}/>
                    }
                    label="Make the bars horizontal"
                    />
                    <br />
                    </FormControl>
                  </>
                ) :
                (  
                    <>
                    {this.state.type === "line" ? (
                    <>
                    <InputLabel id="colour-select">Colour</InputLabel>
                        <Select
                            labelId="colour-select"
                            id="colour"
                            value={this.state.colour}
                            label="Colour"
                            onChange={this.handleChangeColour.bind(this)}
                        >
                            <MenuItem value={"red line"}>Red</MenuItem>
                            <MenuItem value={"green line"}>Green</MenuItem>
                            <MenuItem value={"blue line"}>Blue</MenuItem>
                        </Select>
                        <br/>
                    </>
                    ) : (null)}
                    </>
                )}
                {this.state.type === "pie" ? (
                    <>
                    {this.props.problemNumber === 1 ? (
                        <>
                            <InputLabel id="colour-select">Colours</InputLabel>
                            <Select
                                labelId="colour-select"
                                id="colour"
                                value={this.state.colour}
                                label="Colour"
                                onChange={this.handleChangeColour.bind(this)}
                            >  
                            <MenuItem value={"one"}>Normal colour palette</MenuItem>
                            <MenuItem value={"two"}>Light colour palette</MenuItem>
                            <MenuItem value={"three"}>Bright colour palette</MenuItem>
                            </Select>
                        </>
                    ) : (
                        <>
                        <InputLabel id="colour-select">Colours</InputLabel>
                        <Select
                            labelId="colour-select"
                            id="colour"
                            value={this.state.colour}
                            label="Colour"
                            onChange={this.handleChangeColour.bind(this)}
                        > 
                        <MenuItem value={"one"}>Colour palette 1</MenuItem>
                        <MenuItem value={"two"}>Colour palette 2</MenuItem>
                        <MenuItem value={"three"}>Colour palette 3</MenuItem>
                        </Select>
                        </>
                    )}
                    <br />
                    <FormControl sx={{width: "100%"}}>
                    <FormControlLabel
                    control={
                      <Checkbox onChange={this.handlePercentage.bind(this)} name="percentage" checked={this.state.percentage}/>
                    }
                    label="Show percentage values on pie chart"
                    />
                    <br />
                    <FormControlLabel
                    control={
                      <Checkbox onChange={this.handleLegend.bind(this)} name="legend" checked={this.state.legend}/>
                    }
                    label="Show legend"
                    />
                    <br />
                    </FormControl>
                  </>
                ) :
                (null)}
            <FormControl sx={{width: "100%"}}>
            <InputLabel id="order-select">Label order</InputLabel>
            <Select
                labelId="order-select"
                id="order"
                value={this.state.order}
                label="Label order"
                onChange={this.handleChangeOrder.bind(this)}
            >
                <MenuItem value={"default"}>Default sort (as sorted above)</MenuItem>
                <MenuItem value={"keys"}>Sort alphabetically</MenuItem>
                <MenuItem value={"up"}>Sort by value (ascending)</MenuItem>
                <MenuItem value={"down"}>Sort by value (descending)</MenuItem>
            </Select>
            </FormControl>
            <br />
            {this.state.type !== "pie" ? (
                <>
                <div class="row">
                    <div class="column">
                    <FormControl sx={{width: "100%"}}>
                    <FormControlLabel
                        control={
                        <Checkbox onChange={this.handleLog.bind(this)} name="log" checked={this.state.logarithmic}/>
                        }
                        label="Use logarithmic scaling"
                    />
                    </FormControl>
                    </div>
                    <div class="column">
                    <Link
                        component="button"
                        variant="body1"
                        underline="none"
                        onClick={() => {
                            this.setState({logInfo: !this.state.logInfo})
                        }}
                        >
                        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                        &emsp;&emsp;&ensp;
                         What is logarithmic scaling?
                    </Link>
                    </div>
                </div>
                </>
            ) : (
                null
            )}
            </FormControl>
            ) : (
                null
            )}
    
            {this.state.logInfo ? (
                    <p class="text-log">Applying a log scale in bar/line charts means that the vertical axis, instead of increasing normally,
                    will increase in multiples of 10. This will lead to the values being displayed differently - for example, with normal 
                    scaling the data points 1 and 10 when plotted on the graph will have the same distance between them as 10 and 20. When
                    using logarithmic scaling, 1 and 10 will have the same distance between them as 10 and 100 - essentially, each number
                    is represented by its logarithm of 10, hence the name. Such scaling might seem weird at first, but it can be very helpful
                    in certain situations. Feel free to experiment with it and see where it fits!</p>
                ) : (null)}
            <br/> <br />
            {this.state.type !== "" ? (
                <Button variant="contained" onClick={this.getGraph.bind(this)}>Generate graph!</Button>
            ) :(
                null
            )}


            <br/> <br />
            {this.state.graphGenerated === true ? (
                <>  
                    <Image small={this.state.smallImage && this.state.type === "pie"}/>
                    <br/> <br />
                    <Typography variant="h5" component="h5">
                        Feedback:
                    </Typography>
                    {this.getFeedback().map(f => {
                        var index = this.getFeedback().indexOf(f);
                        if (f[0] === "Using a horizontal bar graph:") {
                            var paras = f[1].split("\n")
                            return (
                                <>
                                    <p class="text-info-label" key={index}>{f[0]}</p>
                                    <p class="text-feedback" key={index}>{paras[0]}<br />{paras[1]}</p>
                                </>
                            )
                        }
                        return (
                            <>
                                <p class="text-info-label" key={index}>{f[0]}</p>
                                <p class="text-feedback" key={index}>{f[1]}</p>
                            </>
                        )
                    })}
                    <br/> <br />
                </>
            ) : (
                null
            )}
           <br/> <br />
           <div class="row">
                <div class="column">
                    <Button sx={{width: "140%"}} variant="contained" onClick = {this.props.returnToImage}>&lt;&lt; Back to images</Button>
                </div>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {this.props.problemNumber > 0 ? (
                    <div class="column">
                        <Button variant="contained" onClick = {() => {this.props.changeProblem("back")}}>&lt;&lt; Previous</Button>
                    </div>
                ) : (null)}
                {this.props.problemNumber < this.props.totalProblems - 1 ? (
                    <div class="column">
                        <Button variant="contained" onClick = {() => {this.props.changeProblem("ahead")}}>Next &gt;&gt;</Button>
                    </div>
                ) : (null)}
            </div>
            <br />
           </div>
        )
    }
}

export default ProblemComponent;