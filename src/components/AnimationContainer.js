import { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Reorder, getItemStyle, getQuestionListStyle } from "../utils";
import FrameList from "./FrameList";

// fake data generator
const getQuestions = (count) =>
    Array.from({ length: count }, (v, k) => k).map((k) => ({
        id: `question-${k}`,
        content: `question ${k}`,
        //<Frame path={"./one.jpg"} />
        //want to make this a list of frames
        frames: [`frame-1`, `frame-2`, `frame-3`]
    }));

async function getDataFromServer() {
    const response = await fetch('http://localhost:3000/data');
    const data = await response.json();
    return data;
}

class AnimationContainer extends Component {
    constructor(props) {
        super(props);

        //console.log(getQuestions(3));

        this.state = {
            animationList: []
        };
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    async componentDidMount() {
        const data = await getDataFromServer();
        this.setState({ animationList: data.animationList });
        console.log(this.state.animationList);
    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            //console.log("no-change");
            return;
        }

        if (result.type === "QUESTIONS") {
            console.log(result);
            const animationList = Reorder(
                this.state.animationList,
                result.source.index,
                result.destination.index
            );

            this.setState({
                animationList
            });
        } else {
            const frames = Reorder(
                this.state.animationList[parseInt(result.type, 10)].frames,
                result.source.index,
                result.destination.index
            );

            const animationList = JSON.parse(JSON.stringify(this.state.animationList));

            animationList[result.type].frames = frames;

            this.setState({
                animationList
            });
        }
    }

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd} onDragUpdate={this.onDragUpdate} >

                <Droppable droppableId="droppable" type="QUESTIONS">
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} style={getQuestionListStyle(snapshot.isDraggingOver)} >
                            {this.state.animationList.map((question, index) => (

                                <Draggable key={question.name} draggableId={question.name} index={index} >
                                    {(provided, snapshot) => (
                                        <span {...provided.dragHandleProps}>
                                            <div ref={provided.innerRef} {...provided.draggableProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)} >
                                                {question.name}
                                                <h3>Animation preview can go here but needs styling to push it to the left of the frames box</h3>

                                                <FrameList questionNum={index} question={question} />
                                            </div>
                                        </span>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

export default AnimationContainer;