import { useState } from "react";
import axios from "axios";

const useCurriculumsForSubject = (token) => {
    const [curriculums, setCurriculums] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCurriculums = async (subjectId) => {
        if (!subjectId) return; 
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`/api/subjectcurriculum/${subjectId}/curriculum`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Log the entire response to see the array content
            console.log("Curriculum Response:", response.data);

            if (response.headers['content-type'].includes('application/json')) {
                const curriculumsData = response.data.map((curriculumItem) => ({
                    id: curriculumItem.id,
                    name: curriculumItem.curriculum_name, // Adjust the field name if necessary
                }));

                setCurriculums(curriculumsData.length > 0 ? curriculumsData : []);
            } else {
                setError("The response is not in JSON format.");
            }
        } catch (err) {
            // Log the actual error for better debugging
            console.error("Error fetching curriculums:", err);
            setError("Failed to fetch curriculums.");
            setCurriculums([]); // Clear curriculums in case of error
        } finally {
            setLoading(false);
        }
    };

    return { curriculums, loading, error, fetchCurriculums };
};

export default useCurriculumsForSubject;
