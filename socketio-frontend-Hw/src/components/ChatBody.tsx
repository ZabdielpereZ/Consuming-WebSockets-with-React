import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Socket } from 'socket.io-client';

interface SocketProps {
    socket: Socket;
    chat: any[];
}

const ChatBody = ({ socket, chat }: SocketProps) => {
    const [messages, setMessages] = useState(chat);

    useEffect(() => {
        const messageListener = (message: any) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        socket.on("message", messageListener);

        return () => {
            socket.off("message", messageListener);
        };
    }, [socket]);

    return (
        <>
            {messages.map((message, index) => (
                <Card className='my-3' key={index}>
                    <Card.Body>
                        <strong>{message.username}:</strong> {message.body}
                    </Card.Body>
                </Card>
            ))}
        </>
    );
};

export default ChatBody;
