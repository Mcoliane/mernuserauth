import React from 'react';
import { Form, Input, Button, Link } from '@heroui/react';

export default function SignUpForm({ onSwitchTab }) {
    return (
        <Form className="flex flex-col gap-4">
            <label>Name</label>
            <Input isRequired placeholder="Enter your name" type="text" />
            <label>Email</label>
            <Input isRequired placeholder="Enter your email" type="email" />
            <label>Password</label>
            <Input
                isRequired
                placeholder="Enter your password"
                type="password"
            />
            <p className="text-center text-small">
                Already have an account?{" "}
                <Link size="sm" onPress={onSwitchTab} className="text-[#22d3ee] cursor-pointer">
                    Login
                </Link>
            </p>
            <Button color="primary" variant="flat" type="submit"
                    className="bg-yellow-500 hover:bg-yellow-400 text-black hover:text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded">
                Sign up
            </Button>
        </Form>
    );
}
