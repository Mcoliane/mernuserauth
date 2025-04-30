import React, {useState} from 'react';
import {
    Tabs, Tab, CardBody, Input, Button, Avatar, Divider, Form
} from '@heroui/react';

const UserProfile = ({user}) => {
    const [selectedTab, setSelectedTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: user.name || '', email: user.email || '', bio: user.bio || '',
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSave = () => {
        console.log('Saved profile:', formData);
        setIsEditing(false);
    };

    return (<div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
            {/* Profile Wrapper */}
            <div
                className="min-w-screen min-h-screen md:w-3/4 lg:w-2/3 bg-gradient-to-br from-[#253C3F] to-black text-white rounded-xl shadow-lg p-8">

                <div className="flex items-center gap-6 mb-6">
                    <Avatar
                        className="w-24 h-24 border-4 border-yellow-500"
                        src={user.avatar || 'https://via.placeholder.com/150'}
                        alt="Profile picture"
                    />
                    <div>
                        <h2 className="text-3xl font-semibold">{user.name}</h2>
                        <p className="text-gray-400">{user.email}</p>
                    </div>
                </div>

                <Divider className="my-4 border-gray-700"/>

                {/* Tabs */}
                <Tabs
                    selectedKey={selectedTab}
                    onSelectionChange={setSelectedTab}
                    fullWidth
                    classNames={{
                        tabList: "flex w-full justify-center px-2 py-1 space-x-2",
                        cursor: "bg-yellow-500 bg-radius-5",
                        tab: "flex-1 rounded-md py-2 text-sm font-semibold text-white text-center transition-all duration-300 ease-in-out bg-gray-700 hover:bg-gray-600 data-[selected=true]:bg-yellow-500 data-[selected=true]:text-black shadow-sm",
                        tabContent: "group-data-[selected=true]:text-white ",
                    }}
                >
                    <Tab key="profile" title="Profile"/>
                    <Tab key="stats" title="Game Stats"/>
                    <Tab key="settings" title="Settings"/>
                </Tabs>

                <div className="mt-6">
                    {selectedTab === 'profile' && (!isEditing ? (<div className="space-y-4">
                                <p><span className="font-semibold">Name:</span> {formData.name}</p>
                                <p><span className="font-semibold">Email:</span> {formData.email}</p>
                                <p><span className="font-semibold">Bio:</span> {formData.bio}</p>
                                <Button
                                    color="primary"
                                    onPress={() => setIsEditing(true)}
                                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
                                >
                                    Edit Profile
                                </Button>
                            </div>) : (<Form className="flex flex-col gap-4">
                                <label>Name</label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="bg-gray-800 text-white border border-gray-600 rounded-md"
                                />
                                <label>Email</label>
                                <Input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-gray-800 text-white border border-gray-600 rounded-md"
                                />
                                <label>Bio</label>
                                <Input
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="bg-gray-800 text-white border border-gray-600 rounded-md"
                                />
                                <div className="flex justify-end gap-2">
                                    <Button
                                        color="success"
                                        onPress={handleSave}
                                        className="bg-yellow-500 hover:bg-yellow-400 text-black hover:text-white font-bold py-2 px-4 rounded shadow transition"
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={() => setIsEditing(false)}
                                        className="bg-red-500 hover:bg-red-600 text-black hover:text-white font-bold py-2 px-4 rounded shadow transition"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Form>))}

                    {selectedTab === 'stats' && (<div className="space-y-4">
                            <h3 className="text-lg font-semibold">Chess Stats</h3>
                            <p><span className="font-medium">Best Time:</span> {user.bestTime || '3:22'}</p>
                            <p><span className="font-medium">Highest Score:</span> {user.highScore || '2200'}</p>
                            <p><span className="font-medium">Games Played:</span> {user.gamesPlayed || '54'}</p>
                            <p><span className="font-medium">Win Rate:</span> {user.winRate || '68%'}</p>
                        </div>)}

                    {selectedTab === 'settings' && (<div className="space-y-4">
                            <h3 className="text-lg font-semibold">Settings</h3>
                            <p className="text-gray-400">This section can include notification preferences, theme, and
                                password change in the future.</p>
                            <Button
                                color="danger"
                                variant="light"
                                className="bg-red-500 hover:bg-red-400 text-white font-semibold"
                            >
                                Log out
                            </Button>
                        </div>)}
                </div>
            </div>
        </div>);
};

export default UserProfile;
