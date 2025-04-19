import React, { useState } from 'react';
import {
    Tabs,
    Tab,
    Card,
    CardBody,
    Input,
    Button,
    Avatar,
    Divider
} from '@heroui/react';

const UserProfile = ({ user }) => {
    const [selectedTab, setSelectedTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log('Saved profile:', formData);
        setIsEditing(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
            <Card className="w-full max-w-2xl shadow-xl">
                <CardBody>
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar
                            className="w-20 h-20"
                            src={user.avatar || 'https://via.placeholder.com/150'}
                            alt="Profile picture"
                        />
                        <div>
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="text-gray-500">{user.email}</p>
                        </div>
                    </div>

                    <Divider className="mb-4" />

                    <Tabs
                        selectedKey={selectedTab}
                        onSelectionChange={setSelectedTab}
                        fullWidth
                        classNames={{
                            tabList: "gap-6 border-b border-divider",
                            cursor: "bg-[#facc15]",
                            tab: "text-md font-medium",
                            tabContent: "group-data-[selected=true]:text-[#ca8a04]",
                        }}
                    >
                        <Tab key="profile" title="Profile" />
                        <Tab key="stats" title="Game Stats" />
                        <Tab key="settings" title="Settings" />
                    </Tabs>

                    <div className="mt-6">
                        {selectedTab === 'profile' && (
                            !isEditing ? (
                                <div className="space-y-3">
                                    <p><span className="font-semibold">Name:</span> {formData.name}</p>
                                    <p><span className="font-semibold">Email:</span> {formData.email}</p>
                                    <p><span className="font-semibold">Bio:</span> {formData.bio}</p>
                                    <Button color="primary" onPress={() => setIsEditing(true)}>
                                        Edit Profile
                                    </Button>
                                </div>
                            ) : (
                                <form className="space-y-4 mt-2">
                                    <Input
                                        label="Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        label="Email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        label="Bio"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button color="success" onPress={handleSave}>Save</Button>
                                        <Button color="danger" variant="light" onPress={() => setIsEditing(false)}>Cancel</Button>
                                    </div>
                                </form>
                            )
                        )}

                        {selectedTab === 'stats' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Chess Stats</h3>
                                <p><span className="font-medium">Best Time:</span> {user.bestTime || '3:22'}</p>
                                <p><span className="font-medium">Highest Score:</span> {user.highScore || '2200'}</p>
                                <p><span className="font-medium">Games Played:</span> {user.gamesPlayed || '54'}</p>
                                <p><span className="font-medium">Win Rate:</span> {user.winRate || '68%'}</p>
                            </div>
                        )}

                        {selectedTab === 'settings' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Settings</h3>
                                <p className="text-gray-600">This section can include notification preferences, theme, and password change in the future.</p>
                                <Button color="danger" variant="light">Log out</Button>
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default UserProfile;
