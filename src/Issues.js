import React, { useState, useEffect, Fragment } from "react";
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Issues = () => {
    //for new user
    const [userId, setUserId] = useState('');
    const [bookId, setBookId] = useState('');

    const [data, setData] = useState([]);
    useEffect(() => {
        getData();
    }, [])
    const getData = () => {
        axios.get('https://localhost:7185/api/issues')
            .then((result) => {
                setData(result.data);
            })
            .catch((error) => {
                console.log('Error in fetching the data');
            })
    }
    const handleReturn = (id) => {
        axios.put(`https://localhost:7185/api/issues/return/${id}`)
            .then((result) => {
                getData();
                toast.success('Book has been returned by the user');
            })
            .catch((error) => {
                toast.error('Error in returning the book');
            })
    }
    const handleReissue = (id) => {
        axios.put(`https://localhost:7185/api/issues/reissue/${id}`)
            .then((result) => {
                getData();
                toast.success('Book has been reissued by the user');
            })
            .catch((error) => {
                toast.error('Error in reissuing the book');
            })
    }
    const handleSave = () => {
        const url = 'https://localhost:7185/api/issues';
        const data = {
            "userId": userId,
            "bookId": bookId
        }
        axios.post(url, data)
            .then((result) => {
                getData();
                clear();
                toast.success('Book has been issued by the user');
            })
            .catch((error) => {
                toast.error("Error in issuing the book");
            })
    }
    const clear = () => {
        setUserId('');
        setBookId('');
    }
    return (
        <Fragment>
            <ToastContainer />
            <Container>
                <Row>
                    <Col>
                        <input type="number" className="form-control" placeholder="Enter User Id" value={userId} onChange={(e) => setUserId(e.target.value)} />
                    </Col>
                    <Col>
                        <input type="text" className="form-control" placeholder="Enter Book Id" value={bookId} onChange={(e) => setBookId(e.target.value)} />
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
                        <th>User Id</th>
                        <th>Book Id</th>
                        <th>Issue Date</th>
                        <th>Return Date</th>
                        <th>Due Date</th>
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
                                        <td>{item.userId}</td>
                                        <td>{item.bookId}</td>
                                        <td>{item.issueDate}</td>
                                        <td>{item.returnDate}</td>
                                        <td>{item.dueDate}</td>
                                        <td colSpan={2}>
                                            {item.returnDate === null &&
                                                <>
                                                    <button className="btn btn-primary" onClick={() => handleReissue(item.id)}>Reissue</button> &nbsp;
                                                    <button className="btn btn-primary" onClick={() => handleReturn(item.id)}>Return</button>
                                                </>
                                            }
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            'Loading...'
                    }
                </tbody>
            </Table>
        </Fragment>
    )
}

export default Issues;