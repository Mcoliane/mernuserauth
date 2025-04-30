import React, {useState} from 'react';
import {Tabs, Tab, Card, CardBody} from "@heroui/react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignupForm";

function Login() {
    const [formData, setFormData] = useState({email: '', password: ''});
    const [message, setMessage] = useState('');
    const [selected, setSelected] = useState("login");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST', credentials: 'include', // Important for httpOnly cookies
                headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify(formData)
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

    return (<main className="flex min-w-screen min-h-screen">
        <div className="flex min-h-screen w-full">
            {/* Image section */}
            <div
                className="flex w-fit md:w-1/3 items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-[#110613] text-white ">

                <div className="w-full max-w-md">
                    <Card className="w-[340px] h-[600px] flex flex-col">
                        <Tabs
                            selectedKey={selected}
                            onSelectionChange={setSelected}
                            classNames={{
                                tabList: "flex w-full justify-center px-2 py-1 space-x-2",

                                tab: "flex-1 rounded-md py-2 text-sm font-semibold text-white text-center transition-all duration-300 ease-in-out bg-gray-700 hover:bg-gray-600 data-[selected=true]:bg-yellow-500 data-[selected=true]:text-black shadow-sm",
                                cursor: "",
                            }}
                            fullWidth
                            aria-label="Tabs form"
                        >
                            <Tab key="login" title="Login"/>
                            <Tab key="sign-up" title="Sign Up"/>
                        </Tabs>
                        <CardBody className="flex-1 overflow-auto px-4 py-6">

                            <div className="mt-6 min-h-[420px] transition-all duration-300 ease-in-out">

                                {selected === 'login' ? (<LoginForm
                                    formData={formData}
                                    message={message}
                                    handleChange={handleChange}
                                    handleSubmit={handleSubmit}
                                />) : (<SignUpForm onSwitchTab={() => setSelected('login')}/>)}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
            <div
                className="w-2/3 h-full bg-cover bg-center bg-chess-login"
            />
        </div>
    </main>);
}

export default Login;
