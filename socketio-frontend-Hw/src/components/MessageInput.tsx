import { FormEvent, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Socket } from "socket.io-client";

interface SocketProps {
    socket: Socket;
    username: string;
}

const MessageInput = ({ socket, username }: SocketProps) => {
    const [message, setMessage] = useState('');

    const handleSendMessage = (event: FormEvent) => {
        event.preventDefault();
        socket.emit('message', { username, body: message });
        setMessage("");
    }

    return (
        <Form onSubmit={handleSendMessage} className="my-3">
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Message</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Your Message"
                    autoComplete="off"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
};

export default MessageInput;
