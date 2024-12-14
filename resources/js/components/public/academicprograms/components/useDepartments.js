import { useState, useEffect } from "react";
import axios from "axios";

const useDepartments = (token) => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDepartments = async () => {
            if (!token) {
                setError("Authentication token is missing. Please log in.");
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await axios.get("/api/department", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const departmentsArray = response.data.map(department => ({
                    id: department.id,
                    name: department.department_name,
                }));
                setDepartments(departmentsArray);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, [token]);

    return { departments, loading, error };
};

export default useDepartments;
