import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { useLocation } from "react-router-dom";
import { FileUpload } from "primereact/fileupload";
import { Dropdown } from "primereact/dropdown"; // Import Dropdown component
import { toast } from "react-hot-toast";
import { AddChapterCourse, GetChaptersByCourse } from "../../actions/courses.action"; // Ensure you have the GetChaptersByCourse action

function AddChapter({ user }) {
    const { id } = useParams();
    const location = useLocation();
    const { title } = location.state || {};
    const [chapterTitle, setChapterTitle] = useState("");
    const [files, setFiles] = useState([]);
    const [chapters, setChapters] = useState([]); // State for chapters
    const [selectedPreviousChapter, setSelectedPreviousChapter] = useState(null); // State for selected previous chapter
    const fileUploadRef = React.createRef();

    useEffect(() => {
        // Fetch the chapters for the given course
        const fetchChapters = async () => {
            const response = await GetChaptersByCourse(id);
            if (response.error) {
                toast.error(response.error);
            } else {
                setChapters(response.chapters.map((chapter => ({ label: chapter.title, value: chapter._id })))); // Assuming response has chapters
            }
        };

        fetchChapters();
    }, [id]);

    const handleSubmit = async () => {
        if (!chapterTitle) {
            toast.error("Chapter title is required.");
            return;
        }
        if (files.length === 0) {
            toast.error("Please add files to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("chapterTitle", chapterTitle);
        formData.append('title', title);
        formData.append('previousChapter', selectedPreviousChapter); // Include selected previous chapter
        files.forEach((fileObj, index) => {
            formData.append("files", fileObj.file);
            formData.append('fileOrders', files[index].order);
        });

        const response = await AddChapterCourse(id, formData);
        if (response.error) {
            toast.error(response.error);
        } else {
            toast.success("Chapter added successfully.");
            setChapterTitle("");
            setFiles([]);
            fileUploadRef.current.clear();
        }
    };

    const handleFileSelect = (e) => {
        const selectedFiles = e.files;
        const uniqueFiles = selectedFiles.filter(
            (file) => !files.some((existingFile) => existingFile.file.name === file.name)
        );

        const newFiles = uniqueFiles.map((file, index) => ({
            file,
            order: files.length + index + 1,
        }));

        if (files.length + newFiles.length > 10) {
            toast.error("You can upload a maximum of 10 files.");
            return;
        }

        if (newFiles.length > 0) {
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            toast.success(`${newFiles.length} new file(s) added successfully.`);
        } else {
            toast.error("File(s) already added.");
        }
    };

    const handleFileRemove = (fileToRemove) => {
        setFiles((prevFiles) => prevFiles.filter((f) => f.file !== fileToRemove.file));
        toast.success(`${fileToRemove.file.name} removed successfully.`);
    };

    const handleFileOrderChange = (file, newOrder) => {
        setFiles((prevFiles) =>
            prevFiles.map((f) =>
                f.file === file.file ? { ...f, order: newOrder } : f
            )
        );
    };

    return (
        <div className="layout-main">
            <div className="layout-content">
                {chapters && chapters.length > 0 ? (
                    <div className="FormContainer">
                        <div className="form-row" style={{ alignItems: 'center' }}>
                            <div className="form-field">
                                <label>Chapter Title</label>
                                <InputText
                                    name="chapterTitle"
                                    value={chapterTitle}
                                    onChange={(e) => setChapterTitle(e.target.value)}
                                    required
                                    className="large-input"
                                />
                            </div>
                            <div className="form-field">
                                <label>Add Files</label>
                                <FileUpload
                                    ref={fileUploadRef}
                                    name="Files"
                                    multiple
                                    accept="video/*,application/pdf"
                                    maxFileSize={100000000}
                                    customUpload
                                    uploadHandler={handleFileSelect}
                                    onClear={() => setFiles([])}
                                    emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
                                    chooseLabel="Add Files"
                                    className="file-upload"
                                />
                            </div>
                            <div className="form-field">
                                <label>Select Previous Chapter</label>
                                <Dropdown
                                    value={selectedPreviousChapter}
                                    options={chapters}
                                    onChange={(e) => setSelectedPreviousChapter(e.value)}
                                    optionLabel="label" // Assuming chapterTitle is the label you want to display
                                    optionValue="value" // The value to send is the _id of the chapter
                                    placeholder="Select a previous chapter"
                                />
                            </div>
                        </div>
                        <div className="file-list">
                            {files.map((fileObj, index) => (
                                <div key={index} className="file-item" style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className="">
                                        <span>{fileObj.file.name}</span>
                                    </div>
                                    <div className="flex flex-column">
                                        <label>Order</label>
                                        <InputNumber
                                            value={fileObj.order}
                                            onChange={(e) => handleFileOrderChange(fileObj, e.value)}
                                            min={1}
                                            max={10}
                                        />
                                    </div>

                                    <Button
                                        icon="pi pi-trash"
                                        className="p-button-danger"
                                        onClick={() => handleFileRemove(fileObj)}
                                    />
                                </div>
                            ))}
                        </div>
                        <Button label="Add chapter" onClick={handleSubmit} />
                    </div>
                ) : (

                    <p>No chapters found. Thers is a problem at least it has to be one chapter please delete the course and create another with first chapter.</p>

                )}

            </div>
        </div >
    );
}

export default AddChapter;
