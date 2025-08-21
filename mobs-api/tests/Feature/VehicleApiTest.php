<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Vehicle;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;

class VehicleApiTest extends TestCase
{
  // Usa o RefreshDatabase para resetar o banco de dados antes de cada teste.
  use RefreshDatabase;

  /**
   * @var User
   */
  protected $user;

  /**
   * @var string
   */
  protected $token;

  /**
   * Configuração inicial para o teste.
   * Cria um usuário e gera um token JWT para as requisições.
   *
   * @return void
   */
  protected function setUp(): void
  {
    parent::setUp();

    // Cria um usuário para o teste.
    $this->user = User::factory()->create();

    // Gera um token JWT para o usuário.
    $this->token = JWTAuth::fromUser($this->user);
  }

  /**
   * Testa o fluxo completo de criação, listagem, atualização e exclusão de veículos.
   *
   * @return void
   */
  public function test_complete_vehicle_management_flow()
  {
    // Passo 1: O teste inicia e o banco é limpo pelo RefreshDatabase.
    // Confirmar que o banco de dados está vazio no início do teste.
    $this->assertEquals(0, Vehicle::count());

    // Passo 2: Criar um Fusca.
    $fuscaData = [
      'placa' => 'FSC-1970',
      'modelo' => 'Fusca',
      'fabricante' => 'Volkswagen',
      'ano' => 1970,
    ];
    $this->postJson('/api/vehicles', $fuscaData, [
      'Authorization' => 'Bearer ' . $this->token,
    ])
      ->assertStatus(201)
      ->assertJson([
        'placa' => 'FSC-1970',
      ]);

    // Passo 3: Criar um Camaro.
    $camaroData = [
      'placa' => 'CMR-2022',
      'modelo' => 'Camaro',
      'fabricante' => 'Chevrolet',
      'ano' => 2022,
    ];
    $this->postJson('/api/vehicles', $camaroData, [
      'Authorization' => 'Bearer ' . $this->token,
    ])
      ->assertStatus(201)
      ->assertJson([
        'placa' => 'CMR-2022',
      ]);

    // Passo 4: Vê se existem 2 carros no banco.
    $response = $this->getJson('/api/vehicles', [
      'Authorization' => 'Bearer ' . $this->token,
    ]);
    $response->assertStatus(200)
      ->assertJsonCount(2);

    // Passo 5: Apaga o Fusca.
    $this->deleteJson('/api/vehicles/FSC-1970', [], [
      'Authorization' => 'Bearer ' . $this->token,
    ])
      ->assertStatus(204);

    // Passo 6: Vê se o Fusca foi apagado.
    $this->assertEquals(1, Vehicle::count());
    $this->getJson('/api/vehicles/FSC-1970', [
      'Authorization' => 'Bearer ' . $this->token,
    ])
      ->assertStatus(404)
      ->assertJson([
        'message' => 'Veículo não encontrado.'
      ]);

    // Passo 7: Atualiza o Camaro para um ano diferente.
    $updatedAno = 2023;
    // Pega os dados atuais do Camaro para incluir na requisição PUT
    $camaro = Vehicle::where('placa', 'CMR-2022')->first();
    $this->putJson('/api/vehicles/CMR-2022', [
      'placa' => $camaro->placa,
      'modelo' => $camaro->modelo,
      'fabricante' => $camaro->fabricante,
      'ano' => $updatedAno
    ], [
      'Authorization' => 'Bearer ' . $this->token,
    ])
      ->assertStatus(200)
      ->assertJson([
        'placa' => 'CMR-2022',
        'ano' => $updatedAno
      ]);

    // Passo 8: Vê se o Camaro está com o ano atualizado.
    $camaroAtualizado = Vehicle::where('placa', 'CMR-2022')->first();
    $this->assertEquals($updatedAno, $camaroAtualizado->ano);

    // Passo 9: Fim do teste.
  }
}
