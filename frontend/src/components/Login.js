import React, { useState } from 'react';
import {Form, Input, Button} from "@heroui/react";

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        credentials: 'include', // Important for httpOnly cookies
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message || 'Login error');
      }
    } catch (error) {
      console.error(error);
      setMessage('Something went wrong.');
    }
  };

  return (
      <main className="flex min-w-screen min-h-screen">
        <div className="flex min-h-screen w-full">
          {/* Image section */}
          <div className="flex w-fit md:w-1/3 items-center justify-center p-8 bg-chess-color">
            <div className="w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6">Login</h2>
              <p className="text-sm text-red-500 mb-4">{message}</p>
              <Form className=" flex flex-col gap-3 items-center justify-center"
                    onSubmit={handleSubmit}>
                <Input
                    type="email"
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
                        className="bg-yellow-500 hover:bg-yellow-400 text-black hover:text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded">Login</Button>

              </Form>
            </div>
          </div>
          <div
              className="w-2/3 h-full bg-cover bg-center bg-chess-login"
          />
        </div>
      </main>
        );
        }

        export default Login;
