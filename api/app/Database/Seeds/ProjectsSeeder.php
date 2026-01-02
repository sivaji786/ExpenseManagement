<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class ProjectsSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'id'                => 1,
                'name'              => 'Connaught Place Metro Hub',
                'manager_id'        => 2,
                'budget'            => 18500000,
                'total_expenditure' => 13475000,
                'status'            => 'active',
                'start_date'        => '2024-01-15',
                'description'       => 'Underground metro interchange station with 3 platforms in Delhi',
                'created_at'        => date('Y-m-d H:i:s'),
                'updated_at'        => date('Y-m-d H:i:s'),
            ],
            [
                'id'                => 2,
                'name'              => 'Mumbai-Pune Expressway Extension',
                'manager_id'        => 3,
                'budget'            => 45000000,
                'total_expenditure' => 29250000,
                'status'            => 'active',
                'start_date'        => '2024-02-01',
                'description'       => 'Widening of 18km expressway section with flyover construction',
                'created_at'        => date('Y-m-d H:i:s'),
                'updated_at'        => date('Y-m-d H:i:s'),
            ],
            [
                'id'                => 3,
                'name'              => 'Bangalore IT Park - Phase 3',
                'manager_id'        => 4,
                'budget'            => 35000000,
                'total_expenditure' => 19500000,
                'status'            => 'on-hold',
                'start_date'        => '2024-01-10',
                'description'       => '12-building tech campus with parking and amenities in Whitefield',
                'created_at'        => date('Y-m-d H:i:s'),
                'updated_at'        => date('Y-m-d H:i:s'),
            ],
            [
                'id'                => 4,
                'name'              => 'Gurgaon Residential Township',
                'manager_id'        => 2,
                'budget'            => 28000000,
                'total_expenditure' => 16800000,
                'status'            => 'active',
                'start_date'        => '2024-03-01',
                'description'       => '500-unit gated community with clubhouse and green spaces',
                'created_at'        => date('Y-m-d H:i:s'),
                'updated_at'        => date('Y-m-d H:i:s'),
            ],
        ];

        $this->db->table('projects')->insertBatch($data);
    }
}
