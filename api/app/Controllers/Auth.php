<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;

class Auth extends ResourceController
{
    protected $modelName = 'App\Models\UserModel';
    protected $format    = 'json';

    public function login()
    {
        $model = new UserModel();
        $username = $this->request->getVar('username');
        $password = $this->request->getVar('password');

        $user = $model->where('username', $username)->first();

        if (!$user) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Invalid username or password'
            ], 401);
        }

        if (!password_verify($password, $user['password'])) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Invalid username or password'
            ], 401);
        }

        // Remove password from response
        unset($user['password']);

        return $this->respond([
            'status' => 'success',
            'message' => 'Login successful',
            'data' => $user
        ]);
    }

    public function logout()
    {
        return $this->respond([
            'status' => 'success',
            'message' => 'Logout successful'
        ]);
    }

    public function me()
    {
        $userId = $this->request->getVar('user_id');
        
        if (!$userId) {
            return $this->respond([
                'status' => 'error',
                'message' => 'User ID is required'
            ], 400);
        }

        $model = new UserModel();
        $user = $model->find($userId);

        if (!$user) {
            return $this->respond([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        // Remove password from response
        unset($user['password']);

        return $this->respond([
            'status' => 'success',
            'data' => $user
        ]);
    }
}
