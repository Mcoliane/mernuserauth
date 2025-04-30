import React from 'react';
import {Form, Input, Button} from '@heroui/react';

export default function SignUpForm() {
    return (<Form className="flex flex-col gap-4">
            <label className="text-sm text-gray-300">Name</label>
            <Input
                required
                placeholder="Enter your name"
                type="text"
                className="bg-gray-800 text-white border border-gray-600 rounded-md"
            />
            <label className="text-sm text-gray-300">Email</label>
            <Input
                required
                placeholder="Enter your email"
                type="email"
                className="bg-gray-800 text-white border border-gray-600 rounded-md"
            />
            <label className="text-sm text-gray-300">Password</label>
            <Input
                required
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
        </Form>);
}
