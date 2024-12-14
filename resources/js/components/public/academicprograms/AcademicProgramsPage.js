import React, { useState } from "react";
import { message, Select, Divider, Row, Col, Modal } from "antd";
import MainDashboard from "../dashboard/components/MainDashboard";
import useDepartments from "../academicprograms/components/useDepartments";
import useCollegePrograms from "../academicprograms/components/useCollegePrograms";
import AcademicProgramTable from "../academicprograms/components/AcademicProgramTable";
import useSubjects from "../academicprograms/components/useSubjects";
import SetButton from "../academicprograms/components/SetButton";
import useCurriculums from "../academicprograms/components/useCurriculum";

const { Option } = Select;

const AcademicProgramsPage = () => {
    const token = localStorage.getItem("auth_token");
    const {
        departments,
        loading: loadingDepartments,
        error: departmentError,
    } = useDepartments(token);
    const {
        collegePrograms,
        loading: loadingPrograms,
        error: programError,
        fetchCollegePrograms,
    } = useCollegePrograms(token);
    const {
        subjects,
        dropdownSubjects,
        loading: loadingSubjects,
        error: subjectsError,
    } = useSubjects(token);
    const {
        curriculums,
        loading: loadingCurriculums,
        error: curriculumError,
    } = useCurriculums(token);

    const [department, setDepartment] = useState(null);
    const [collegeProgram, setCollegeProgram] = useState(null);
    const [subject, setSubject] = useState(null);
    const [curriculum, setCurriculum] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalDepartment, setModalDepartment] = useState(null);
    const [modalCollegeProgram, setModalCollegeProgram] = useState(null);
    

    const handleDepartmentChange = (value) => {
        setDepartment(value);
        setCollegeProgram(null);
        if (value) {
            fetchCollegePrograms(value);
        }
    };

    const handleProgramChange = (value) => {
        setCollegeProgram(value);
    };

    const handleSubjectChange = (value) => {
        setSubject(value);
    };

    const handleCurriculumChange = (value) => {
        setCurriculum(value);
    };

    const handleSetButtonClick = () => {
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };
    const handleModalDepartmentChange = (value) => {
        setModalDepartment(value);
        setModalCollegeProgram(null);
        if (value) {
            fetchCollegeProgramsForModal(value); // Ensure this fetches programs based on modal's department
        }
    };
    const fetchCollegeProgramsForModal = (value) => {
        setModalCollegeProgram(value);
    };
    
    const handleModalProgramChange = (value) => {
        setModalCollegeProgram(value);
    };

    return (
        <MainDashboard>
            <div style={{ background: "#fff" }}>
                <h3 style={{ marginBottom: "20px" }}>
                    Academic Program Management
                </h3>

                {departmentError && (
                    <div style={{ color: "red" }}>{departmentError}</div>
                )}

                <Row
                    gutter={16}
                    align="middle"
                    style={{ marginBottom: "20px" }}
                >
                    <Col span={8}>
                        <Select
                            placeholder="Select Department"
                            style={{ width: "100%" }}
                            onChange={handleDepartmentChange}
                            value={department}
                            disabled={loadingDepartments}
                        >
                            {departments.map((department) => (
                                <Option
                                    key={department.id}
                                    value={department.id}
                                >
                                    {department.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                    <Col span={8}>
                        {programError && (
                            <div style={{ color: "red" }}>{programError}</div>
                        )}
                        <Select
                            placeholder="Select College Program"
                            style={{ width: "100%" }}
                            onChange={handleProgramChange}
                            value={collegeProgram}
                            disabled={!department || loadingPrograms}
                        >
                            {collegePrograms.map((programItem) => (
                                <Option
                                    key={programItem.id}
                                    value={programItem.id}
                                >
                                    {programItem.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                    <Col span={8} style={{ textAlign: "right" }}>
                        <SetButton onClick={handleSetButtonClick} />
                    </Col>
                </Row>

                <Divider style={{ margin: "20px 0", borderColor: "#ddd" }} />

                <AcademicProgramTable
                    subjects={subjects}
                    loading={loadingSubjects}
                    error={subjectsError}
                />

                <Modal
                    title="Course Curriculum Setup"
                    visible={modalVisible}
                    onCancel={handleModalClose}
                    footer={null}
                    destroyOnClose
                    centered
                >
                    <Row gutter={16} style={{ marginBottom: "16px" }}>
                        <Col span={24}>
                            <h5
                                style={{
                                    fontSize: "14px",
                                    marginBottom: "8px",
                                }}
                            >
                                Department
                            </h5>
                            <Select
                                placeholder="Select Department"
                                style={{ width: "100%" }}
                                onChange={handleModalDepartmentChange}
                                value={modalDepartment}
                                disabled={loadingDepartments}
                            >
                                {departments.map((department) => (
                                    <Option
                                        key={department.id}
                                        value={department.id}
                                    >
                                        {department.name}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginBottom: "16px" }}>
                        <Col span={24}>
                            <h5
                                style={{
                                    fontSize: "14px",
                                    marginBottom: "8px",
                                }}
                            >
                                College Program
                            </h5>
                            <Select
                                placeholder="Select College Program"
                                style={{ width: "100%" }}
                                onChange={handleModalProgramChange}
                                value={modalCollegeProgram}
                                disabled={!modalDepartment || loadingPrograms}
                            >
                                {collegePrograms.map((programItem) => (
                                    <Option
                                        key={programItem.id}
                                        value={programItem.id}
                                    >
                                        {programItem.name}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginBottom: "16px" }}>
                        <Col span={24}>
                            <h5
                                style={{
                                    fontSize: "14px",
                                    marginBottom: "8px",
                                }}
                            >
                                Subject
                            </h5>
                            <Select
                                placeholder="Select Subject"
                                style={{ width: "100%" }}
                                onChange={handleSubjectChange}
                                value={subject}
                                disabled={loadingSubjects}
                            >
                                {dropdownSubjects.map((subjectItem) => (
                                    <Option
                                        key={subjectItem.id}
                                        value={subjectItem.id}
                                    >
                                        {subjectItem.name}{" "}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginBottom: "16px" }}>
                        <Col span={24}>
                            <h5
                                style={{
                                    fontSize: "14px",
                                    marginBottom: "8px",
                                }}
                            >
                                Curriculum
                            </h5>
                            <Select
                                placeholder="Select Curriculum"
                                style={{ width: "100%" }}
                                onChange={handleCurriculumChange}
                                value={curriculum}
                                disabled={loadingCurriculums}
                            >
                                {curriculums.map((curriculumItem) => (
                                    <Option
                                        key={curriculumItem.id}
                                        value={curriculumItem.id}
                                    >
                                        {curriculumItem.code}{" "}
                                        {curriculumItem.objective}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                </Modal>
            </div>
        </MainDashboard>
    );
};

export default AcademicProgramsPage;
