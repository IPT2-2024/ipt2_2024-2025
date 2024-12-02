<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Profile;

class ProfileControllerTest extends TestCase
{
    /** @test */
    public function it_can_list_all_profiles()
    {
        Profile::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'age' => 25,
            'address' => '123 Main St',
            'sex' => 'male',
            'user_id' => 3,
        ]);

        $response = $this->getJson('/api/profiles');

        $response->assertStatus(200)
                 ->assertJsonFragment(['first_name' => 'John'])
                 ->assertJsonFragment(['last_name' => 'Doe']);
    }

    /** @test */
    public function it_can_show_a_single_profile()
    {
        $profile = Profile::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'age' => 25,
            'address' => '123 Main St',
            'sex' => 'male',
            'user_id' => 3,
        ]);

        $response = $this->getJson('/api/profiles/' . $profile->id);

        $response->assertStatus(200)
                 ->assertJsonFragment(['first_name' => 'John'])
                 ->assertJsonFragment(['last_name' => 'Doe']);
    }

    /** @test */
    public function it_can_create_a_new_profile()
    {
        $response = $this->postJson('/api/profiles', [
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'age' => 30,
            'address' => '456 Oak St',
            'sex' => 'female',
            'user_id' => 3,
        ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['first_name' => 'Jane']);

        $this->assertDatabaseHas('profiles', ['first_name' => 'Jane', 'last_name' => 'Smith']);
    }

    /** @test */
    public function it_can_update_a_profile()
    {
        $profile = Profile::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'age' => 25,
            'address' => '123 Main St',
            'sex' => 'male',
            'user_id' => 3,
        ]);

        $response = $this->putJson('/api/profiles/' . $profile->id, [
            'first_name' => 'Johnny',
            'last_name' => 'Smith',
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['first_name' => 'Johnny']);

        $this->assertDatabaseHas('profiles', ['first_name' => 'Johnny', 'last_name' => 'Smith']);
    }

    /** @test */
    public function it_can_delete_a_profile()
    {
        $profile = Profile::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'age' => 25,
            'address' => '123 Main St',
            'sex' => 'male',
            'user_id' => 3,
        ]);

        $response = $this->deleteJson('/api/profiles/' . $profile->id);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Profile deleted successfully']);

        $this->assertSoftDeleted('profiles', ['id' => $profile->id]);
    }
}
