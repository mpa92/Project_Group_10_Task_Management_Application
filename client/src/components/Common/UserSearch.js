import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import axios from 'axios';
import './UserSearch.css';

const UserSearch = ({initialSearchTerm, userIdSetter}) => {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!searchTerm || !isFocused) {
                setUsers([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const results = await api.get('/users', {
                    params: { search: searchTerm }
                });

                setUsers(results.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to load users. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        // add debounce to avoid too many requests
        const debounceTimer = setTimeout(() => {
            fetchUsers();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, isFocused]);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSearchTerm(`${user.first_name} ${user.last_name}`);
        userIdSetter(user.id);
        setIsFocused(false);
        setUsers([]);
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setSelectedUser(null);
        if (!e.target.value) {
            userIdSetter(null);
        }
    };

    return (
        <div className="user-search" ref={wrapperRef}>
            <input
                type="text"
                className="user-search-input"
                placeholder="Search for a user..."
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
            />
            {isFocused && (searchTerm || users.length > 0) && (
                <div className="user-search-dropdown">
                    {loading && <div className="user-search-loading">Loading...</div>}
                    {error && <div className="user-search-error">{error}</div>}
                    {!loading && !error && users.length === 0 && searchTerm && (
                        <div className="user-search-no-results">No users found</div>
                    )}
                    {!loading && users.length > 0 && (
                        <ul className="user-search-list">
                            {users.map(user => (
                                <li
                                    key={user.id}
                                    className="user-search-item"
                                    onClick={() => handleSelectUser(user)}
                                >
                                    {user.first_name} {user.last_name}
                                    {user.email && <span className="user-email">({user.email})</span>}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default UserSearch;