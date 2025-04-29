import React from 'react';
import { Form, Input, Button } from '@heroui/react';

export default function LoginForm({ formData, message, handleChange, handleSubmit }) {
    return (
        <>
            <p className="text-sm text-red-500 mb-4">{message}</p>
            <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <label>Email</label>
                <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    // value={formData.email}
                    // onChange={handleChange}
                    // isRequired
                />
                <label>Password</label>
                <Input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <Button color="primary" variant="flat" type="submit"
                        className="bg-yellow-500 hover:bg-yellow-400 text-black hover:text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded">

                    Login
                </Button>
            </Form>
        </>
    );
}
