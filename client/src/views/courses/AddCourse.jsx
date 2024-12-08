import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Chips } from "primereact/chips";
import { InputNumber } from "primereact/inputnumber";
import { FileUpload } from "primereact/fileupload";
import toast from "react-hot-toast";
import { AddNewCourse } from '../../actions/courses.action';
import '../../assets/addCourse.css';

function AddCourse({ userId }) {
    const [formIndex, setFormIndex] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skillTags, setSkillTags] = useState([]);
    const [price, setPrice] = useState(0);
    const [chapterTitle, setChapterTitle] = useState('');
    const [files, setFiles] = useState([]); // Each file will now include an order field
    const [thumbnail, setThumbnail] = useState(null);
    const fileUploadRef = React.useRef(null);

    const handleSubmit = async () => {
        try {
            if (files.length === 0) {
                return toast.error("Please upload files.");
            }
            console.log(files)
            if (!thumbnail) {
                return toast.error("Please upload a thumbnail.");
            }
            const formData = new FormData();

            formData.append('title', title);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('skillTags', skillTags);
            formData.append('skillExpert', userId);
            formData.append('chapterTitle', chapterTitle);

            files.forEach((fileObj, index) => {
                formData.append('files', fileObj.file); // Add the file
                formData.append(`fileOrders[${index}]`, fileObj.order); // Add the order as a separate key
            });
            formData.append('thumbnail', thumbnail);

            const response = await AddNewCourse(formData);
            if (response.status === 200) {
                setFiles([]);
                setTitle('');
                setDescription('');
                setSkillTags([]);
                setPrice(0);
                setChapterTitle('');
                setThumbnail(null);
                setFormIndex(0);
                fileUploadRef.current.clear();
            }
        } catch (error) {
            toast.error("An error occurred while adding the course and chapter.");
        }
    };

    const handleThumbnailSelect = (e) => {
        const selectedFile = e.files[0]; // Only one thumbnail image
        if (selectedFile) {
            setThumbnail(selectedFile);
            toast.success("Thumbnail image uploaded successfully.");
        }
    };

    const handleThumbnailRemove = () => {
        setThumbnail(null);
        toast.success("Thumbnail removed.");
    };

    const handleFileSelect = (e) => {
        const selectedFiles = e.files;
        const uniqueFiles = selectedFiles.filter(
            (file) => !files.some((existingFile) => existingFile.file.name === file.name)
        );

        const newFiles = uniqueFiles.map((file) => ({ file, order: files.length + 1 }));

        if (files.length + newFiles.length > 10) {
            toast.error("You can upload a maximum of 10 files.");
            return;
        }

        if (uniqueFiles.length > 0) {
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            toast.success(`${uniqueFiles.length} new file(s) added successfully.`);
        } else {
            toast.error('File(s) already added.');
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

    const handleNext = () => {
        if (formIndex < 1) {
            setFormIndex(formIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (formIndex !== 0) {
            setFormIndex(formIndex - 1);
        }
    };

    return (
        <>
            {formIndex === 0 && (
                <>
                    <div className="header_form">
                        <div className="title">
                            <h4>Add New Course</h4>
                        </div>
                        <div className="buttonsContainer">
                            <Button label="Previous" onClick={handlePrevious} disabled={formIndex === 0} />
                            <Button label="Next" onClick={handleNext} disabled={formIndex === 1} />
                        </div>
                    </div>
                    <div className="FormContainer">
                        <div className="form-row">
                            <div className="form-field">
                                <label>Title</label>
                                <InputText
                                    name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="large-input"
                                />
                            </div>
                            <div className="form-field">
                                <label>Description</label>
                                <InputTextarea
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    className="large-input"
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-field">
                                <label>Tags</label>
                                <Chips
                                    value={skillTags}
                                    required
                                    onChange={(e) => setSkillTags(e.value)}
                                    style={{ maxWidth: "400px" }}
                                />
                            </div>
                            <div className="form-field">
                                <label>Price</label>
                                <InputNumber
                                    value={price}
                                    onChange={(e) => setPrice(e.value || 0)}
                                    required
                                    className="large-input"
                                    mode="currency" currency="USD" locale="en-US"
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-field">
                                <label>Thumbnail</label>
                                <FileUpload
                                    name="thumbnail"
                                    accept="image/*"
                                    maxFileSize={5000000}
                                    customUpload
                                    uploadHandler={handleThumbnailSelect}
                                    onRemove={handleThumbnailRemove}
                                    emptyTemplate={<p className="m-0">Drag and drop thumbnail here to upload.</p>}
                                    chooseLabel="Add Thumbnail"
                                    className="file-upload"
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
            {formIndex === 1 && (
                <>
                    <div className="header_form">
                        <div className="title">
                            <h4>Add First Chapter</h4>
                        </div>
                        <div className="buttonsContainer">
                            <Button label="Previous" onClick={handlePrevious} disabled={formIndex === 0} />
                            <Button label="Next" onClick={handleNext} disabled={formIndex === 1} />
                        </div>
                    </div>
                    <div className="FormContainer">
                        <div className="form-row">
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
                        </div>
                        <div className="file-list">
                            {files.map((fileObj, index) => (
                                <div key={index} className="file-item">
                                    <p>{fileObj.file.name}</p>
                                    <InputNumber
                                        value={fileObj.order}
                                        onChange={(e) => handleFileOrderChange(fileObj, e.value)}
                                        min={1}
                                        max={10}
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        className="p-button-danger"
                                        onClick={() => handleFileRemove(fileObj)}
                                    />
                                </div>
                            ))}
                        </div>
                        <Button label="Add Course" onClick={handleSubmit} />
                    </div>
                </>
            )}
        </>
    );
}

export default AddCourse;
