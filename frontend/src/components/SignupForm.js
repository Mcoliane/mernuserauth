import React, { useState } from 'react';
import { Form, Input, Button } from '@heroui/react';

export default function SignUpForm({ onSwitchTab }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [isSuccess, setIsSuccess] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/api/auth/register', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message || 'Registration successful!');
                setIsSuccess(true);
                setShowPopup(true);
                setTimeout(() => {
                    onSwitchTab(); // Switch to login tab after success
                }, 2000);
            } else {
                setMessage(data.message || 'Registration failed.');
                setIsSuccess(false);
                setShowPopup(true);
            }
        } catch (error) {
            console.error(error);
            setMessage('Something went wrong.');
            setIsSuccess(false);
            setShowPopup(true);
        }
    };

    return (
        <>
            <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="text-sm text-gray-300">Name</label>
                <Input
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    type="text"
                    className="bg-gray-800 text-white border border-gray-600 rounded-md"
                />
                <label className="text-sm text-gray-300">Email</label>
                <Input
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    type="email"
                    className="bg-gray-800 text-white border border-gray-600 rounded-md"
                />
                <label className="text-sm text-gray-300">Password</label>
                <Input
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    type="password"
                    className="bg-gray-800 text-white border border-gray-600 rounded-md"
                />
                <Button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-400 text-black hover:text-white font-bold py-2 px-4 rounded shadow transition"
                >
                    Sign Up
                </Button>
            </Form>

            {/* Popup for success/failure */}
            {showPopup && (
                <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50`}>
                    <div
                        className={`bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 w-full max-w-sm shadow-2xl text-white relative`}>
                        <h2 className={`text-xl font-bold ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                            {isSuccess ? 'Success' : 'Error'}
                        </h2>
                        <p className="text-gray-300 mt-4">{message}</p>
                        <div className="flex justify-center mt-6">
                            <Button
                                onPress={() => setShowPopup(false)}
                                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-full transition duration-300"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
