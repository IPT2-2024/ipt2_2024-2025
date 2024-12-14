import React from "react";
import { Table, Empty } from "antd";
import { subjectColumns } from "./subjectColumns";

const AcademicProgramTable = ({ subjects, loading, error }) => {
    const dataWithKeys = Array.isArray(subjects)
        ? subjects.map((subject, index) => ({
              ...subject,
              key: subject.id || `subject-${index}`, // Unique fallback key
          }))
        : [];

    return (
        <div style={{ padding: "20px", background: "#fff" }}>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {dataWithKeys.length === 0 && !loading ? (
                <Empty description="No subjects available" />
            ) : (
                <Table
                    columns={subjectColumns}
                    dataSource={dataWithKeys}
                    pagination={false}
                    bordered
                    loading={loading}
                    rowClassName="standard-row"
                />
            )}
        </div>
    );
};

export default AcademicProgramTable;
