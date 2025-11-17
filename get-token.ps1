# Script PowerShell para extrair token de autenticação
param(
    [string]$email = "cliente@example.com",
    [string]$password = "minhasenha123"
)

$body = @{
    email = $email
    password = $password
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body
    
    if ($response.token) {
        Write-Output $response.token
    } else {
        Write-Error "Token não encontrado na resposta: $($response | ConvertTo-Json)"
        exit 1
    }
} catch {
    Write-Error "Erro ao fazer login: $_"
    exit 1
}

