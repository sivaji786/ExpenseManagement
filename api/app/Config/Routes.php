<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// API Routes
$routes->group('api', function($routes) {
    
    // Handle OPTIONS preflight requests for CORS
    $routes->options('(:any)', function() {
        $response = service('response');
        $response->setStatusCode(200);
        return $response;
    });
    
    // Authentication routes
    $routes->post('auth/login', 'Auth::login');
    $routes->post('auth/logout', 'Auth::logout');
    $routes->get('auth/me', 'Auth::me');
    
    // User routes
    $routes->get('users', 'Users::index');
    $routes->get('users/(:num)', 'Users::show/$1');
    $routes->post('users', 'Users::create');
    $routes->put('users/(:num)', 'Users::update/$1');
    $routes->delete('users/(:num)', 'Users::delete/$1');
    
    // Projects routes
    $routes->get('projects', 'Projects::index');
    $routes->get('projects/(:num)', 'Projects::show/$1');
    $routes->post('projects', 'Projects::create');
    $routes->put('projects/(:num)', 'Projects::update/$1');
    $routes->delete('projects/(:num)', 'Projects::delete/$1');
    $routes->get('projects/(:num)/expenditures', 'Projects::expenditures/$1');
    
    // Expenditures routes
    $routes->get('expenditures', 'Expenditures::index');
    $routes->get('expenditures/(:num)', 'Expenditures::show/$1');
    $routes->post('expenditures', 'Expenditures::create');
    $routes->put('expenditures/(:num)', 'Expenditures::update/$1');
    $routes->delete('expenditures/(:num)', 'Expenditures::delete/$1');
    $routes->patch('expenditures/(:num)/status', 'Expenditures::updateStatus/$1');
    
    // Categories routes
    $routes->get('categories', 'Categories::index');
    $routes->get('categories/(:num)', 'Categories::show/$1');
    $routes->post('categories', 'Categories::create');
    $routes->put('categories/(:num)', 'Categories::update/$1');
    $routes->delete('categories/(:num)', 'Categories::delete/$1');
});

