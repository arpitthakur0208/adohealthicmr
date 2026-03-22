# Renames the project folder from adohealthicmr-theFinalPush-main -> adohealthicmr.
# Required: close Cursor/VS Code (and any terminals) using this folder first, or Windows will block the rename.
param(
    [string]$Parent = (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent)
)
$oldPath = Join-Path $Parent "adohealthicmr-theFinalPush-main"
$newPath = Join-Path $Parent "adohealthicmr"
if (Test-Path $newPath) {
    Write-Error "Already exists: $newPath"
    exit 1
}
if (-not (Test-Path $oldPath)) {
    Write-Error "Not found: $oldPath"
    exit 1
}
Rename-Item -LiteralPath $oldPath -NewName "adohealthicmr"
Write-Host "OK: $newPath"
