import { useState, useEffect } from "react";
import axios from "axios";

const useCurriculums = (token) => {
    const [curriculums, setCurriculums] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCurriculums = async () => {
            if (!token) {
                setError("Authentication token is missing. Please log in.");
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await axios.get("/api/curriculum", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const curriculumsArray = response.data.map(curriculum => ({
                    id: curriculum.id,
                    code: curriculum.curriculum_code,
                    objective: curriculum.objective,
                    type: curriculum.curriculum_type,
                    resources: curriculum.resources,
                    prerequisite: curriculum.prerequisite,
                    assessment: curriculum.assessment,
                    method: curriculum.method,
                    content: curriculum.content,
                    numberOfHours: curriculum.number_of_hours,
                }));
                setCurriculums(curriculumsArray);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCurriculums();
    }, [token]);

    return { curriculums, loading, error };
};

export default useCurriculums;
