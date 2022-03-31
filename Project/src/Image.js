import './ImageComponent.css';
import image from './GeneratedGraph.png';
import React, { Component }  from 'react';
import { CircularProgress } from '@mui/material';

class Image extends Component{
    constructor(props){
        super(props);
        this.state = {ready : false, imageClass: ""}
    }

    sleep(milliseconds){
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    // there is a slight delay when rendering the image in order to allow the backend to finish creating the graph and
    // save it in a file
    async componentDidMount(){
        this.sleep(400).then(r => {
            this.setState({ready:true});
            this.getImageClass();
      	})
    }

    // depending on the type of graph, the size of the image will be different - I found that pie charts can look disproportionately big
    // compared to their counterparts
    getImageClass(){
        if (this.props.small){
            this.setState({imageClass: "small"})
        }
        else {
            this.setState({imageClass: "image-problem"})
        }
    }

    render(){
        return (
            <>
                {this.state.ready === true ? (
                    <img src={image} alt="Graph" className={this.state.imageClass} />
                ) : (
                    null
                )}
            </>
        )
    }
}

export default Image;