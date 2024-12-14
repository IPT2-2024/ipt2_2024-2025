import { useState, useEffect } from "react";
import axios from "axios";

const useSubjects = (token) => {
    const [subjects, setSubjects] = useState([]);  // To store the full subjects data
    const [dropdownSubjects, setDropdownSubjects] = useState([]);  // To store transformed data for the dropdown
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get("/api/subject", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                
                
                // Store the full response data
                setSubjects(response.data);

                // Map the response to extract the id and subject_name for dropdown
                const subjectArray = response.data.map(subject => ({
                    id: subject.id,
                    name: subject.subject_name,  // Using subject_name from the response
                }));

                // Set the dropdown data
                setDropdownSubjects(subjectArray);
            } catch (err) {
                const errorMessage = err.response?.data?.message || "Failed to fetch subjects.";
                setError(errorMessage);
                setSubjects([]); 
                setDropdownSubjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, [token]);

    return { subjects, dropdownSubjects, loading, error };
};

export default useSubjects;
