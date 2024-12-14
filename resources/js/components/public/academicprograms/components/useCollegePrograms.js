import { useState } from "react";
import axios from "axios";

const useCollegePrograms = (token) => {
    const [collegePrograms, setCollegePrograms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCollegePrograms = async (departmentId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/collegeprogram/department/${departmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.headers['content-type'].includes('application/json')) {
                const programs = response.data.map((programItem) => ({
                    id: programItem.id,
                    name: programItem.college_programs,
                }));
                setCollegePrograms(programs.length > 0 ? programs : []);
            } else {
                setError("The response is not in JSON format.");
            }
        } catch (error) {
            setError("Failed to fetch college programs.");
            setCollegePrograms([]);
        } finally {
            setLoading(false);
        }
    };
    const fetchCollegeProgramsForModal = async (departmentId) => {
        try {
            const response = await axios.get(`/api/collegeprogram/department/${departmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (response.headers['content-type'].includes('application/json')) {
                const programs = response.data.map((programItem) => ({
                    id: programItem.id,
                    name: programItem.college_programs,
                }));
                setModalCollegePrograms(programs.length > 0 ? programs : []);
            } else {
                setError("The response is not in JSON format.");
            }
        } catch (error) {
            setError("Failed to fetch college programs.");
            setModalCollegePrograms([]); // Ensure modal is cleared on error
        }
    };
    

    return { collegePrograms, loading, error, fetchCollegePrograms , fetchCollegeProgramsForModal, };
};

export default useCollegePrograms;
