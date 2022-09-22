cd /d %~dp0
echo tailwind builder!!!
if [%1]==[] GOTO runAllTailwind
        set IN="src/style/tailwind/%1_tailwind.css"
        set OUT="src/style/compiled/%1.css"


echo %1>>tailwindNames.txt
echo @tailwind base;>>%IN%
echo @tailwind components;>>%IN%
echo @tailwind utilities;>>%IN%
echo.>>%OUT%




echo "added %1 to registry"
EXIT
:runAllTailwind
echo starting tailwind watch mode:
setlocal enabledelayedexpansion
for /f "tokens=*" %%a in (tailwindNames.txt) do (
        set currentIN="src/style/tailwind/%%a_tailwind.css"
        set currentOUT="src/style/compiled/%%a.css"
        start /min cmd.exe  /c "npx tailwindcss -i !currentIN! -o !currentOUT! --watch"

        )
EXIT