<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;

class Users extends ResourceController
{
    protected $modelName = 'App\Models\UserModel';
    protected $format    = 'json';

    public function index()
    {
        $model = model(UserModel::class);
        $users = $model->findAll();

        // Remove passwords from response
        foreach ($users as &$user) {
            unset($user['password']);
        }

        return $this->respond([
            'status' => 'success',
            'data' => $users
        ]);
    }

    public function show($id = null)
    {
        $model = model(UserModel::class);
        $user = $model->find($id);

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

    public function create()
    {
        $model = model(UserModel::class);
        
        $data = [
            'username' => $this->request->getVar('username'),
            'password' => password_hash($this->request->getVar('password'), PASSWORD_DEFAULT),
            'role' => $this->request->getVar('role'),
            'name' => $this->request->getVar('name'),
            'email' => $this->request->getVar('email'),
            'project_id' => $this->request->getVar('project_id'),
        ];

        if ($model->insert($data)) {
            $user = $model->find($model->getInsertID());
            unset($user['password']);
            
            return $this->respond([
                'status' => 'success',
                'message' => 'User created successfully',
                'data' => $user
            ], 201);
        }

        return $this->respond([
            'status' => 'error',
            'message' => 'Failed to create user',
            'errors' => $model->errors()
        ], 400);
    }

    public function update($id = null)
    {
        $model = model(UserModel::class);
        
        if (!$model->find($id)) {
            return $this->respond([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        $data = [];
        
        if ($this->request->getVar('username')) {
            $data['username'] = $this->request->getVar('username');
        }
        if ($this->request->getVar('password')) {
            $data['password'] = password_hash($this->request->getVar('password'), PASSWORD_DEFAULT);
        }
        if ($this->request->getVar('role')) {
            $data['role'] = $this->request->getVar('role');
        }
        if ($this->request->getVar('name')) {
            $data['name'] = $this->request->getVar('name');
        }
        if ($this->request->getVar('email')) {
            $data['email'] = $this->request->getVar('email');
        }
        if ($this->request->getVar('project_id') !== null) {
            $data['project_id'] = $this->request->getVar('project_id');
        }

        if ($model->update($id, $data)) {
            $user = $model->find($id);
            unset($user['password']);
            
            return $this->respond([
                'status' => 'success',
                'message' => 'User updated successfully',
                'data' => $user
            ]);
        }

        return $this->respond([
            'status' => 'error',
            'message' => 'Failed to update user',
            'errors' => $model->errors()
        ], 400);
    }

    public function delete($id = null)
    {
        $model = model(UserModel::class);
        
        if (!$model->find($id)) {
            return $this->respond([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        if ($model->delete($id)) {
            return $this->respond([
                'status' => 'success',
                'message' => 'User deleted successfully'
            ]);
        }

        return $this->respond([
            'status' => 'error',
            'message' => 'Failed to delete user'
        ], 400);
    }
}
