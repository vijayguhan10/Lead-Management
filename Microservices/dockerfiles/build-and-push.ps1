param(
    [string]$tag = "latest",
    [string]$dockerHubUser = "vijay4230"
)

function Build-And-Push($serviceName, $dockerfilePath, $contextPath, $port) {
    if (-not (Test-Path $contextPath)) {
        Write-Host "[SKIP] Service folder not found: $contextPath" -ForegroundColor Yellow
        return
    }

    $imageName = "$dockerHubUser/$serviceName:$tag"
    Write-Host "[BUILD] $serviceName -> $imageName" -ForegroundColor Cyan
    try {
        docker build -f $dockerfilePath -t $imageName $contextPath
        if ($LASTEXITCODE -ne 0) { throw "Build failed for $serviceName" }

        Write-Host "[PUSH] $imageName" -ForegroundColor Cyan
        docker push $imageName
        if ($LASTEXITCODE -ne 0) { throw "Push failed for $serviceName" }

        Write-Host "[OK] $serviceName pushed as $imageName" -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] $_" -ForegroundColor Red
    }
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $root

$services = @(
    @{ name = 'auth-service'; dockerfile = "auth-service.Dockerfile"; folder = '..\auth-service' },
    @{ name = 'call-service'; dockerfile = "call-service.Dockerfile"; folder = '..\call-service' },
    @{ name = 'lead-service'; dockerfile = "lead-service.Dockerfile"; folder = '..\lead-service' },
    @{ name = 'media-service'; dockerfile = "media-service.Dockerfile"; folder = '..\media-service' },
    @{ name = 'notification-service'; dockerfile = "notification-service.Dockerfile"; folder = '..\notification-service' },
    @{ name = 'Telecaller-service'; dockerfile = "Telecaller-service.Dockerfile"; folder = '..\Telecaller-service' },
    @{ name = 'user-service'; dockerfile = "user-service.Dockerfile"; folder = '..\user-service' }
)

foreach ($s in $services) {
    $df = Join-Path $root $s.dockerfile
    $ctx = Join-Path $root $s.folder
    Build-And-Push $s.name $df $ctx 0
}

Write-Host "All done." -ForegroundColor Green
