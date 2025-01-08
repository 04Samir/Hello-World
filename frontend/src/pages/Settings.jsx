/*
    Settings Page
    -------------
*/

import React, { useLayoutEffect, useState, useRef } from 'react';
import { Badge, Button, Col, Container, Form, Image, InputGroup, ListGroup, Modal, Row } from 'react-bootstrap';

import { Base } from '../components';
import { useAuth } from '../context';
import { IconGetter } from '../utilities';


export const Settings = () => {
    const { user } = useAuth();

    const [unSavedChanges, setUnSavedChanges] = useState(false);
    const [showUnSavedChangesModal, setShowUnSavedChangesModal] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [tab, setTab] = useState();
    const [activeTab, setActiveTab] = useState('profile');

    const [displayName, setDisplayName] = useState(user.display_name);
    const [username, setUsername] = useState(user.username);
    const [avatar, setAvatar] = useState('');
    const [savedAvatar, setSavedAvatar] = useState(user.avatar || '');
    const [bio, setBio] = useState(user.bio || '');
    const [location, setLocation] = useState(user.location || '');

    const displayNameRef = useRef();
    const usernameRef = useRef();
    const bioRef = useRef();
    const locationRef = useRef();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const sessions = [
        {
            id: 1,
            device: 'Chrome on Windows',
            location: 'Canary Wharf, London, UK',
            lastActive: 'Just Now',
            currentSession: true,
        },
        {
            id: 2,
            device: 'Safari on iOS',
            location: 'New Cross, London, UK',
            lastActive: '3 Days Ago',
            currentSession: false,
        },
        {
            id: 3,
            device: 'Firefox on macOS',
            location: 'Westminster, London, UK',
            lastActive: '1 Week Ago',
            currentSession: false,
        },
    ];

    const notificationsPreferences = [
        {
            id: 1,
            name: 'Daily Quiz Reminder',
            description: 'Get a daily reminder to play the quiz',
            enabled: true,
        },
        {
            id: 2,
            name: 'Weekly Newsletter',
            description: 'Get a weekly newsletter with the latest news',
            enabled: false,
        },
    ];

    const notificationsChannels = [
        {
            id: 1,
            name: 'Desktop Notifications',
            description: 'Get notifications on your desktop',
            enabled: true,
        },
        {
            id: 2,
            name: 'Email Notifications',
            description: 'Coming Soon',
            enabled: false,
            disabled: true,
        },
    ];

    const notificationsNew = [
        {
            id: 1,
            title: 'New Quiz Available',
            description: 'Play the new quiz and earn rewards',
            time: 'Just Now',
        },
        {
            id: 2,
            title: 'Weekly Newsletter',
            description: 'Check out the latest news and updates',
            time: '3 Days Ago',
        },
        {
            id: 3,
            title: 'New Quiz Available',
            description: 'Play the new quiz and earn rewards',
            time: '1 Week Ago',
        },
    ];

    useLayoutEffect(() => {
        document.title = 'User Settings | Hello World';
    }, []);

    const handleTabChange = (t) => {
        if (t === activeTab) return;

        if (unSavedChanges) {
            setTab(t);
            return setShowUnSavedChangesModal(true);
        };

        setTab();
        setActiveTab(t);
        setUnSavedChanges(false);
    };

    const handleTabModalCancel = () => {
        setTab();
        setShowUnSavedChangesModal(false);
    };

    const handleTabModalContinue = () => {
        setAvatar(savedAvatar);
        setUnSavedChanges(false);
        setShowUnSavedChangesModal(false);
        handleTabChange(tab);
    };

    // Replace with API-Calls
    const handleAvatarChange = async (file) => {
        setUnSavedChanges(true);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        };
    };

    const saveProfileChanges = async (e) => {
        e.preventDefault();

        if (displayNameRef.current.value !== displayName) {
            setDisplayName(displayNameRef.current.value);
        };

        if (usernameRef.current.value !== username) {
            setUsername(usernameRef.current.value);
        };

        if (avatar !== savedAvatar) {
            setSavedAvatar(avatar);
        };

        if (bioRef.current.value !== bio) {
            setBio(bioRef.current.value);
        };

        if (locationRef.current.value !== location) {
            setLocation(locationRef.current.value);
        };

        setUnSavedChanges(false);

        alert('Changes Saved!');
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            alert('New Passwords Do NOT Match!');
            return;
        };

        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');

        alert('Password Changed!');
    };

    const DeleteSession = async (id) => {
        alert(`Session ${id} Deleted!`);
    };

    const handleLogOutEverywhere = async () => {
        alert('Logged Out Everywhere!');
    };

    const handleDeleteAccount = async () => {
        alert('Account Deleted!');
    };

    const updateNotificationsPreference = async (id) => {
        alert(`Notifications Preference ${id} Updated!`);
    };

    const updateNotificationsChannel = async (id) => {
        alert(`Notifications Channel ${id} Updated!`);
    };

    const readNewNotification = async (id) => {
        alert(`New Notification ${id} Read!`);
    };

    const clearNewNotifications = async () => {
        alert('New Notifications Cleared!');
    };

    return (
        <Base>
            <Container className='py-4'>
                <Row>
                    <Col md={3}>
                        <h2>User Settings</h2>
                        <ListGroup >
                            <ListGroup.Item
                                action
                                active={activeTab === 'profile'}
                                onClick={() => handleTabChange('profile')}
                                variant='theme'
                            >
                                Profile
                            </ListGroup.Item>
                            <ListGroup.Item
                                action
                                active={activeTab === 'account'}
                                onClick={() => handleTabChange('account')}
                                variant='theme'
                            >
                                Account
                            </ListGroup.Item>
                            <ListGroup.Item
                                action
                                active={activeTab === 'security'}
                                onClick={() => handleTabChange('security')}
                                variant='theme'
                            >
                                Security
                            </ListGroup.Item>
                            <ListGroup.Item
                                action
                                active={activeTab === 'notifications'}
                                onClick={() => setActiveTab('notifications')}
                                variant='theme'
                                className='d-flex align-items-center justify-content-between'
                            >
                                Notifications
                                {notificationsNew.length > 0 && (
                                    <Badge bg='theme' className='ms-2'>{notificationsNew.length}</Badge>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>

                    <Modal backdrop='static' show={showUnSavedChangesModal} onHide={handleTabModalCancel}>
                        <Modal.Header closeButton>
                            <Modal.Title>Unsaved Changes</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>You have Unsaved Changes.</p>
                            <p>Are you Sure you Want to Continue?</p>
                        </Modal.Body>
                        <Modal.Footer className='d-flex justify-content-between'>
                            <Button variant='secondary' onClick={handleTabModalCancel}>
                                Cancel
                            </Button>
                            <Button variant='danger' onClick={handleTabModalContinue}>
                                Continue
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Col md={9} className='mt-5'>
                        {activeTab === 'profile' && (
                            <Form onSubmit={saveProfileChanges}>
                                <Form.Group className='mb-4'>
                                    <Form.Label className='fw-bold'>Display Name</Form.Label>
                                    <Form.Control
                                        type='text'
                                        aria-label='Display Name'
                                        aria-describedby='display-name'
                                        defaultValue={displayName}
                                        placeholder='Display Name'
                                        ref={displayNameRef}
                                        onChange={(e) => setUnSavedChanges(true)}
                                    />
                                </Form.Group>
                                <Form.Group className='mb-4'>
                                    <Form.Label className='fw-bold'>Username</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text id='username'>@</InputGroup.Text>
                                        <Form.Control
                                            type='text'
                                            aria-label='Username'
                                            aria-describedby='username'
                                            defaultValue={username}
                                            placeholder='Username'
                                            ref={usernameRef}
                                            onChange={(e) => setUnSavedChanges(true)}
                                        />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className='mb-4'>
                                    <Form.Label className='fw-bold'>Avatar</Form.Label>
                                    <Button variant='outline-theme' className='w-100' onClick={() => setShowAvatarModal(true)}>
                                        Change Avatar
                                    </Button>
                                    <Modal show={showAvatarModal} onHide={() => setShowAvatarModal(false)}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Change Avatar</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {avatar ? (
                                                <Image
                                                    src={avatar}
                                                    alt='Avatar'
                                                    thumbnail
                                                />
                                            ) : (
                                                savedAvatar && (
                                                    <Image
                                                        src={savedAvatar}
                                                        alt='Saved Avatar'
                                                        thumbnail
                                                    />
                                                )
                                            )}

                                            <Form.Control
                                                type='file'
                                                accept='image/*'
                                                onChange={(e) => handleAvatarChange(e.target.files[0])}
                                                className='mt-3'
                                            />
                                            <Button variant='theme' className='mt-3 w-100' onClick={() => setShowAvatarModal(false)}>
                                                Close
                                            </Button>
                                        </Modal.Body>
                                    </Modal>
                                </Form.Group>
                                <Form.Group className='mb-4'>
                                    <Form.Label className='fw-bold'>Bio</Form.Label>
                                    <Form.Control
                                        as='textarea'
                                        rows={3}
                                        defaultValue={bio}
                                        ref={bioRef}
                                        onChange={(e) => setUnSavedChanges(true)}
                                    />
                                </Form.Group>
                                <Form.Group className='mb-4'>
                                    <Form.Label className='fw-bold'>Location</Form.Label>
                                    <Form.Control
                                        type='text'
                                        defaultValue={location}
                                        ref={locationRef}
                                        onChange={(e) => setUnSavedChanges(true)}
                                    />
                                </Form.Group>
                                <Button type='submit' variant='theme' className='w-100'>
                                    Save Changes
                                </Button>
                            </Form>
                        )}

                        {activeTab === 'account' && (
                            <Form onSubmit={handlePasswordChange}>
                                <Form.Group className='mb-4'>
                                    <Form.Label className='fw-bold'>Current Password</Form.Label>
                                    <Form.Control
                                        type='password'
                                        defaultValue={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className='mb-4'>
                                    <Form.Label className='fw-bold'>New Password</Form.Label>
                                    <Form.Control
                                        type='password'
                                        defaultValue={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className='mb-4'>
                                    <Form.Label className='fw-bold'>Confirm New Password</Form.Label>
                                    <Form.Control
                                        type='password'
                                        defaultValue={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Button type='submit' variant='theme' className='w-100'>
                                    Change Password
                                </Button>
                                <hr className='my-4' />
                                <Button
                                    variant='danger'
                                    className='w-100'
                                    onClick={handleDeleteAccount}
                                >
                                    Delete Account
                                </Button>
                            </Form>
                        )}

                        {activeTab === 'security' && (
                            <div>
                                <h3 className='fw-bold'>Active Sessions</h3>
                                <ListGroup className='mb-4'>
                                    {sessions.map((session) => (
                                        <ListGroup.Item key={session.id} className='d-flex justify-content-between align-items-center'>
                                            <div>
                                                <div className='d-flex align-items-center'>
                                                    <p className='mb-0 fw-bold'>
                                                        {session.device}
                                                    </p>
                                                    {session.currentSession && (
                                                        <Badge pill bg='theme' className='ms-2'>Current</Badge>
                                                    )}
                                                </div>
                                                <small>
                                                    {session.location} • {session.lastActive}
                                                </small>
                                            </div>
                                            <Button variant='theme' size='sm' className='p-2 d-flex align-items-center justify-content-center' onClick={() => DeleteSession(session.id)}>
                                                {IconGetter.GetFaIcon('X', { size: '1rem' })}
                                            </Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>

                                <Button
                                    variant='warning'
                                    className='w-100'
                                    onClick={handleLogOutEverywhere}
                                >
                                    Log Out Everywhere
                                </Button>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div>
                                <Row>
                                    <Col md={6}>

                                        <h3 className='fw-bold'>Preferences</h3>
                                        <ListGroup className='mb-4'>
                                            {notificationsPreferences.map((preference) => (
                                                <ListGroup.Item key={preference.id} className='d-flex justify-content-between align-items-center'>
                                                    <div>
                                                        <p className='mb-0 fw-bold'>
                                                            {preference.name}
                                                        </p>
                                                        <small>
                                                            {preference.description}
                                                        </small>
                                                    </div>
                                                    <Form.Check
                                                        type='switch'
                                                        id={`switch-${preference.id}`}
                                                        label=''
                                                        checked={preference.enabled}
                                                        onChange={() => updateNotificationsPreference(preference.id)}
                                                    />
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Col>
                                    <Col md={6}>

                                        <h3 className='fw-bold'>Channels</h3>
                                        <ListGroup className='mb-4'>
                                            {notificationsChannels.map((channel) => (
                                                <ListGroup.Item key={channel.id} className='d-flex justify-content-between align-items-center'>
                                                    <div>
                                                        <p className='mb-0 fw-bold'>
                                                            {channel.name}
                                                        </p>
                                                        <small>
                                                            {channel.description}
                                                        </small>
                                                    </div>
                                                    <Form.Check
                                                        type='switch'
                                                        id={`switch-${channel.id}`}
                                                        label=''
                                                        checked={channel.enabled}
                                                        onChange={() => updateNotificationsChannel(channel.id)}
                                                        disabled={channel.disabled}
                                                    />
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Col>
                                </Row>

                                <h3 className='fw-bold'>New Notifications</h3>
                                <ListGroup className='mb-4'>
                                    {notificationsNew.map((notification) => (
                                        <ListGroup.Item key={notification.id} className='d-flex justify-content-between align-items-center'>
                                            <div>
                                                <div className='d-flex align-items-center'>
                                                    <p className='mb-0 fw-bold'>
                                                        {notification.title}
                                                    </p>
                                                    <Badge pill bg='theme' className='ms-2'>{notification.time}</Badge>
                                                </div>
                                                <small>
                                                    {notification.description}
                                                </small>
                                            </div>
                                            <Button variant='theme' size='sm' className='p-2 d-flex align-items-center justify-content-center' onClick={() => readNewNotification(notification.id)}>
                                                {IconGetter.GetFaIcon('X', { size: '1rem' })}
                                            </Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>

                                <Button
                                    variant='warning'
                                    className='w-100'
                                    onClick={clearNewNotifications}
                                >
                                    Clear All Notifications
                                </Button>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </Base>
    );
};
