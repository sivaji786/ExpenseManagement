<?php

namespace App\Controllers;

use App\Models\CategoryModel;
use CodeIgniter\HTTP\ResponseInterface;

class Categories extends BaseController
{
    protected $categoryModel;

    public function __construct()
    {
        $this->categoryModel = new CategoryModel();
    }

    /**
     * Get all categories
     * GET /api/categories
     */
    public function index()
    {
        try {
            $categories = $this->categoryModel
                ->orderBy('name', 'ASC')
                ->findAll();
            
            return $this->response->setJSON([
                'status' => 'success',
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_INTERNAL_SERVER_ERROR)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Failed to fetch categories'
                ]);
        }
    }

    /**
     * Get a single category
     * GET /api/categories/:id
     */
    public function show($id = null)
    {
        try {
            $category = $this->categoryModel->find($id);
            
            if (!$category) {
                return $this->response
                    ->setStatusCode(ResponseInterface::HTTP_NOT_FOUND)
                    ->setJSON([
                        'status' => 'error',
                        'message' => 'Category not found'
                    ]);
            }
            
            return $this->response->setJSON([
                'status' => 'success',
                'data' => $category
            ]);
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_INTERNAL_SERVER_ERROR)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Failed to fetch category'
                ]);
        }
    }

    /**
     * Create a new category
     * POST /api/categories
     */
    public function create()
    {
        try {
            $data = $this->request->getJSON(true);
            
            if (!isset($data['name'])) {
                return $this->response
                    ->setStatusCode(ResponseInterface::HTTP_BAD_REQUEST)
                    ->setJSON([
                        'status' => 'error',
                        'message' => 'Category name is required'
                    ]);
            }
            
            $categoryData = [
                'name' => trim($data['name'])
            ];
            
            if ($this->categoryModel->insert($categoryData)) {
                $id = $this->categoryModel->getInsertID();
                $category = $this->categoryModel->find($id);
                
                return $this->response
                    ->setStatusCode(ResponseInterface::HTTP_CREATED)
                    ->setJSON([
                        'status' => 'success',
                        'message' => 'Category created successfully',
                        'data' => $category
                    ]);
            } else {
                $errors = $this->categoryModel->errors();
                return $this->response
                    ->setStatusCode(ResponseInterface::HTTP_BAD_REQUEST)
                    ->setJSON([
                        'status' => 'error',
                        'message' => 'Failed to create category',
                        'errors' => $errors
                    ]);
            }
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_INTERNAL_SERVER_ERROR)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Failed to create category'
                ]);
        }
    }

    /**
     * Update a category
     * PUT /api/categories/:id
     */
    public function update($id = null)
    {
        try {
            $category = $this->categoryModel->find($id);
            
            if (!$category) {
                return $this->response
                    ->setStatusCode(ResponseInterface::HTTP_NOT_FOUND)
                    ->setJSON([
                        'status' => 'error',
                        'message' => 'Category not found'
                    ]);
            }
            
            $data = $this->request->getJSON(true);
            
            if (!isset($data['name'])) {
                return $this->response
                    ->setStatusCode(ResponseInterface::HTTP_BAD_REQUEST)
                    ->setJSON([
                        'status' => 'error',
                        'message' => 'Category name is required'
                    ]);
            }
            
            $categoryData = [
                'name' => trim($data['name'])
            ];
            
            if ($this->categoryModel->update($id, $categoryData)) {
                $updatedCategory = $this->categoryModel->find($id);
                
                return $this->response->setJSON([
                    'status' => 'success',
                    'message' => 'Category updated successfully',
                    'data' => $updatedCategory
                ]);
            } else {
                $errors = $this->categoryModel->errors();
                return $this->response
                    ->setStatusCode(ResponseInterface::HTTP_BAD_REQUEST)
                    ->setJSON([
                        'status' => 'error',
                        'message' => 'Failed to update category',
                        'errors' => $errors
                    ]);
            }
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_INTERNAL_SERVER_ERROR)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Failed to update category'
                ]);
        }
    }

    /**
     * Delete a category
     * DELETE /api/categories/:id
     */
    public function delete($id = null)
    {
        try {
            $category = $this->categoryModel->find($id);
            
            if (!$category) {
                return $this->response
                    ->setStatusCode(ResponseInterface::HTTP_NOT_FOUND)
                    ->setJSON([
                        'status' => 'error',
                        'message' => 'Category not found'
                    ]);
            }
            
            if ($this->categoryModel->delete($id)) {
                return $this->response->setJSON([
                    'status' => 'success',
                    'message' => 'Category deleted successfully'
                ]);
            } else {
                return $this->response
                    ->setStatusCode(ResponseInterface::HTTP_INTERNAL_SERVER_ERROR)
                    ->setJSON([
                        'status' => 'error',
                        'message' => 'Failed to delete category'
                    ]);
            }
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_INTERNAL_SERVER_ERROR)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Failed to delete category'
                ]);
        }
    }
}
