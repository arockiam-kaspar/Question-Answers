import React, { Component } from 'react';
import PropTypes from "prop-types";
import messages from "../messages";

export default class Authoring extends Component {
	constructor(props){
		super(props);
		this.state={
			data: {...this.props}
		};
	}
	renderOptions = ()=>{
		const { option } = this.state.data;
		const { optionLabel} = messages.en;
		const elementsArr = [];
		for(var index in option){
			elementsArr.push(option[index]);
		}
		/*<input key={`option-${index}`} type="text" name={`option${index+1}`} onKeyDown={this.handleHeight} className="form-control expandingtext" onChange={(e)=>this.onOptionChange(e)} value={option[opt]}/>*/
		let optionMap = elementsArr.map((value,index)=>{
			let opt = `option${index+1}`;
			return(
			<div key={`optiondiv-${index}`} className="row form-group">
				<span key={`optionspan-${index}`} className="col col-md-3 old">{optionLabel} {index+1}</span>
				<textarea 
       					rows="1"
       					key={`option-${index}`} 
       					name={`option${index+1}`} 
       					style={{height:"2em"}}
       					onKeyDown={this.handleHeight}
						className="col-md-9 form-control expandingtext"
						onChange={(e)=>this.onOptionChange(e)} 
						value={option[opt]}></textarea>
			</div>
			)
		});
		return optionMap;
	}
	onOptionChange= (e)=>{
		this.setState({
			data:{...this.state.data,
				option:{...this.state.data.option,[e.target.name]:e.target.value}}
		},()=>{
			const option   = {...this.state.data}
			this.props.onChange(option);
		});
	}
	handleHeight = (e)=>{
		const element = e.target || e;
		element.style.height = 'auto';
        element.style.height = element.scrollHeight+'px';
	}
	onHandleChange = (e)=>{
		this.setState({
			data: {...this.state.data, [e.target.name]:e.target.value}
		},()=>{
			const question = this.state.data.question;
	 		this.props.onChange({question:question});
		});
		this.handleHeight(e);
	}
	onAddHandleOptions = (e)=>{
		const { option} = this.state.data;
		const  length = Object.keys(option).length;
		if(length<6){
			let opt = `option${length+1}`;
			const newOptions  = {...this.state.data,
				option:{...this.state.data.option,[opt]:""}};
			this.setState({
				data: newOptions
			})
		}
	}
	onDeleteHandleOptions = (e)=>{
		let { option} = this.state.data;
		const  length = Object.keys(option).length;
		if(length>2){
			let opt = `option${length}`;
			const newOptions  = {...this.state.data,
				option:{...this.state.data.option}};	
			delete newOptions.option[opt];
			this.setState({
				data: newOptions
			},()=>{
				const option   = {...this.state.data}
				this.props.onChange(option);
			})
		}
	}
	componentWillReceiveProps({question, option,selectedQuestion}){
		this.setState({
			data: {...this.state.data,question:question,option,selectedQuestion:selectedQuestion}
		});
	}
	componentDidUpdate(prevProps, prevState) {
		const element = this.refs['questionArea'];
		this.handleHeight(element);
	}
	readFile =(input)=>{
		var reader = new FileReader();
	  	reader.readAsDataURL(input.target.files[0]);
	  	reader.onload = ()=> {
		    var fileContent = reader.result;
		    document.getElementById("selectImage").style.display = 'block';
		    document.getElementById("selectImage").setAttribute('src', fileContent);
		}
	}
	render() {
		const { data } =  this.state;
		const { addLabel, deleteLabel, addimage, question, designquestion } = messages.en;
		
		return (
			<div className="authoring-container">
       			<header>{designquestion} {data.selectedQuestion}</header>
       			<div className="row form-group">
       				<span className="col-lg-3 col-md-3 bold">{question}</span>
       				<textarea 
       					rows="1"
       					name ="question" 
       					id="question"
       					style={{height:"2em"}}
       					onChange={this.onHandleChange} 
       					ref="questionArea"
       					onKeyDown={this.handleHeight}
       					onCopy={this.handleHeight}
       					onPaste={this.handleHeight}
       					value={data.question}
       					className="col col-md-9 form-control expandingtext"
       				></textarea>
       				<div className="uploadfile text-center">
       					<img id="selectImage" src="#" className="fileImage" alt="your image" />
       					<label htmlFor="uploadBtn" className="uploadBtnLabel btn-small">{addimage}</label>
       					<input type="file" name="imageUrl" className="uploadBtn btn-small" id="uploadBtn" onChange={this.readFile}/>
       				</div>	
       			</div>
       			<div className="optionContainer">
       				{this.renderOptions()}
       			</div>
       			<div className="button-wrapper">
       				<button className="btn btn-primary" onClick={this.onAddHandleOptions}>{addLabel}</button>
       				<button className="btn btn-primary" onClick={this.onDeleteHandleOptions}>{deleteLabel}</button>
       			</div>
       	</div>
		);
	}
}
Authoring.propTypes={
	data: PropTypes.shape({
		question: PropTypes.string.isRequired,
		option: PropTypes.shape({}).isRequired
	})
}