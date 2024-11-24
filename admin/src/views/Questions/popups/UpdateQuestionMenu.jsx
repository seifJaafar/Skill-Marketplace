import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import useWindowSize from "../../../components/useWindowSize";
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from "primereact/inputnumber";
import { useNavigate } from "react-router-dom";
import { updateQuestion } from "../../../actions/quiz.action"
function UpdateQuestionMenu(props) {
    const { open, handleClose, title = "Updating Question", value } = props;
    const [id, setId] = useState(value._id);
    const [QuestionText, setQuestionText] = useState(value.questionText)
    const [options, setOptions] = useState(value.options || []);
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(value?.correctAnswerIndex)
    const navigate = useNavigate();

    const size = useWindowSize();

    useEffect(() => {
        setId(value._id);
        setOptions(value.options || []);
        setQuestionText(value.questionText)
        setCorrectAnswerIndex(value?.correctAnswerIndex)
    }, [value]);

    const PopupSize = () => {
        switch (size) {
            case "xl":
            case "lg":
            case "md":
            case "sm":
                return "500px";
            case "xs":
                return "98%";
            default:
                return "80%";
        }
    };

    // Add a new empty option
    const addOption = () => {
        setOptions([...options, ""]);
    };

    // Update the value of an option
    const handleOptionChange = (value, index) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    // Delete an option by index
    const deleteOption = (index) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        setOptions(updatedOptions);
    };

    // Submit the updated data, including options
    const handleSubmit = async () => {
        const data = {
            questionText: QuestionText,
            options: options,
            correctAnswerIndex: correctAnswerIndex
        };
        const response = await updateQuestion(id, data);
        if (response) {
            navigate('/quizes')
        }
    };

    const DialogFooter = (
        <>
            <Button
                label="Cancel"
                icon="pi pi-times"
                style={{ backgroundColor: "#1E1F2A", color: "#C9E782", border: "none" }}
                onClick={handleClose}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                style={{ backgroundColor: "#C9E782", color: "#1E1F2A", border: "none", marginLeft: "10px" }}
                onClick={handleSubmit}
            />
        </>
    );

    return (
        <Dialog
            visible={open}
            style={{ width: PopupSize() }}
            header={title}
            modal
            className="p-fluid"
            footer={DialogFooter}
            onHide={handleClose}
        >
            <div className="grid w-100 mt-2">
                <div className="field col-12">
                    <label htmlFor="name">Question Text</label>
                    <InputTextarea id="name" value={QuestionText} onChange={(e) => setQuestionText(e.target.value)} />
                </div>
                <div className="field col-6 md:col-6">
                    <label>Coorect Answer Index</label>
                    <InputNumber
                        value={correctAnswerIndex}
                        onValueChange={(e) => setCorrectAnswerIndex(e.value)}
                        mode="decimal"
                        showButtons
                        min={0}
                        max={options.length - 1}
                    />
                </div>
                <div className="field col-12">
                    <label>Options</label>
                    {options.map((option, index) => (
                        <div key={index} className="option-item mb-2 flex align-items-center">
                            <InputText
                                value={option}
                                onChange={(e) => handleOptionChange(e.target.value, index)}
                                placeholder={`Option ${index + 1}`}
                                className="p-inputtext-sm w-full"
                            />
                            <Button
                                icon="pi pi-trash"
                                className="p-button-danger p-button-sm ml-2"
                                onClick={() => deleteOption(index)}
                                tooltip="Delete this option"
                            />
                        </div>
                    ))}
                    <Button
                        label="Add Option"
                        icon="pi pi-plus"
                        onClick={addOption}
                        className="p-button-sm p-button-outlined mt-2"
                    />
                </div>
            </div>
        </Dialog>
    );
}

export default UpdateQuestionMenu;
