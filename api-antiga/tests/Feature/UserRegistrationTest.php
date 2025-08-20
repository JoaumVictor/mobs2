<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;

class UserRegistrationTest extends TestCase
{
    // A trait `RefreshDatabase` limpa o banco de dados antes de cada teste.
    use RefreshDatabase;

    /**
     * @test
     * A basic feature test for user registration.
     */
    public function a_user_can_be_registered()
    {
        // 1. Simular os dados da requisição
        $userData = [
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        // 2. Fazer uma requisição POST para a rota de registro.
        // O `postJson` simula uma requisição de API com dados JSON.
        $response = $this->postJson('/api/register', $userData);

        // 3. Verificar o resultado do teste.
        // O `assertStatus` verifica se a resposta HTTP é 201 (Created).
        $response->assertStatus(201);

        // O `assertJson` verifica se a resposta JSON contém a mensagem de sucesso.
        $response->assertJson(['message' => 'User registered successfully']);

        // O `assertDatabaseHas` verifica se a tabela `users` tem uma entrada com os dados do e-mail.
        // Isso confirma que o usuário foi realmente salvo no banco.
        $this->assertDatabaseHas('users', [
            'email' => 'john.doe@example.com',
        ]);
    }
}
