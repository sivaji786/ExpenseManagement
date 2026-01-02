<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class Cors implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        // Set CORS headers using native PHP header() function
        // This ensures they are always sent
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, PATCH, DELETE');
        header('Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization');
        header('Access-Control-Max-Age: 86400'); // 24 hours
        
        // Handle preflight OPTIONS request
        if ($request->getMethod() === 'options') {
            http_response_code(200);
            exit(0);
        }
        
        return $request;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Ensure CORS headers are also in the response object
        $response->setHeader('Access-Control-Allow-Origin', '*');
        $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        $response->setHeader('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization');
        
        return $response;
    }
}
