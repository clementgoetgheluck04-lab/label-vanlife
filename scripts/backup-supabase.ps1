param(
  [string]$DatabaseUrl = $env:DATABASE_URL,
  [string]$OutputDirectory = "backups"
)

$ErrorActionPreference = "Stop"

if (-not $DatabaseUrl) {
  throw "DATABASE_URL est requis. Utilisez la connexion directe Supabase, pas le pooler transactionnel."
}

$pgDump = Get-Command pg_dump -ErrorAction SilentlyContinue
$pgRestore = Get-Command pg_restore -ErrorAction SilentlyContinue
if (-not $pgDump -or -not $pgRestore) {
  throw "pg_dump et pg_restore sont requis pour créer et vérifier la sauvegarde."
}

$workspace = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$output = [System.IO.Path]::GetFullPath((Join-Path $workspace $OutputDirectory))
if (-not $output.StartsWith($workspace, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Le dossier de sauvegarde doit rester dans le workspace."
}

New-Item -ItemType Directory -Path $output -Force | Out-Null
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupPath = Join-Path $output "label-vanlife-$timestamp.dump"
$listPath = "$backupPath.list.txt"
$checksumPath = "$backupPath.sha256"

& $pgDump.Source --dbname=$DatabaseUrl --format=custom --no-owner --no-privileges --file=$backupPath
if ($LASTEXITCODE -ne 0) { throw "pg_dump a échoué avec le code $LASTEXITCODE." }

& $pgRestore.Source --list $backupPath | Set-Content -LiteralPath $listPath -Encoding utf8
if ($LASTEXITCODE -ne 0) { throw "La vérification pg_restore a échoué avec le code $LASTEXITCODE." }

$hash = (Get-FileHash -LiteralPath $backupPath -Algorithm SHA256).Hash.ToLowerInvariant()
"$hash  $([System.IO.Path]::GetFileName($backupPath))" | Set-Content -LiteralPath $checksumPath -Encoding ascii

[pscustomobject]@{
  Backup = $backupPath
  Bytes = (Get-Item -LiteralPath $backupPath).Length
  Sha256 = $hash
  Catalog = $listPath
}

