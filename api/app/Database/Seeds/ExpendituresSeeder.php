<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class ExpendituresSeeder extends Seeder
{
    public function run()
    {
        $data = [
            // Connaught Place Metro Hub (project_id = 1)
            ['project_id' => 1, 'category' => 'Materials', 'amount' => 3200000, 'description' => 'TMT steel bars and RCC concrete', 'date' => '2024-01-20', 'created_by' => 2, 'status' => 'approved'],
            ['project_id' => 1, 'category' => 'Labor', 'amount' => 2850000, 'description' => 'Construction labor - Q1', 'date' => '2024-02-15', 'created_by' => 2, 'status' => 'approved'],
            ['project_id' => 1, 'category' => 'Equipment', 'amount' => 1650000, 'description' => 'Excavator and crane rental', 'date' => '2024-02-20', 'created_by' => 2, 'status' => 'approved'],
            ['project_id' => 1, 'category' => 'Materials', 'amount' => 2400000, 'description' => 'Cement and bricks from ACC', 'date' => '2024-03-10', 'created_by' => 2, 'status' => 'approved'],
            ['project_id' => 1, 'category' => 'Permits', 'amount' => 625000, 'description' => 'DMRC approvals and NOCs', 'date' => '2024-01-18', 'created_by' => 2, 'status' => 'approved'],
            ['project_id' => 1, 'category' => 'Safety', 'amount' => 350000, 'description' => 'Safety gear and OHSAS compliance', 'date' => '2024-03-25', 'created_by' => 2, 'status' => 'approved'],
            ['project_id' => 1, 'category' => 'Labor', 'amount' => 2400000, 'description' => 'Construction labor - Q2', 'date' => '2024-04-15', 'created_by' => 2, 'status' => 'pending'],
            
            // Mumbai-Pune Expressway (project_id = 2)
            ['project_id' => 2, 'category' => 'Materials', 'amount' => 7650000, 'description' => 'Bitumen and aggregate from L&T', 'date' => '2024-02-10', 'created_by' => 3, 'status' => 'approved'],
            ['project_id' => 2, 'category' => 'Equipment', 'amount' => 5850000, 'description' => 'Paver machines and soil compactors', 'date' => '2024-02-15', 'created_by' => 3, 'status' => 'approved'],
            ['project_id' => 2, 'category' => 'Labor', 'amount' => 4680000, 'description' => 'Highway construction crew - Feb-Mar', 'date' => '2024-03-01', 'created_by' => 3, 'status' => 'approved'],
            ['project_id' => 2, 'category' => 'Subcontractor', 'amount' => 3780000, 'description' => 'Flyover foundation by Gammon India', 'date' => '2024-03-15', 'created_by' => 3, 'status' => 'approved'],
            ['project_id' => 2, 'category' => 'Materials', 'amount' => 3420000, 'description' => 'Pre-stressed concrete girders', 'date' => '2024-04-01', 'created_by' => 3, 'status' => 'approved'],
            ['project_id' => 2, 'category' => 'Safety', 'amount' => 765000, 'description' => 'Traffic diversion and safety barriers', 'date' => '2024-02-08', 'created_by' => 3, 'status' => 'approved'],
            ['project_id' => 2, 'category' => 'Consulting', 'amount' => 1305000, 'description' => 'NHAI inspection and quality testing', 'date' => '2024-04-10', 'created_by' => 3, 'status' => 'pending'],
            ['project_id' => 2, 'category' => 'Environmental', 'amount' => 1800000, 'description' => 'Green belt development and noise barriers', 'date' => '2024-04-15', 'created_by' => 3, 'status' => 'pending'],
            
            // Bangalore IT Park (project_id = 3)
            ['project_id' => 3, 'category' => 'Equipment', 'amount' => 4800000, 'description' => 'Tower cranes and concrete pumps', 'date' => '2024-01-15', 'created_by' => 4, 'status' => 'approved'],
            ['project_id' => 3, 'category' => 'Materials', 'amount' => 3800000, 'description' => 'Steel structure from Tata Steel', 'date' => '2024-01-25', 'created_by' => 4, 'status' => 'approved'],
            ['project_id' => 3, 'category' => 'Labor', 'amount' => 2720000, 'description' => 'Skilled construction workers - Jan-Feb', 'date' => '2024-02-28', 'created_by' => 4, 'status' => 'approved'],
            ['project_id' => 3, 'category' => 'Subcontractor', 'amount' => 3400000, 'description' => 'HVAC and electrical by Voltas', 'date' => '2024-03-10', 'created_by' => 4, 'status' => 'approved'],
            ['project_id' => 3, 'category' => 'Safety', 'amount' => 960000, 'description' => 'Fire safety systems and equipment', 'date' => '2024-02-01', 'created_by' => 4, 'status' => 'approved'],
            ['project_id' => 3, 'category' => 'Permits', 'amount' => 2250000, 'description' => 'BDA and KSPCB clearances', 'date' => '2024-01-12', 'created_by' => 4, 'status' => 'approved'],
            ['project_id' => 3, 'category' => 'Consulting', 'amount' => 1440000, 'description' => 'Structural audit and soil testing', 'date' => '2024-03-20', 'created_by' => 4, 'status' => 'pending'],
            ['project_id' => 3, 'category' => 'Materials', 'amount' => 2160000, 'description' => 'Glass facade from Saint-Gobain', 'date' => '2024-04-05', 'created_by' => 4, 'status' => 'rejected'],
            
            // Gurgaon Residential Township (project_id = 4)
            ['project_id' => 4, 'category' => 'Materials', 'amount' => 5440000, 'description' => 'Foundation work - RCC and waterproofing', 'date' => '2024-03-05', 'created_by' => 2, 'status' => 'approved'],
            ['project_id' => 4, 'category' => 'Labor', 'amount' => 3360000, 'description' => 'Mason and construction labor - March', 'date' => '2024-03-30', 'created_by' => 2, 'status' => 'approved'],
            ['project_id' => 4, 'category' => 'Equipment', 'amount' => 1480000, 'description' => 'Concrete mixers and construction tools', 'date' => '2024-03-10', 'created_by' => 2, 'status' => 'approved'],
            ['project_id' => 4, 'category' => 'Materials', 'amount' => 4160000, 'description' => 'Red bricks and fly ash blocks', 'date' => '2024-04-08', 'created_by' => 2, 'status' => 'approved'],
            ['project_id' => 4, 'category' => 'Permits', 'amount' => 520000, 'description' => 'DTCP approvals and building plan sanction', 'date' => '2024-03-02', 'created_by' => 2, 'status' => 'approved'],
            ['project_id' => 4, 'category' => 'Utilities', 'amount' => 1160000, 'description' => 'Water supply and sewage connections', 'date' => '2024-04-12', 'created_by' => 2, 'status' => 'pending'],
            ['project_id' => 4, 'category' => 'Landscaping', 'amount' => 680000, 'description' => 'Garden development and compound wall', 'date' => '2024-04-18', 'created_by' => 2, 'status' => 'pending'],
        ];

        foreach ($data as &$item) {
            $item['created_at'] = date('Y-m-d H:i:s');
            $item['updated_at'] = date('Y-m-d H:i:s');
        }

        $this->db->table('expenditures')->insertBatch($data);
    }
}
