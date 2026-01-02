<?php

namespace App\Controllers;

use App\Models\ExpenditureModel;
use CodeIgniter\RESTful\ResourceController;

class Expenditures extends ResourceController
{
    protected $modelName = 'App\Models\ExpenditureModel';
    protected $format    = 'json';

    public function index()
    {
        $model = model(ExpenditureModel::class);
        $expenditures = $model->findAll();

        return $this->respond([
            'status' => 'success',
            'data' => $expenditures
        ]);
    }

    public function show($id = null)
    {
        $model = model(ExpenditureModel::class);
        $expenditure = $model->find($id);

        if (!$expenditure) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Expenditure not found'
            ], 404);
        }

        return $this->respond([
            'status' => 'success',
            'data' => $expenditure
        ]);
    }

    public function create()
    {
        $model = model(ExpenditureModel::class);
        
        $data = [
            'project_id' => $this->request->getVar('project_id'),
            'category' => $this->request->getVar('category'),
            'amount' => $this->request->getVar('amount'),
            'description' => $this->request->getVar('description'),
            'date' => $this->request->getVar('date'),
            'created_by' => $this->request->getVar('created_by'),
            'status' => $this->request->getVar('status') ?? 'pending',
        ];

        if ($model->insert($data)) {
            $expenditure = $model->find($model->getInsertID());
            
            return $this->respond([
                'status' => 'success',
                'message' => 'Expenditure created successfully',
                'data' => $expenditure
            ], 201);
        }

        return $this->respond([
            'status' => 'error',
            'message' => 'Failed to create expenditure',
            'errors' => $model->errors()
        ], 400);
    }

    public function update($id = null)
    {
        $model = model(ExpenditureModel::class);
        
        if (!$model->find($id)) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Expenditure not found'
            ], 404);
        }

        $data = [];
        
        if ($this->request->getVar('project_id')) {
            $data['project_id'] = $this->request->getVar('project_id');
        }
        if ($this->request->getVar('category')) {
            $data['category'] = $this->request->getVar('category');
        }
        if ($this->request->getVar('amount')) {
            $data['amount'] = $this->request->getVar('amount');
        }
        if ($this->request->getVar('description') !== null) {
            $data['description'] = $this->request->getVar('description');
        }
        if ($this->request->getVar('date')) {
            $data['date'] = $this->request->getVar('date');
        }
        if ($this->request->getVar('created_by')) {
            $data['created_by'] = $this->request->getVar('created_by');
        }
        if ($this->request->getVar('status')) {
            $data['status'] = $this->request->getVar('status');
        }

        if ($model->update($id, $data)) {
            $expenditure = $model->find($id);
            
            return $this->respond([
                'status' => 'success',
                'message' => 'Expenditure updated successfully',
                'data' => $expenditure
            ]);
        }

        return $this->respond([
            'status' => 'error',
            'message' => 'Failed to update expenditure',
            'errors' => $model->errors()
        ], 400);
    }

    public function delete($id = null)
    {
        $model = model(ExpenditureModel::class);
        
        if (!$model->find($id)) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Expenditure not found'
            ], 404);
        }

        if ($model->delete($id)) {
            return $this->respond([
                'status' => 'success',
                'message' => 'Expenditure deleted successfully'
            ]);
        }

        return $this->respond([
            'status' => 'error',
            'message' => 'Failed to delete expenditure'
        ], 400);
    }

    public function updateStatus($id = null)
    {
        $model = model(ExpenditureModel::class);
        
        if (!$model->find($id)) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Expenditure not found'
            ], 404);
        }

        $status = $this->request->getVar('status');
        
        if (!in_array($status, ['pending', 'approved', 'rejected'])) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Invalid status. Must be pending, approved, or rejected'
            ], 400);
        }

        if ($model->update($id, ['status' => $status])) {
            $expenditure = $model->find($id);
            
            return $this->respond([
                'status' => 'success',
                'message' => 'Expenditure status updated successfully',
                'data' => $expenditure
            ]);
        }

        return $this->respond([
            'status' => 'error',
            'message' => 'Failed to update expenditure status'
        ], 400);
    }
}
