import React from 'react';
import { Form, Input, Button } from '@heroui/react';

export default function LoginForm({ formData, message, handleChange, handleSubmit }) {
    return (
        <>
            <p className="text-sm text-red-500 mb-4">{message}</p>
            <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <Input
                    type="email"
                    name="email"
                    label="Email"
                    labelPlacement="outside"
                    placeholder="email@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    isRequired
                />
                <Input
                    type="password"
                    name="password"
                    label="Password"
                    labelPlacement="outside"
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
