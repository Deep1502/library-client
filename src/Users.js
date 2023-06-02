import React, { useState, useEffect, Fragment } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Users = () => {
    const [show, setShow] = useState(false);
    const [showUserIssues, setShowUserIssues] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleUserIssueClose = () => setShowUserIssues(false);
    //for new user
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNo, setContactNo] = useState('');
    //for edit user
    const [editId, setEditId] = useState('');
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editContactNo, setEditContactNo] = useState('');
    //store data
    const [data, setData] = useState([]);
    const [userIssues, setUserIssues] = useState([]);
    useEffect(() => {
        getData();
    }, [])
    const getData = () => {
        axios.get('https://localhost:7185/api/users')
            .then((result) => {
                setData(result.data);
            })
            .catch((error) => {
                toast.error('Error in fetching the data');
            })
    }
    const handleEdit = (id) => {
        handleShow();
        axios.get(`https://localhost:7185/api/users/${id}`)
            .then((result) => {
                setEditId(id);
                setEditName(result.data.name);
                setEditEmail(result.data.email);
                setEditContactNo(result.data.contactNo);
            })
            .catch((error) => {
                toast.error('Error in fetching the user details')
            })
    }
    const handleDelete = (id) => {
        if (window.confirm("Are you sure to delete this user?") == true) {
            axios.delete(`https://localhost:7185/api/users/${id}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success('User has been deleted');
                        getData();
                    }
                })
                .catch((error) => {
                    toast.error('Error in deleting the user');
                })
        }
    }
    const handleUpdate = () => {
        const url = `https://localhost:7185/api/users/${editId}`;
        const data = {
            "id": editId,
            "name": editName,
            "email": editEmail,
            "contactNo": editContactNo
        }
        axios.put(url, data)
            .then((result) => {
                handleClose();
                getData();
                clear();
                toast.success('User has been updated');
            })
            .catch((error) => {
                toast.error('Error in updating the user');
            })
    }
    const handleSave = () => {
        const url = 'https://localhost:7185/api/users';
        const data = {
            "name": name,
            "email": email,
            "contactNo": contactNo
        }
        axios.post(url, data)
            .then((result) => {
                getData();
                clear();
                toast.success('User has been added');
            })
            .catch((error) => {
                toast.error('Error in adding the data');
            })
    }
    const clear = () => {
        setName('');
        setEmail('');
        setContactNo('');
        setEditId('');
        setEditName('');
        setEditEmail('');
        setEditContactNo('');
    }
    const handleUserIssue = (id) => {
        axios.get(`https://localhost:7185/api/issues/userissues/${id}`)
            .then((result) => {
                setUserIssues(result.data);
                setShowUserIssues(true);
            })
            .catch((error) => {
                toast.error('Error in fetching the user issues data');
            })
    }
    return (
        <Fragment>
            <ToastContainer />
            <Container>
                <Row>
                    <Col>
                        <input type="text" className="form-control" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
                    </Col>
                    <Col>
                        <input type="email" className="form-control" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Col>
                    <Col>
                        <input type="number" className="form-control" placeholder="Enter ContactNo" value={contactNo} onChange={(e) => setContactNo(e.target.value)} />
                    </Col>
                    <Col>
                        <button className="btn btn-primary" onClick={() => handleSave()}>Submit</button>
                    </Col>
                </Row>
            </Container>
            <br></br>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Sr. No.</th>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact No.</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data && data.length > 0 ?
                            data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>{item.contactNo}</td>
                                        <td colSpan={2}>
                                            <button className="btn btn-primary" onClick={() => handleUserIssue(item.id)}>Issued Books</button> &nbsp;
                                            <button className="btn btn-primary" onClick={() => handleEdit(item.id)}>Edit</button> &nbsp;
                                            <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            'Loading...'
                    }
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <input type="text" className="form-control" placeholder="Enter Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="email" className="form-control" placeholder="Enter Email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="number" className="form-control" placeholder="Enter ContactNo" value={editContactNo} onChange={(e) => setEditContactNo(e.target.value)} />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showUserIssues} onHide={handleUserIssueClose}>
                <Modal.Header closeButton>
                    <Modal.Title>User Issues</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>IssueId</th>
                                <th>BookId</th>
                                <th>IssueDate</th>
                                <th>DueDate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                userIssues && userIssues.length > 0 ?
                                    userIssues.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.id}</td>
                                                <td>{item.bookId}</td>
                                                <td>{item.issueDate}</td>
                                                <td>{item.dueDate}</td>
                                            </tr>
                                        )
                                    })
                                    :
                                    'No Issues...'
                            }
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleUserIssueClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}

export default Users;