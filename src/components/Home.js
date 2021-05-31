import React, {useState, useEffect} from 'react'
import {Table, Container, Nav, 
        Navbar, Modal, Button, 
        Form, Alert} from 'react-bootstrap';

import { auth } from '../fiebase/firebase';
import Loader from "react-loader-spinner";
import naruto from "../naruto.png";
export default function Home() {
    const SIGN_IN = 'SignIn';
    const SIGN_UP = 'SignUp';
    const [isLog, setIsLog] = useState(false);
    const [show, setShow] = useState(false);
    const [action, setAction] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState();
    const onAction = (type) => {
        setShow(true);
        setAction(type);
    }
    const handleChange = (e) => {
        e.preventDefault();
        e.target.name === 'email' ? setEmail(e.target.value) : setPassword(e.target.value);
    }
    const onClose = () => {
        setShow(false);
        setEmail('');
        setPassword('');
        setAction('');
        setError('');
    }

    const onSubmit = () => {
        switch(action) {
            case SIGN_UP:
                setLoading(true);
                return auth.createUserWithEmailAndPassword(email, password)
                    .then(user => {
                        setLoading(false);
                        setShow(false);
                    })
                    .catch(err => console.log(err))
            case SIGN_IN:
                setLoading(true);
                return auth.signInWithEmailAndPassword(email, password)
                           .then(user => {
                               setLoading(false);
                               setShow(false);
                           })
                           .catch(err => {
                               setLoading(false);
                               setError(err.message)
                           });
        }
    }

    const onLogout = () => {
        auth.signOut().then(() => {
            setIsLog(false);
            setCurrentUser(null);
        })
        .catch(err => console.log(err.message));
    }
    //style
    const styleLoader = {
        position: "absolute",
        margin: "0 40%"
    }
    const styleModal = {
        postion: "relative"
    }
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user) {
                setIsLog(true);
                setCurrentUser(user);
            }
        })
    }, [])
    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                 {!isLog ?  
                 <Nav className="justify-content-end">  
                    <Nav.Link onClick={() => onAction(SIGN_IN)}>Sign In</Nav.Link>
                    <Nav.Link onClick={() => onAction(SIGN_UP)}>Sign Up</Nav.Link>
                </Nav>
                 : <Nav>
                     <Navbar.Brand>{currentUser?.email}</Navbar.Brand>
                     <Nav.Link onClick={onLogout}>Logout</Nav.Link>  
                    </Nav> 
                }
               
                </Container>
            </Navbar>
            <Table striped bordered hover>
            <thead>
                <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Caracteristiques</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td><img src={naruto} width="100px"/></td>
                <td>Naruto</td>
                <td>Kybi</td>
                </tr>
            </tbody>
            </Table>

        <Modal
            show={show}
            onHide={onClose}
            style={styleModal}
        >
            {error === '' ? '' : <Alert variant="danger">{error}</Alert>}
            <Modal.Header closeButton>
            <Modal.Title>{action}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Loader
                style={styleLoader}
                type="Oval"
                color="#00BFFF"
                height={60}
                width={60}
                visible={loading}//3 secs
            />
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="email" type="email" onChange={handleChange} placeholder="name@example.com" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control name="password" type="password" onChange={handleChange} placeholder="password" />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={onSubmit}>{action}</Button>
            </Modal.Footer>
        </Modal>
        </div>
    )
}
