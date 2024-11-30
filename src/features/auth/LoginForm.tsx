import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Box, Alert, Text } from '@mantine/core';

import useAuthStore from '@/services/authStore';

function LoginForm() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isSuccess = login(username, password);
    if (isSuccess) {
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Box style={{ maxWidth: 300, margin: '0 auto', marginTop: '100px' }}>
        <form onSubmit={handleSubmit}>
          <Text size="xl" mb="md">
            Login
          </Text>
          <TextInput
            label="Username"
            placeholder="Enter username"
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            required
            mt="md"
          />
          {error && (
            <Alert color="red" mt="md">
              {error}
            </Alert>
          )}
          <Button type="submit" fullWidth mt="xl">
            Login
          </Button>
        </form>
    </Box>
  );
}

export default LoginForm;
