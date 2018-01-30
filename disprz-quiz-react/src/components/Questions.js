import React, { Component } from 'react';
import Authoring from './Authoring';
import messages from "../messages";

class Questions extends Component {

    constructor(props) {
        super(props);
        this.state={
            isVisibleAnswerPanel:false,
            selectedQuestion:null,
            isDelteMode:false,
            data:[],
            deleteNode:[]
        }
    }
    componentWillMount(){
        localStorage.getItem("disprzQuizData") && this.setState({
            data: JSON.parse(localStorage.getItem("disprzQuizData")),
            isVisibleAnswerPanel: true,
            selectedQuestion: 0
        });
    }
    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem("disprzQuizData", JSON.stringify(nextState.data));
    }
    renderAuthoringPanel = ()=>{
        const { whatquestion } = messages.en;
        
        const { selectedQuestion, data } = this.state;
        const clonedData = Object.assign([],[...data]);
        const clonedDeleteNode = [...this.state.deleteNode];
        clonedDeleteNode.push("false");
        clonedData.push({
               question:whatquestion,
                option:{
                    "option1":"",
                    "option2":""
                }
            });
        this.setState({
            isVisibleAnswerPanel:true,
            data: clonedData,
            selectedQuestion: (selectedQuestion==null?0:selectedQuestion+1),
            deleteNode:clonedDeleteNode
        });
    }
    onClickEditQuesion = (event,idx)=>{
        event.preventDefault();
        this.setState({
            selectedQuestion: idx
        })
    }
    onCheckboxChange = (event, idx)=>{
        const { checked } = event.target;
        const updatedNode = JSON.parse(JSON.stringify(this.state.deleteNode));
        updatedNode[idx]=checked;
        this.setState({
            deleteNode: updatedNode
        });
    }
    onRenderAnswers = ()=>{
        const {isVisibleAnswerPanel, selectedQuestion, data} = this.state;
        if(isVisibleAnswerPanel){
            return <Authoring {...data[selectedQuestion]} selectedQuestion={selectedQuestion+1} onChange={this.onUpdate}/>
        }
        return null;
    }
    onUpdate = ({question,option,imageUrl})=>{
        const { selectedQuestion } =  this.state;
        if(question!=null){
            const clonedObj = {...this.state.data[selectedQuestion],question:question};
            this.setState({
                data: Object.assign([...this.state.data],{[selectedQuestion]:clonedObj})
            });
        }
        if(option!=null){
            const clonedOptionObj = Object.assign({},this.state.data[selectedQuestion],{option:option})
            this.setState({
                data: Object.assign([...this.state.data],{[selectedQuestion]:clonedOptionObj})
            });
        }
    }
    onUpdateQuestion = ()=>{
        const { isVisibleAnswerPanel, selectedQuestion, isDelteMode } = this.state;
        if(isVisibleAnswerPanel){
            const questionMap = this.state.data.map((value,index)=>{
            return(
                <div className="form-group" key={`quest${index}`}>
                    {isDelteMode && <input className="form-check-input" type="checkbox" deleteindex={index} onChange={(e)=>this.onCheckboxChange(e,index)} key={`check${index}`}/>}
                    <div key={`num${index}`} className="snclass">{index+1}. </div>
                    <div className="snname"><a href="" className={`${selectedQuestion===index?"bold":""}`} key={index} onClick={(e)=>this.onClickEditQuesion(e,index)}>{value.question}</a></div>
                </div>
                
                )
            });
            return questionMap;
        }
        return null;    
    }
    onDeleteAnswers = ()=>{
        const { isDelteMode } = this.state;
        this.setState({
            isDelteMode: !isDelteMode
        })
    }
    onDeleteMultiQuestions = ()=>{
        const { data, deleteNode } = this.state;
        const valuesArr = data.filter((value, index)=> {
            if(deleteNode[index]==="false"){
                return value;
             }
        });
        const newDeleteArr = deleteNode.filter((value, index)=> {
            return value==="false"
        });
        this.setState({
            data:valuesArr,
            deleteNode:newDeleteArr,
            isDelteMode: false,
            selectedQuestion: (newDeleteArr.length>0?(newDeleteArr.length-1):null),
            isVisibleAnswerPanel: (newDeleteArr.length>0?true:false)
        })
    }
    render() {
        const { isDelteMode } = this.state; 
        const { addLabel, deleteLabel, okLabel, backLabel, selectquest} = messages.en;
        return (
        <div className="row container-center">
            <div className="col-xs-12 col-sm-12  col-lg-5 col-md-5 question-wrapper"> 
                <div className="question-container">
                    <header>{selectquest}</header>
                    {this.onUpdateQuestion()}
                      {!isDelteMode? 
                        <div className="button-wrapper form-group">
                            <button className="btn btn-primary" onClick={this.renderAuthoringPanel}>{addLabel}</button>
                            <button className="btn btn-primary" onClick={this.onDeleteAnswers}>{deleteLabel}</button>
                        </div>
                        :<div className="button-wrapper form-group">
                            <button className="btn btn-primary" onClick={this.onDeleteMultiQuestions}>{okLabel}</button>
                            <button className="btn btn-primary" onClick={this.onDeleteAnswers}>{backLabel}</button>
                        </div>
                      }
                </div> 
            </div>
            <div className="col col-xs-12 col-sm-12  col-lg-7 col-md-7 authoring-wrapper">
                {this.onRenderAnswers()}
            </div>
        </div>    
     )
    }
}

export default Questions;
