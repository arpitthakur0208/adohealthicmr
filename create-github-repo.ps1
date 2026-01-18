# PowerShell script to create GitHub repository via API
# This requires a GitHub Personal Access Token

param(
    [Parameter(Mandatory=$true)]
    [string]$Token,
    
    [string]$RepoName = "adohealthicmr",
    [string]$Username = "rajputarpitthakur-hash",
    [string]$Description = "ADO Health ICMR Project",
    [switch]$Private = $false
)

Write-Host "Creating GitHub repository..." -ForegroundColor Green

$headers = @{
    "Authorization" = "token $Token"
    "Accept" = "application/vnd.github.v3+json"
    "User-Agent" = "PowerShell"
}

$body = @{
    name = $RepoName
    description = $Description
    private = $Private.IsPresent
    auto_init = $false
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
    
    Write-Host "Repository created successfully!" -ForegroundColor Green
    Write-Host "Repository URL: $($response.html_url)" -ForegroundColor Cyan
    Write-Host "`nNow you can push your code:" -ForegroundColor Yellow
    Write-Host "  & 'C:\Program Files\Git\bin\git.exe' push -u origin main" -ForegroundColor White
    
    return $response
} catch {
    Write-Host "Error creating repository:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "`nAuthentication failed. Please check your token." -ForegroundColor Yellow
    } elseif ($_.Exception.Response.StatusCode -eq 422) {
        Write-Host "`nRepository might already exist or name is invalid." -ForegroundColor Yellow
    }
    
    throw
}
