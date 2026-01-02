<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            ['name' => 'Materials'],
            ['name' => 'Labor'],
            ['name' => 'Equipment'],
            ['name' => 'Subcontractor'],
            ['name' => 'Permits'],
            ['name' => 'Safety'],
            ['name' => 'Consulting'],
            ['name' => 'Environmental'],
            ['name' => 'Utilities'],
            ['name' => 'Landscaping'],
            ['name' => 'Transportation'],
            ['name' => 'Insurance'],
            ['name' => 'Other'],
        ];

        foreach ($categories as $category) {
            $this->db->table('categories')->insert($category);
        }
    }
}
