$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$fontCss = Get-Content -LiteralPath 'sources/fonts.css' -Raw
$blocks = [regex]::Matches($fontCss, '@font-face\s*\{[^}]+\}')
$localCss = ''
foreach ($block in $blocks) {
  $family = [regex]::Match($block.Value, "font-family: '([^']+)'").Groups[1].Value
  $weight = [regex]::Match($block.Value, 'font-weight: (\d+)').Groups[1].Value
  $fontUrl = [regex]::Match($block.Value, 'url\((https://fonts.gstatic.com/[^)]+)\)').Groups[1].Value
  if (-not $fontUrl) { throw 'Unexpected font source.' }
  $fontName = ($family.ToLower().Replace(' ', '-')) + '-' + $weight + '.ttf'
  Invoke-WebRequest -Uri $fontUrl -UseBasicParsing -TimeoutSec 30 -OutFile (Join-Path 'assets' $fontName)
  $localCss += $block.Value.Replace($fontUrl, $fontName) + "`n"
}
[System.IO.File]::WriteAllText((Join-Path (Get-Location) 'assets/fonts.css'), $localCss)
Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/OFL.txt' -UseBasicParsing -TimeoutSec 30 -OutFile 'assets/DM-Sans-OFL.txt'
Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/OFL.txt' -UseBasicParsing -TimeoutSec 30 -OutFile 'assets/Manrope-OFL.txt'
Write-Output 'Local fonts and licenses saved.'
