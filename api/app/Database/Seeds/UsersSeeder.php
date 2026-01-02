<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class UsersSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'id'         => 1,
                'username'   => 'admin',
                'password'   => password_hash('admin123', PASSWORD_DEFAULT),
                'role'       => 'admin',
                'name'       => 'Super Admin',
                'email'      => 'admin@company.com',
                'project_id' => null,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id'         => 2,
                'username'   => 'manager1',
                'password'   => password_hash('manager123', PASSWORD_DEFAULT),
                'role'       => 'manager',
                'name'       => 'John Smith',
                'email'      => 'john.smith@company.com',
                'project_id' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id'         => 3,
                'username'   => 'manager2',
                'password'   => password_hash('manager123', PASSWORD_DEFAULT),
                'role'       => 'manager',
                'name'       => 'Sarah Johnson',
                'email'      => 'sarah.johnson@company.com',
                'project_id' => 2,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id'         => 4,
                'username'   => 'manager3',
                'password'   => password_hash('manager123', PASSWORD_DEFAULT),
                'role'       => 'manager',
                'name'       => 'Mike Davis',
                'email'      => 'mike.davis@company.com',
                'project_id' => 3,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
        ];

        $this->db->table('users')->insertBatch($data);
    }
}
