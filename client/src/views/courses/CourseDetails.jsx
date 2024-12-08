import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from "react-router-dom";
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Link } from 'react-router-dom';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Chips } from "primereact/chips";
import { toast } from "react-hot-toast"
import { FileUpload } from "primereact/fileupload";
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { GetCourseById } from "../../actions/courses.action";
import '../../assets/CourseDetails.css';
import { InputNumber } from 'primereact/inputnumber';
import { DeleteFile, UpdateFile, DeleteChapter, UpdateChapter, UpdateCourse, DeleteCourse } from "../../actions/courses.action";


function CourseDetails({ userId }) {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedCourse, setEditedCourse] = useState({});
    const [editingChapter, setEditingChapter] = useState(null);
    const [editedChapterTitle, setEditedChapterTitle] = useState('');
    const [editingFile, setEditingFile] = useState(null);
    const [editedFileTitle, setEditedFileTitle] = useState('');
    const [editedFileOrder, setEditedFileOrder] = useState(1);
    const [newFiles, setNewFiles] = useState([])

    const fetchCourse = async (id) => {
        const response = await GetCourseById(id);
        if (response?.course) {
            setCourse(response.course);
            setEditedCourse(response.course);
        }
    };

    useEffect(() => {
        fetchCourse(id);
    }, [id]);

    const sortChapters = (chapters) => {
        if (!chapters || chapters.length === 0) return [];
        console.log("Chapters:", chapters);
        const firstChapter = chapters.find((chapter) => !chapter.previousChapter);
        if (!firstChapter) return [];
        const orderedChapters = [];
        let currentChapter = firstChapter;
        while (currentChapter) {
            orderedChapters.push(currentChapter);
            currentChapter = chapters.find((chapter) => chapter.previousChapter === currentChapter._id);
        }
        console.log("Ordered Chapters:", orderedChapters);
        return orderedChapters;
    };

    const sortFiles = (files) => {
        if (!files || files.length === 0) return [];
        return files.sort((a, b) => a.order - b.order);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const newEditedCourse = {
                title: editedCourse.title,
                description: editedCourse.description,
                price: editedCourse.price,
                skillTags: editedCourse.skillTags,
            };
            console.log("Saving updated course", newEditedCourse);
            const response = await UpdateCourse(course._id, newEditedCourse);
            if (response?.error) {
                toast.error(response.error);
            }
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {

        const confirmDelete = window.confirm("Are you sure you want to delete this course?");


        if (confirmDelete) {
            try {
                const response = await DeleteCourse(course._id);
                if (response.status === 200) {
                    toast.success("Course deleted successfully");
                    window.location.href = "/courses";
                }
                console.log('Course deleted successfully');
            } catch (err) {
                console.error('Error deleting course:', err);
            }
        } else {

            console.log('Course deletion canceled');
        }
    };

    const handleEditChapter = (chapter) => {
        setEditingChapter(chapter._id);
        setEditedChapterTitle(chapter.title);
    };

    const handleSaveChapter = async (chapterId) => {
        try {
            const formData = new FormData();
            formData.append('chapterTitle', editedChapterTitle);
            formData.append('title', course.title);
            formData.append('courseId', course._id);
            newFiles.forEach((file, index) => {
                formData.append('files', file);
                formData.append('fileOrders', newFiles[index].order);
            })
            console.log("Title:", course.title);
            console.log("Chapter Title:", editedChapterTitle);


            console.log("Saving updated chapter", formData);
            const response = await UpdateChapter(chapterId, formData);
            if (response?.error) {
                toast.error(response.error);
            } else if (response.status === 200) {
                toast.success("Chapter updated successfully")
                setEditingChapter(null);
                setNewFiles([]);
                window.location.reload();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteChapter = async (chapterId) => {
        // Show confirmation alert before proceeding
        const confirmDelete = window.confirm("Are you sure you want to delete this chapter?");

        if (confirmDelete) {
            try {
                const response = await DeleteChapter(chapterId, { courseId: course._id });
                if (response.status === 200) {
                    toast.success("Chapter deleted successfully");
                    window.location.reload();
                }
                console.log('Chapter deleted successfully');
            } catch (err) {
                console.error('Error deleting chapter:', err);
            }
        } else {
            // If the user cancels, do nothing
            console.log('Chapter deletion canceled');
        }
    };

    const handleFileSelect = (e) => {
        const selectedFiles = e.files;
        const uniqueFiles = selectedFiles.filter(
            (file) => !newFiles.some((existingFile) => existingFile.name === file.name)
        );

        if (uniqueFiles.length > 0) {
            setNewFiles((prevFiles) => [...prevFiles, ...uniqueFiles]);
            toast.success(`${uniqueFiles.length} new file(s) added successfully.`);
        } else {
            toast.error('File(s) already added.');
        }
    };

    const handleFileRemove = (file) => {
        setNewFiles((prevFiles) => prevFiles.filter((f) => f !== file));
        toast.success(`${file.name} removed successfully.`);
    };
    const handleEditFile = (file) => {
        setEditingFile(file._id);
        setEditedFileTitle(file.title);
        setEditedFileOrder(file.order)
    };

    const handleSaveFile = async (fileId) => {
        try {

            const newEditedFile = {
                title: editedFileTitle,
                order: editedFileOrder,
                courseId: course._id
            }

            console.log("Saving updated file", newEditedFile);
            const response = await UpdateFile(fileId, newEditedFile);
            if (response?.error) {
                toast.error(response.error);
            }
            setEditingFile(null);
        }
        catch (err) {
            console.error(err);
        }
    };

    const handleDeleteFile = async (chapterId, fileId) => {
        // Show confirmation alert before proceeding
        const confirmDelete = window.confirm("Are you sure you want to delete this file?");

        if (confirmDelete) {
            try {
                const response = await DeleteFile(fileId, { chapterId, courseId: course._id });
                if (response.status === 200) {
                    toast.success("File deleted successfully");
                    window.location.reload();
                }
                console.log('File deleted successfully');
            } catch (err) {
                console.error('Error deleting file:', err);
            }
        } else {
            // If the user cancels, do nothing
            console.log('File deletion canceled');
        }
    };


    const getFileUrl = (file) => {
        if (file) {
            if (typeof file === 'string') {
                const formattedFile = file.replace(/\\/g, '/');
                return `${process.env.REACT_APP_API_HOST}/${encodeURIComponent(formattedFile)}`;
            } else if (file instanceof File) {
                return URL.createObjectURL(file);
            }
        }
        return null;
    };

    if (!course) {
        return <p>Loading...</p>;
    }

    const sortedChapters = sortChapters(course.chapters);

    return (
        <div className="layout-main">
            <div className="layout-content">
                {/* Banner Section */}
                <div className="banner" style={{ backgroundImage: `url(${getFileUrl(course.thumbnail)})` }}>
                    <div className="banner-overlay">
                        {isEditing ? (
                            <InputText
                                value={editedCourse.title}
                                onChange={(e) => setEditedCourse({ ...editedCourse, title: e.target.value })}
                                placeholder="Course Title"
                                className="p-inputtext-sm"
                            />
                        ) : (
                            <h1 className="course-title">{course.title || 'Unknown Title'}</h1>
                        )}
                        <div className="tags-container">
                            {isEditing ? (
                                <Chips
                                    value={editedCourse.skillTags}
                                    onChange={(e) => setEditedCourse({ ...editedCourse, skillTags: e.value })}
                                    placeholder="Add Tags"
                                    className="p-inputtext-sm"
                                />
                            ) : (
                                course.skillTags && course.skillTags.map((tag, idx) => (
                                    <Tag key={idx} value={tag} className="p-tag-rounded" />
                                ))
                            )}
                        </div>
                        <div className="SkillExpert_container">
                            <p>
                                Offered By: {course.skillExpert?.username ? (
                                    <Link to={`/profile/${course.skillExpert?._id}`}>{course.skillExpert?.username}</Link>
                                ) : "unknown"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                <div className="desc_container">
                    <h4>Description :</h4>
                    {isEditing ? (
                        <InputTextarea
                            value={editedCourse.description}
                            onChange={(e) => setEditedCourse({ ...editedCourse, description: e.target.value })}
                            placeholder="Course Description"
                            className="p-inputtext-sm"
                        />
                    ) : (
                        <p>{course.description ? course.description : "No Description"}</p>
                    )}
                </div>

                {/* Price and Buy Button Section */}
                <div className="price_container">
                    {isEditing ? (
                        <InputNumber
                            value={editedCourse.price}
                            onChange={(e) => setEditedCourse({ ...editedCourse, price: e.value })}
                            placeholder="Price"
                            className="p-inputtext-sm"
                        />
                    ) : (
                        <span>Price: {course.price}$</span>
                    )}

                    {userId === course.skillExpert?._id ? (
                        <>
                            <Button
                                icon="pi pi-trash"
                                label="Delete Course"
                                className="p-button-danger p-button-rounded"
                                onClick={handleDelete}
                            />
                            <Button
                                icon="pi pi-pencil"
                                label="Edit Course"
                                className="p-button-rounded"
                                onClick={handleEdit}
                            />
                            <Button label="Cancel" className="p-button-rounded" icon="pi pi-times" onClick={() => setIsEditing(false)} />
                            <Link to={`/addChapter/${course._id}`} state={{ title: course.title }}><Button label="Add Chapter" className="p-button-rounded" icon="pi pi-plus" /></Link>
                        </>
                    ) : (
                        <Button icon="pi pi-shopping-cart" label="Buy Course" className="p-button-rounded" />
                    )}
                    {isEditing && (
                        <Button
                            icon="pi pi-save"
                            label="Save"
                            className="p-button-success p-button-rounded"
                            onClick={handleSave}
                        />
                    )}
                </div>

                {/* Chapters Section */}
                <div className="chapters-container">
                    <h4>Chapters:</h4>
                    {sortedChapters && sortedChapters.length > 0 ? (
                        <>
                            {sortedChapters.map((chapter) =>
                                editingChapter === chapter._id ? (

                                    <div key={chapter._id}>
                                        <InputText
                                            value={editedChapterTitle}
                                            onChange={(e) => setEditedChapterTitle(e.target.value)}
                                        />
                                        {chapter.files && chapter.files.length + newFiles.length < 10 && (
                                            <div className="form-field">
                                                <label>Add Files</label>
                                                <FileUpload

                                                    name="Files"
                                                    multiple
                                                    accept="video/*,application/pdf"
                                                    maxFileSize={100000000}
                                                    customUpload
                                                    uploadHandler={handleFileSelect}
                                                    onRemove={handleFileRemove}
                                                    onClear={() => setNewFiles([])}
                                                    emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
                                                    chooseLabel="Add Files"
                                                    className="file-upload"
                                                />
                                            </div>
                                        )}
                                        <>
                                            <Button
                                                icon="pi pi-save"
                                                label="Save Chapter"
                                                style={{ marginLeft: '1rem' }}
                                                onClick={() => handleSaveChapter(chapter._id)}
                                            />
                                            <Button
                                                icon="pi pi-plus"
                                                label="Add File"
                                                style={{ marginLeft: '1rem' }}
                                            />
                                            <Button
                                                label="Cancel"
                                                icon="pi pi-times"
                                                style={{ marginLeft: '1rem' }}
                                                onClick={() => setEditingChapter(null)}
                                            />
                                        </>

                                        {newFiles.length > 0 && newFiles.map((file, index) => (
                                            <li key={index}>
                                                <div className='flex mt-2'>
                                                    <span className="file-item">
                                                        {/* Default title and icon based on file type */}
                                                        <i
                                                            className={
                                                                file.type === "application/pdf"
                                                                    ? "pi pi-file-pdf"
                                                                    : file.type.startsWith("video/")
                                                                        ? "pi pi-play"
                                                                        : "pi pi-file"
                                                            }
                                                        ></i>
                                                        {/* Use file name as title */}
                                                        {file.title || file.name}
                                                    </span>
                                                    <InputNumber
                                                        value={file.order}
                                                        onValueChange={(e) => {
                                                            const updatedFiles = [...newFiles];
                                                            updatedFiles[index].order = e.value;
                                                            setNewFiles(updatedFiles);
                                                        }}
                                                        defaultValue={1}
                                                        min={1}
                                                        max={10}
                                                        placeholder="Set file order"
                                                        style={{ marginLeft: "1rem", width: "5rem" }}
                                                        showButtons
                                                        buttonLayout="horizontal"
                                                    />
                                                </div>
                                            </li>
                                        ))}
                                        {chapter.files && chapter.files.length > 0 && (
                                            <>
                                                <h5>Files:</h5>
                                                <ul style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                                    {sortFiles(chapter.files).map((file) => (
                                                        <li key={file._id}>
                                                            <div>
                                                                {editingFile === file._id ? (
                                                                    <>
                                                                        <InputText
                                                                            value={editedFileTitle}
                                                                            onChange={(e) => setEditedFileTitle(e.target.value)}
                                                                        />
                                                                        <InputNumber
                                                                            value={editedFileOrder}
                                                                            onValueChange={(e) => setEditedFileOrder(e.value)}
                                                                            min={1}
                                                                            max={10}
                                                                            placeholder="Set file order"
                                                                            style={{ marginLeft: "1rem", width: "5rem" }}
                                                                            showButtons
                                                                            buttonLayout="horizontal"
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <span className="file-item">
                                                                        <i
                                                                            className={
                                                                                file.type === "PDF"
                                                                                    ? "pi pi-file-pdf"
                                                                                    : "pi pi-play"
                                                                            }
                                                                        ></i>
                                                                        {file.title}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {editingFile === file._id ? (
                                                                <>
                                                                    <Button
                                                                        icon="pi pi-save"
                                                                        label="Save File"
                                                                        onClick={() => handleSaveFile(file._id)}
                                                                    />
                                                                    <Button
                                                                        label="Cancel"
                                                                        icon="pi pi-times"
                                                                        style={{ marginLeft: "1rem" }}
                                                                        onClick={() => setEditingFile(null)}
                                                                    />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Button
                                                                        icon="pi pi-pencil"
                                                                        label="Edit File"
                                                                        onClick={() => handleEditFile(file)}
                                                                    />
                                                                    <Button
                                                                        icon="pi pi-trash"
                                                                        label="Delete File"
                                                                        style={{ marginLeft: "1rem" }}
                                                                        onClick={() =>
                                                                            handleDeleteFile(chapter._id, file._id)
                                                                        }
                                                                    />
                                                                </>
                                                            )}
                                                        </li>
                                                    ))}

                                                </ul>
                                            </>
                                        )}
                                    </div>
                                ) : (

                                    <Accordion key={chapter._id}>
                                        <AccordionTab
                                            key={chapter._id}
                                            className=".custom-tab-header"
                                            header={chapter.title}
                                        >
                                            <div>
                                                <h5>{chapter.title}</h5>
                                                {
                                                    userId === course.skillExpert?._id && (
                                                        <>
                                                            <Button
                                                                icon="pi pi-pencil"
                                                                label="Edit Chapter"
                                                                onClick={() => handleEditChapter(chapter)}
                                                            />
                                                            <Button
                                                                icon="pi pi-trash"
                                                                label="Delete Chapter"
                                                                style={{ marginLeft: "1rem" }}
                                                                onClick={() => handleDeleteChapter(chapter._id)}
                                                            />
                                                        </>
                                                    )
                                                }


                                                {chapter.files && chapter.files.length > 0 && (
                                                    <>
                                                        <h5>Files:</h5>
                                                        <ul
                                                            style={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                alignItems: "flex-start",
                                                            }}
                                                        >
                                                            {sortFiles(chapter.files).map((file) => (
                                                                <li key={file._id}>
                                                                    <span className="file-item">
                                                                        <i
                                                                            className={
                                                                                file.type === "PDF"
                                                                                    ? "pi pi-file-pdf"
                                                                                    : "pi pi-play"
                                                                            }
                                                                        ></i>
                                                                        {file.title}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </>
                                                )}
                                            </div>
                                        </AccordionTab>
                                    </Accordion>
                                )
                            )}
                        </>
                    ) : (
                        <p>No chapters available</p>
                    )}
                </div>

            </div>
        </div >
    );
}

export default CourseDetails;
