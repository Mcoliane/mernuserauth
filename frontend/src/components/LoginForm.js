import React from 'react';
import {Form, Input, Button} from '@heroui/react';

export default function LoginForm({formData, message, handleChange, handleSubmit}) {
    return (<>
            {message && (<p className="text-sm text-red-500 mb-4">{message}</p>)}
            <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <label className="text-sm text-gray-300">Email</label>
                <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-gray-800 text-white border border-gray-600 rounded-md"
                />
                <label className="text-sm text-gray-300">Password</label>
                <Input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-gray-800 text-white border border-gray-600 rounded-md"
                />
                <Button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-400 text-black hover:text-white font-bold py-2 px-4 rounded shadow transition"
                >
                    Login
                </Button>
            </Form>
        </>);
}
