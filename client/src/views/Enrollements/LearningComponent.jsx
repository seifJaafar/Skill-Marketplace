import React, { useState, useEffect } from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import { Button } from "primereact/button";
import "../../assets/learningComponent.css"; // Custom CSS file
import { useParams } from "react-router-dom";
import { GetCourseById } from "../../actions/courses.action";

function LearningComponent(props) {
    const { id } = useParams()
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [chapters, setChapters] = useState([]);
    console.log(chapters)
    console.log(props)
    // Render file viewer (Video or PDF)*
    const fetchCourse = async () => {
        const response = await GetCourseById(id);
        if (response.error) {
            console.error(response.error);
        } else {
            console.log(response)
            setChapters(response.course.chapters)
        }
    }
    useEffect(() => {
        fetchCourse();
    }, [id]);
    const getFileUrl = (file) => {
        if (file) {
            if (typeof file === 'string') {
                // If file is already a URL (string), return as is
                return `${process.env.REACT_APP_API_HOST}/${file}`;
            } else if (file instanceof File) {
                // If file is a File object, use local URL
                return URL.createObjectURL(file);  // Create object URL for local file
            }
        }
        return null;
    };
    const renderFileViewer = () => {
        if (!selectedFile) {
            return <p>Select a file to view its content.</p>;
        }

        if (selectedFile.type === "video") {
            return (
                <video controls width="100%" height="500px">
                    <source src={getFileUrl(selectedFile.url)} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            );
        }

        if (selectedFile.type === "pdf") {
            return (
                <iframe
                    src={getFileUrl(selectedFile.url)}
                    width="100%"
                    height="500px"
                    title="PDF Viewer"
                    frameBorder="0"
                />
            );
        }

        return <p>Unsupported file type.</p>;
    };

    return (
        <div className="layout-main">
            <div className="layout-main__content">
                <h1 className="mb-4">Learning</h1>
                <div className="learning-container">
                    {/* Right-side scroller */}
                    <div className="learning-scroller">
                        <ScrollPanel style={{ height: "600px" }}>
                            {chapters.length > 0 ? (
                                chapters.map((chapter, index) => (
                                    <div key={chapter.id} className="chapter-item">
                                        <Button
                                            label={`Chapter ${index + 1}: ${chapter.title}`}
                                            className="p-button-text p-button-lg"
                                            onClick={() => setSelectedChapter(chapter)}
                                        />
                                        {selectedChapter?.id === chapter.id && (
                                            <div className="files-list">
                                                {chapter.files.map((file) => (
                                                    <Button
                                                        key={file._id}
                                                        label={file.title}
                                                        style={{ backgroundColor: 'transparent', textAlign: 'left' }}
                                                        icon={
                                                            file.type === "Video"
                                                                ? "pi pi-video"
                                                                : "pi pi-file-pdf"
                                                        }
                                                        className="p-button-text file-button"
                                                        onClick={() => setSelectedFile(file)}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No chapters available to display.</p>
                            )}
                        </ScrollPanel>
                    </div>

                    {/* File viewer */}
                    <div className="file-viewer">
                        {renderFileViewer()}
                    </div>
                </div>

            </div>
        </div>
    );

}

export default LearningComponent;
