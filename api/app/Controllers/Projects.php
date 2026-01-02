<?php

namespace App\Controllers;

use App\Models\ProjectModel;
use App\Models\ExpenditureModel;
use CodeIgniter\RESTful\ResourceController;

class Projects extends ResourceController
{
    protected $modelName = 'App\Models\ProjectModel';
    protected $format    = 'json';

    public function index()
    {
        $model = model(ProjectModel::class);
        $projects = $model->findAll();

        return $this->respond([
            'status' => 'success',
            'data' => $projects
        ]);
    }

    public function show($id = null)
    {
        $model = model(ProjectModel::class);
        $project = $model->find($id);

        if (!$project) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Project not found'
            ], 404);
        }

        return $this->respond([
            'status' => 'success',
            'data' => $project
        ]);
    }

    public function create()
    {
        $model = model(ProjectModel::class);
        
        $data = [
            'name' => $this->request->getVar('name'),
            'manager_id' => $this->request->getVar('manager_id'),
            'budget' => $this->request->getVar('budget'),
            'total_expenditure' => $this->request->getVar('total_expenditure') ?? 0,
            'status' => $this->request->getVar('status') ?? 'active',
            'start_date' => $this->request->getVar('start_date'),
            'description' => $this->request->getVar('description'),
        ];

        if ($model->insert($data)) {
            $project = $model->find($model->getInsertID());
            
            return $this->respond([
                'status' => 'success',
                'message' => 'Project created successfully',
                'data' => $project
            ], 201);
        }

        return $this->respond([
            'status' => 'error',
            'message' => 'Failed to create project',
            'errors' => $model->errors()
        ], 400);
    }

    public function update($id = null)
    {
        $model = model(ProjectModel::class);
        
        if (!$model->find($id)) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Project not found'
            ], 404);
        }

        $data = [];
        
        if ($this->request->getVar('name')) {
            $data['name'] = $this->request->getVar('name');
        }
        if ($this->request->getVar('manager_id')) {
            $data['manager_id'] = $this->request->getVar('manager_id');
        }
        if ($this->request->getVar('budget')) {
            $data['budget'] = $this->request->getVar('budget');
        }
        if ($this->request->getVar('total_expenditure') !== null) {
            $data['total_expenditure'] = $this->request->getVar('total_expenditure');
        }
        if ($this->request->getVar('status')) {
            $data['status'] = $this->request->getVar('status');
        }
        if ($this->request->getVar('start_date')) {
            $data['start_date'] = $this->request->getVar('start_date');
        }
        if ($this->request->getVar('description') !== null) {
            $data['description'] = $this->request->getVar('description');
        }

        if ($model->update($id, $data)) {
            $project = $model->find($id);
            
            return $this->respond([
                'status' => 'success',
                'message' => 'Project updated successfully',
                'data' => $project
            ]);
        }

        return $this->respond([
            'status' => 'error',
            'message' => 'Failed to update project',
            'errors' => $model->errors()
        ], 400);
    }

    public function delete($id = null)
    {
        $model = model(ProjectModel::class);
        
        if (!$model->find($id)) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Project not found'
            ], 404);
        }

        if ($model->delete($id)) {
            return $this->respond([
                'status' => 'success',
                'message' => 'Project deleted successfully'
            ]);
        }

        return $this->respond([
            'status' => 'error',
            'message' => 'Failed to delete project'
        ], 400);
    }

    public function expenditures($id = null)
    {
        $projectModel = model(ProjectModel::class);
        
        if (!$projectModel->find($id)) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Project not found'
            ], 404);
        }

        $expenditureModel = model(ExpenditureModel::class);
        $expenditures = $expenditureModel->where('project_id', $id)->findAll();

        return $this->respond([
            'status' => 'success',
            'data' => $expenditures
        ]);
    }
}
