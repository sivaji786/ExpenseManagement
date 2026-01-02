<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateProjectsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'name' => [
                'type'       => 'VARCHAR',
                'constraint' => '200',
            ],
            'manager_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'budget' => [
                'type'       => 'DECIMAL',
                'constraint' => '15,2',
            ],
            'total_expenditure' => [
                'type'       => 'DECIMAL',
                'constraint' => '15,2',
                'default'    => 0,
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['active', 'completed', 'on-hold'],
                'default'    => 'active',
            ],
            'start_date' => [
                'type' => 'DATE',
            ],
            'description' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'created_at' => [
                'type' => 'TIMESTAMP',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'TIMESTAMP',
                'null' => true,
            ],
        ]);
        
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('manager_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('projects');
    }

    public function down()
    {
        $this->forge->dropTable('projects');
    }
}
