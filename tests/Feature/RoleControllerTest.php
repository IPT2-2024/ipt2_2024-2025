<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Role;

class RoleControllerTest extends TestCase
{
    /** @test */
    public function it_can_list_all_roles()
    {
        // Act: Make a GET request to list all roles
        $response = $this->getJson('/api/roles');

        // Assert: Verify the response status and structure
        $response->assertStatus(200);

        // Check specific data exists in the response (replace these with your actual predefined role names)
        $response->assertJsonFragment(['role_name' => 'superadmin']);
        $response->assertJsonFragment(['role_name' => 'admin']);
        $response->assertJsonFragment(['role_name' => 'teacher']);
        $response->assertJsonFragment(['role_name' => 'student']);
    }

    /** @test */
    public function it_can_create_a_new_role()
    {
        // Act: Make a POST request to create a new role
        $response = $this->postJson('/api/roles', ['role_name' => 'test_role']);

        // Assert: Verify the response
        $response->assertStatus(201)
                 ->assertJsonFragment(['role_name' => 'test_role']);

        // Verify the role exists in the database
        $this->assertDatabaseHas('roles', ['role_name' => 'test_role']);

        // Cleanup: Delete the role after testing
        Role::where('role_name', 'test_role')->delete();
    }

    /** @test */
    public function it_validates_when_creating_a_role()
    {
        // Act: Make a POST request with invalid data
        $response = $this->postJson('/api/roles', ['role_name' => '']);

        // Assert: Verify validation errors
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['role_name']);
    }

    /** @test */
    public function it_can_show_a_single_role()
    {
        // Arrange: Use an existing role from the database
        $role = Role::firstOrFail();

        // Act: Make a GET request to show the role
        $response = $this->getJson('/api/roles/' . $role->id);

        // Assert: Verify the response
        $response->assertStatus(200)
                 ->assertJsonFragment(['role_name' => $role->role_name]);
    }

    /** @test */
    public function it_can_update_a_role()
    {
        // Arrange: Create a temporary role for testing
        $role = Role::create(['role_name' => 'temporary_role']);

        // Act: Make a PUT request to update the role
        $response = $this->putJson('/api/roles/' . $role->id, ['role_name' => 'updated_role']);

        // Assert: Verify the response and database
        $response->assertStatus(200)
                 ->assertJsonFragment(['role_name' => 'updated_role']);

        $this->assertDatabaseHas('roles', ['role_name' => 'updated_role']);
        $this->assertDatabaseMissing('roles', ['role_name' => 'temporary_role']);

        // Cleanup: Delete the updated role after testing
        $role->delete();
    }

    /** @test */
    public function it_can_delete_a_role()
    {
        // Arrange: Create a temporary role for testing
        $role = Role::create(['role_name' => 'deletable_role']);

        // Act: Make a DELETE request to delete the role
        $response = $this->deleteJson('/api/roles/' . $role->id);

        // Assert: Verify the response and ensure the role is soft deleted
        $response->assertStatus(200)
                ->assertJson(['message' => 'Role was successfully deleted']);

        // Check if the role is soft deleted
        $this->assertSoftDeleted('roles', ['id' => $role->id]);
    }
}
