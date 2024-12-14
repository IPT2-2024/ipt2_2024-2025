export const subjectColumns = [
  {
    title: <span style={{ color: '#1890ff' }}>Subject Code</span>,
    dataIndex: "subject_code",
    key: "subject_code",
    width: "15%",
  },
  {
    title: <span style={{ color: '#1890ff' }}>Subject Name</span>,
    dataIndex: "subject_name",
    key: "subject_name",
    width: "20%",
  },
  {
    title: <span style={{ color: '#1890ff' }}>Classification</span>,  
    dataIndex: "classification",  
    key: "classification",  
    width: "15%",  
  },
  {
    title: <span style={{ color: '#1890ff' }}>Description</span>,
    dataIndex: "subject_description",
    key: "subject_description",
    width: "20%",
  },
  {
    title: <span style={{ color: '#1890ff' }}>Units</span>,
    dataIndex: "units",
    key: "units",
    width: "15%",
  },
  
  {
    title: <span style={{ color: '#1890ff' }}>Availability</span>,
    dataIndex: "availability",
    key: "availability",
    width: "15%",
    render: (availability) => (availability ? "Available" : "Not Available"),
  },
  
];
