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

const Books = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    //for new user
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState('');
    const [copies, setCopies] = useState('');
    //for edit user
    const [editId, setEditId] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editAuthor, setEditAuthor] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editCopies, setEditCopies] = useState('');

    const [data, setData] = useState([]);
    useEffect(() => {
        getData();
    }, [])
    const getData = () => {
        axios.get('https://localhost:7185/api/books')
            .then((result) => {
                setData(result.data);
            })
            .catch((error) => {
                toast.error('Error in fetching the data');
            })
    }
    const handleEdit = (id) => {
        handleShow();
        axios.get(`https://localhost:7185/api/books/${id}`)
            .then((result) => {
                setEditId(id);
                setEditTitle(result.data.title);
                setEditAuthor(result.data.author);
                setEditPrice(result.data.price);
                setEditCopies(result.data.copies);
            })
            .catch((error) => {
                toast.error('Error in fetching the book data')
            })
    }
    const handleDelete = (id) => {
        if (window.confirm("Are you sure to remove this book and all its copies?") == true) {
            axios.delete(`https://localhost:7185/api/books/${id}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success('Book has been removed');
                        getData();
                    }
                })
                .catch((error) => {
                    toast.error('Error in deleting the book');
                })
        }
    }
    const handleUpdate = () => {
        const url = `https://localhost:7185/api/books/${editId}`;
        const data = {
            "id": editId,
            "title": editTitle,
            "author": editAuthor,
            "price": editPrice,
            "copies": editCopies
        }
        axios.put(url, data)
            .then((result) => {
                handleClose();
                getData();
                clear();
                toast.success('Book has been updated');
            })
            .catch((error) => {
                toast.error('Error in updating the book');
            })
    }
    const handleSave = () => {
        const url = 'https://localhost:7185/api/books';
        const data = {
            "title": title,
            "author": author,
            "price": price,
            "copies": copies
        }
        axios.post(url, data)
            .then((result) => {
                getData();
                clear();
                toast.success('Book has been added with the copies');
            })
            .catch((error) => {
                toast.error('Error in adding the book');
            })
    }
    const clear = () => {
        setTitle('');
        setAuthor('');
        setPrice('');
        setCopies('');
        setEditId('');
        setEditTitle('');
        setEditAuthor('');
        setEditPrice('');
        setEditCopies('');
    }
    return (
        <Fragment>
            <ToastContainer />
            <Container>
                <Row>
                    <Col>
                        <input type="text" className="form-control" placeholder="Enter Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </Col>
                    <Col>
                        <input type="text" className="form-control" placeholder="Enter Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                    </Col>
                    <Col>
                        <input type="number" className="form-control" placeholder="Enter Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </Col>
                    <Col>
                        <input type="number" className="form-control" placeholder="Enter Copies" value={copies} onChange={(e) => setCopies(e.target.value)} />
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
                        <th>Title</th>
                        <th>Author</th>
                        <th>Price</th>
                        <th>Copies</th>
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
                                        <td>{item.title}</td>
                                        <td>{item.author}</td>
                                        <td>{item.price}</td>
                                        <td>{item.copies}</td>
                                        <td colSpan={2}>
                                            <button className="btn btn-primary" onClick={() => handleEdit(item.id)}>Edit</button> &nbsp;
                                            <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Remove</button>
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
                    <Modal.Title>Edit Book</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <input type="text" className="form-control" placeholder="Enter Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="text" className="form-control" placeholder="Enter Author" value={editAuthor} onChange={(e) => setEditAuthor(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="number" className="form-control" placeholder="Enter Price" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="number" className="form-control" placeholder="Enter Copies" value={editCopies} onChange={(e) => setEditCopies(e.target.value)} />
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
        </Fragment>
    )
}

export default Books;